import { FunctionComponent, createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import LitJsSdk from 'lit-js-sdk';
import Krebit from '@krebitdao/reputation-passport';
import { Orbis } from '@orbisclub/orbis-sdk';
import { Passport } from '@krebitdao/reputation-passport/dist/core';

import { getWalletInformation } from 'utils';

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
  const [profile, setProfile] = useState();
  const [openConnectWallet, setOpenConnectWallet] = useState(false);
  const [status, setStatus] = useState('idle');
  const [passport, setPassport] = useState<Passport>();
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
        network: process.env.NEXT_PUBLIC_NETWORK as 'mumbai'
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
        litSdk: LitJsSdk
      });
      const isConnected = await passport.isConnected();

      if (isConnected) {
        setPassport(passport);
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
        litSdk: LitJsSdk
      });
      const connection = await passport.connect();

      if (connection) {
        setPassport(passport);

        const orbis = new Orbis();
        setOrbis(orbis);

        if (orbis) {
          push(`/${passport.did}`);
        }
      }
    } catch (error) {
      setStatus('rejected');
    }
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
          isAuthenticated: status === 'resolved'
        },
        walletInformation: {
          ...walletInformation,
          passport,
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
