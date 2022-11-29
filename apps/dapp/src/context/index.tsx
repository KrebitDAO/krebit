import { FunctionComponent, createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import LitJsSdk from '@lit-protocol/sdk-browser';
import { Web3Storage } from 'web3.storage';
import Krebit from '@krebitdao/reputation-passport';
import { Orbis } from '@orbisclub/orbis-sdk';
import { Web3Auth } from '@web3auth/modal';
import { WALLET_ADAPTERS, CHAIN_NAMESPACES } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import {
  config as PassportConfig,
  isProduction as PassportConfigIsProduction
} from '@krebitdao/reputation-passport/dist/config';
import { schemas as PassportSchema } from '@krebitdao/reputation-passport/dist/schemas';

import { constants, getWalletInformation, normalizeSchema } from 'utils';

// types
import { IProfile } from 'utils/normalizeSchema';
import { Passport } from '@krebitdao/reputation-passport/dist/core/Passport';
import { Krebit as Issuer } from '@krebitdao/reputation-passport/dist/core/Krebit';

interface IProps {
  children: JSX.Element;
}

export interface IWalletInformation {
  ethProvider: ethers.providers.ExternalProvider;
  address: string;
  wallet: ethers.providers.JsonRpcSigner;
}

const { NEXT_PUBLIC_WEB3_STORAGE } = process.env;

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
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [walletInformation, setWalletInformation] = useState<
    IWalletInformation | undefined
  >();
  const { push, query, pathname } = useRouter();
  const storage = new Web3Storage({ token: NEXT_PUBLIC_WEB3_STORAGE });

  useEffect(() => {
    const isAuthenticated = async () => {
      setStatus('pending');

      const publicPassport = new Krebit.core.Passport({
        network: process.env.NEXT_PUBLIC_NETWORK as 'mumbai' | 'polygon',
        ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
      });
      setPublicPassport(publicPassport);

      const orbis = new Orbis();
      setOrbis(orbis);

      const { web3auth, provider } = await initWeb3Auth();
      setWeb3auth(web3auth);

      const currentType = localStorage.getItem('auth-type');

      if (!currentType) {
        setStatus('resolved');
        return;
      }

      let information: IWalletInformation;

      if (currentType === 'metamask' || currentType === 'wallet_connect') {
        information = await getWalletInformation(currentType);
      }

      if (currentType === 'web3auth') {
        information = await getWalletInformation(currentType, provider);
      }

      if (!information) {
        throw new Error(constants.DEFAULT_ERROR_MESSAGES.NOT_WALLET_DEFINED);
      }

      setWalletInformation(information);

      const passport = new Krebit.core.Passport({
        ...information,
        litSdk: LitJsSdk,
        ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
      });
      const isPassportConnected = await passport.isConnected();

      const issuer = new Krebit.core.Krebit({
        ...information,
        litSdk: LitJsSdk,
        ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
      });
      const isIssuerConnected = await issuer.isConnected();

      const isOrbisConnected = await orbis.isConnected();

      if (isPassportConnected && isIssuerConnected && isOrbisConnected) {
        const currentProfile = await normalizeSchema.profile({
          passport,
          orbis
        });

        setPassport(passport);
        setIssuer(issuer);
        setProfile(currentProfile);
      }

      setStatus('resolved');
    };

    isAuthenticated();
  }, []);

  useEffect(() => {
    if (!window) return;

    const rememberSession = window.localStorage.getItem(
      'krebit-remember-session'
    );

    if (rememberSession !== 'ACTIVE') return;

    const handleTabClose = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      window.localStorage.clear();
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  const initWeb3Auth = async () => {
    if (web3auth)
      return {
        web3auth,
        provider: web3auth.provider
      };

    try {
      const web3auth = new Web3Auth({
        clientId: process.env.NEXT_PUBLIC_WEB3_AUTH,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: ethers.utils.hexValue(
            PassportSchema.krbToken[PassportConfig.state.network].domain.chainId
          ),
          rpcTarget: PassportConfig.state.rpcUrl
        },
        uiConfig: {
          theme: 'dark',
          loginMethodsOrder: ['facebook', 'google', 'discord', 'twitter'],
          appLogo: 'https://krebit.id/imgs/logos/Krebit.svg'
        }
      });
      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          clientId: process.env.NEXT_PUBLIC_WEB3_AUTH,
          network: PassportConfigIsProduction ? 'mainnet' : 'testnet',
          uxMode: 'popup',
          whiteLabel: {
            name: 'Krebit.id',
            logoLight: 'https://krebit.id/imgs/logos/Krebit.svg',
            logoDark: 'https://krebit.id/imgs/logos/Krebit.svg',
            defaultLanguage: 'en',
            dark: true
          }
        }
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.initModal({
        [WALLET_ADAPTERS.OPENLOGIN]: {
          showOnModal: true
        }
      });

      return {
        web3auth,
        provider: web3auth.provider
      };
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenConnectWallet = () => {
    if (passport?.did) {
      push(`/${passport.did}`);
      setOpenConnectWallet(false);
      return;
    }

    setOpenConnectWallet(prevState => !prevState);
  };

  const handleSetProfile = (profile: IProfile) => {
    setProfile(profile);
  };

  const handleRememberSession = () => {
    if (!window) return;

    window.localStorage.setItem('krebit-remember-session', 'ACTIVE');
  };

  const connect = async (type: string) => {
    setStatus('pending');

    try {
      let information: IWalletInformation;

      if (type === 'metamask' || type === 'wallet_connect') {
        information = await getWalletInformation(type);
      }

      if (type === 'web3auth') {
        const web3authProvider = await web3auth.connect();
        information = await getWalletInformation(type, web3authProvider);
      }

      if (!information) {
        throw new Error(constants.DEFAULT_ERROR_MESSAGES.NOT_WALLET_DEFINED);
      }

      setWalletInformation(information);
      localStorage.setItem('auth-type', type);

      const orbis = new Orbis();
      setOrbis(orbis);

      let defaultChainId = '1';
      /** Check if the user trying to connect already has an existing did on Orbis */
      let defaultDID = await Krebit.lib.orbis.getDefaultDID(
        information.address
      );

      if (defaultDID) {
        let _didArr = defaultDID.split(':');
        defaultChainId = _didArr[3];
      }

      const passport = new Krebit.core.Passport({
        ...information,
        litSdk: LitJsSdk,
        ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
      });
      const passportConnection = await passport.connect(null, defaultChainId);

      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      const issuer = new Krebit.core.Krebit({
        ...information,
        litSdk: LitJsSdk,
        ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
      });
      const issuerConnection = await issuer.connect(currentSession);

      if (passportConnection && issuerConnection) {
        setPassport(passport);
        setIssuer(issuer);

        const orbisConnection = await orbis.connect_v2({
          provider: information.ethProvider,
          lit: true
        });

        if (orbisConnection) {
          const currentProfile = await normalizeSchema.profile({
            passport,
            orbis
          });

          setProfile(currentProfile);
          setStatus('resolved');

          if (query?.credential_id) {
            push(`/${passport.did}/?credential_id=${query.credential_id}`);
          } else if (pathname === '/') {
            push(`/${passport.did}`);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

  const logout = async () => {
    if (!window) return;

    const currentAuthType = window.localStorage.getItem('auth-type');

    if (currentAuthType === 'web3auth') {
      await web3auth.logout();
    }

    await orbis.logout();
    window.localStorage.removeItem('auth-type');
    window.localStorage.removeItem('did-session');
    window.localStorage.removeItem('krebit-remember-session');
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
          logout,
          handleRememberSession
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
        },
        storage
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
