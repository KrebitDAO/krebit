import { FunctionComponent, createContext, useState } from 'react';
import { ethers } from 'ethers';
import LitJsSdk from 'lit-js-sdk';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ReputationPassport from '@krebitdao/reputation-passport';

interface Props {
  children: JSX.Element;
}

export const GeneralContext = createContext(undefined);

export const GeneralProvider: FunctionComponent<Props> = props => {
  const { children } = props;
  const [openConnectWallet, setOpenConnectWallet] = useState(false);

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
      const ethProvider = await ReputationPassport.lib.ethereum.getWeb3Provider();
      const wallet = ethProvider.getSigner();

      return {
        ethProvider,
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
        ethProvider: provider,
        address,
        wallet
      };
    }
  };

  const connect = async (type: string) => {
    const information = await getWalletInformation(type);

    const Issuer = new ReputationPassport.core.Krebit({});
    const connection = await Issuer.connect(
      information.wallet,
      information.ethProvider,
      information.address
    );

    return connection;
  };

  return (
    <GeneralContext.Provider
      value={{
        walletModal: {
          handleOpenConnectWallet,
          openConnectWallet
        },
        auth: {
          connect
        }
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
