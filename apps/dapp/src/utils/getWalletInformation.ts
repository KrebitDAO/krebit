import { ethers } from 'ethers';
import { SafeEventEmitterProvider } from '@web3auth/base';
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
      ethProvider: provider.provider,
      address,
      wallet
    };
  }

  if (type === 'web3auth') {
    const provider = new ethers.providers.Web3Provider(web3AuthProvider);
    const wallet = provider.getSigner();
    const address = await wallet.getAddress();

    return {
      ethProvider: provider.provider,
      address,
      wallet
    };
  }
};
