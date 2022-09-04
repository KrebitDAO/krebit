import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Krebit from '@krebitdao/reputation-passport';

export const getWalletInformation = async (type: string) => {
  if (type === 'metamask') {
    if (!(window as any).ethereum) return;

    const addresses = await (window as any).ethereum.request({
      method: 'eth_requestAccounts'
    });
    const address = addresses[0];
    const provider = await Krebit.lib.ethereum.getWeb3Provider();
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
