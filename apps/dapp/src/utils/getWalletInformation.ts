import { ethers } from 'ethers';
import { SafeEventEmitterProvider } from '@web3auth/base';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Krebit from '@krebitdao/reputation-passport';

export const getWalletInformation = async (
  type: string,
  web3AuthProvider?: SafeEventEmitterProvider
) => {
  if (type === 'metamask') {
    if (!(window as any).ethereum) return;

    const addresses = await (window as any).ethereum.request({
      method: 'eth_requestAccounts'
    });
    const address = addresses[0];
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    await Krebit.lib.ethereum.switchNetwork((window as any).ethereum);
    const wallet = provider.getSigner();

    return {
      type,
      ethProvider: provider.provider,
      address,
      wallet
    };
  }

  if (type === 'wallet_connect') {
    const walletConnect = new WalletConnectProvider({
      rpc: {
        137: process.env.NEXT_PUBLIC_NETWORK_RPC_URL,
        80001: process.env.NEXT_PUBLIC_NETWORK_RPC_URL
      }
    });
    await walletConnect.enable();

    const provider = new ethers.providers.Web3Provider(walletConnect);
    await Krebit.lib.ethereum.switchNetwork(walletConnect);
    const wallet = provider.getSigner();
    const address = await wallet.getAddress();

    return {
      type,
      ethProvider: provider.provider,
      address,
      wallet
    };
  }

  if (type === 'web3auth') {
    const provider = new ethers.providers.Web3Provider(web3AuthProvider);
    const wallet = provider.getSigner();
    const address = await wallet.getAddress();
    (provider.provider as any).enable = () => [address];

    return {
      type,
      ethProvider: provider.provider,
      address,
      wallet
    };
  }
};
