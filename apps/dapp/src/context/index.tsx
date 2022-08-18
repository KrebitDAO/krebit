import { FunctionComponent, createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LitJsSdk from 'lit-js-sdk';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ReputationPassport from '@krebitdao/reputation-passport';
import { Passport } from '@krebitdao/reputation-passport/dist/core';

interface Props {
  children: JSX.Element;
}

export const GeneralContext = createContext(undefined);

export const GeneralProvider: FunctionComponent<Props> = props => {
  const { children } = props;
  const [openConnectWallet, setOpenConnectWallet] = useState(false);
  const [status, setStatus] = useState('idle');
  const [passport, setPassport] = useState<Passport>();

  useEffect(() => {
    const isAuthenticated = async () => {
      setStatus('pending');

      const currentType = localStorage.getItem(
        'krebit.reputation-passport.type'
      );

      if (!currentType) {
        setStatus('rejected');
        return;
      }

      const information = await getWalletInformation(currentType);

      const passport = new ReputationPassport.core.Passport({
        network: 'mumbai',
        wallet: information.wallet,
        ethProvider: information.ethProvider,
        address: information.address,
        litSdk: LitJsSdk
      });
      const isConnected = await passport.isConnected();

      if (!isConnected) {
        setStatus('rejected');
        return;
      }

      setPassport(passport);
      setStatus('resolved');
    };

    isAuthenticated();
  }, []);

  const handleOpenConnectWallet = () => {
    setOpenConnectWallet(prevState => !prevState);
  };

  const getWalletInformation = async (type: string) => {
    if (type === 'metamask') {
      if (!(window as any).ethereum) return;

      const addresses = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });
      const address = addresses[0];
      const provider = await ReputationPassport.lib.ethereum.getWeb3Provider();
      const wallet = provider.getSigner();

      return {
        ethProvider: provider.provider,
        address,
        wallet
      };
    }

    if (type === 'wallet_connect') {
      const walletConnect = new WalletConnectProvider({
        infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY
      });
      await walletConnect.enable();

      const provider = new ethers.providers.Web3Provider(walletConnect);
      const wallet = provider.getSigner();
      const address = await wallet.getAddress();

      return {
        ethProvider: provider.provider,
        address,
        wallet
      };
    }
  };

  const connect = async (type: string) => {
    setStatus('pending');

    try {
      const information = await getWalletInformation(type);
      localStorage.setItem('krebit.reputation-passport.type', type);

      const passport = new ReputationPassport.core.Passport({
        network: 'mumbai',
        wallet: information.wallet,
        ethProvider: information.ethProvider,
        address: information.address,
        litSdk: LitJsSdk
      });
      const connection = await passport.connect();

      if (connection) {
        setPassport(passport);
        setStatus('resolved');
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
        reputationPassport: {
          passport
        }
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
