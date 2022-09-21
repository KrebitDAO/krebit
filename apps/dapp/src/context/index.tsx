import { FunctionComponent, createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import LitJsSdk from 'lit-js-sdk';
import Krebit from '@krebitdao/reputation-passport';
import { Orbis } from '@orbisclub/orbis-sdk';
import {
  Passport,
  Krebit as Issuer
} from '@krebitdao/reputation-passport/dist/core';

import { getWalletInformation, normalizeSchema } from 'utils';

// types
import { IProfile } from 'utils/normalizeSchema';

interface IProps {
  children: JSX.Element;
}

export interface IWalletInformation {
  ethProvider: ethers.providers.ExternalProvider;
  address: string;
  wallet: ethers.providers.JsonRpcSigner;
}

export const GeneralContext = createContext(undefined);

export const GeneralProvider: FunctionComponent<IProps> = props => {
  const { children } = props;
  const [profile, setProfile] = useState<IProfile | undefined>();
  const [openConnectWallet, setOpenConnectWallet] = useState(false);
  const [status, setStatus] = useState('idle');
  const [passport, setPassport] = useState<Passport>();
  const [issuer, setIssuer] = useState<Issuer>();
  const [publicPassport, setPublicPassport] = useState<Passport>();
  const [orbis, setOrbis] = useState<Orbis>();
  const [walletInformation, setWalletInformation] = useState<
    IWalletInformation | undefined
  >();
  const { push } = useRouter();

  useEffect(() => {
    const isAuthenticated = async () => {
      setStatus('pending');

      const publicPassport = new Krebit.core.Passport({
        network: process.env.NEXT_PUBLIC_NETWORK as 'mumbai',
        ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
      });
      setPublicPassport(publicPassport);

      const orbis = new Orbis();
      setOrbis(orbis);

      const currentType = localStorage.getItem('auth-type');

      if (!currentType) {
        setStatus('resolved');
        return;
      }

      const information = await getWalletInformation(currentType);
      setWalletInformation(information);

      const passport = new Krebit.core.Passport({
        network: process.env.NEXT_PUBLIC_NETWORK as 'mumbai',
        ethProvider: information.ethProvider,
        address: information.address,
        litSdk: LitJsSdk,
        ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
      });
      const isPassportConnected = await passport.isConnected();

      const issuer = new Krebit.core.Krebit({
        network: process.env.NEXT_PUBLIC_NETWORK as 'mumbai',
        ethProvider: information.ethProvider,
        address: information.address,
        wallet: information.wallet,
        litSdk: LitJsSdk,
        ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
      });
      const isIssuerConnected = await issuer.isConnected();

      if (isPassportConnected && isIssuerConnected) {
        const currentProfile = await normalizeSchema.profile(passport, orbis);

        setPassport(passport);
        setIssuer(issuer);
        setProfile(currentProfile);
      }

      setStatus('resolved');
    };

    isAuthenticated();
  }, []);

  const handleOpenConnectWallet = () => {
    setOpenConnectWallet(prevState => !prevState);
  };

  const handleSetProfile = profile => {
    setProfile(profile);
  };

  const connect = async (type: string) => {
    setStatus('pending');

    try {
      const information = await getWalletInformation(type);
      setWalletInformation(information);
      localStorage.setItem('auth-type', type);

      const passport = new Krebit.core.Passport({
        network: process.env.NEXT_PUBLIC_NETWORK as 'mumbai',
        ethProvider: information.ethProvider,
        address: information.address,
        litSdk: LitJsSdk,
        ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
      });
      const passportConnection = await passport.connect();

      const issuer = new Krebit.core.Krebit({
        network: process.env.NEXT_PUBLIC_NETWORK as 'mumbai',
        ethProvider: information.ethProvider,
        address: information.address,
        wallet: information.wallet,
        litSdk: LitJsSdk,
        ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
      });
      const issuerConnection = await issuer.connect();

      if (passportConnection && issuerConnection) {
        setPassport(passport);
        setIssuer(issuer);

        const orbis = new Orbis();
        setOrbis(orbis);

        if (orbis) {
          const currentProfile = await normalizeSchema.profile(passport, orbis);

          setProfile(currentProfile);
          setStatus('resolved');

          push(`/${passport.did}`);
        }
      }
    } catch (error) {
      setStatus('rejected');
    }
  };

  const logout = () => {
    if (!window) return;

    window.localStorage.removeItem('auth-type');
    window.localStorage.removeItem('ceramic-session');
    setProfile(undefined);
    setPassport(undefined);
  };

  return (
    <GeneralContext.Provider
      value={{
        walletModal: {
          handleOpenConnectWallet,
          openConnectWallet
        },
        auth: {
          connect,
          isAuthenticated: status === 'resolved' && !!passport?.did,
          status,
          did: passport?.did,
          logout
        },
        walletInformation: {
          ...walletInformation,
          passport,
          issuer,
          publicPassport,
          orbis
        },
        profileInformation: {
          handleSetProfile,
          profile
        }
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
