import { ethers } from 'ethers';
import Krebit from '@krebitdao/reputation-passport';

const { SERVER_ETHEREUM_SEED } = process.env;

export const connectWeb3 = async () => {
  if (!window) return;
  const ethereum = (window as any).ethereum;

  if (!ethereum) return;

  const addresses = await ethereum.request({
    method: 'eth_requestAccounts'
  });
  const address = addresses[0];
  const ethProvider = await Krebit.lib.ethereum.getWeb3Provider();
  const wallet = ethProvider.getSigner();
  return { address, wallet, ethProvider };
};

export const connect = async () => {
  try {
    const ethProvider = Krebit.lib.ethereum.getProvider();

    // Create wallet from ethereum seed
    let wallet: ethers.Wallet;

    try {
      // Unlock/Decrypt local wallet
      const unlockedWallet = ethers.Wallet.fromMnemonic(SERVER_ETHEREUM_SEED);

      // Connect wallet with provider for signing the transaction
      wallet = unlockedWallet.connect(ethProvider);
    } catch (error) {
      console.error('Failed to use local Wallet: ', error);
    }

    if (wallet && wallet.address) {
      console.log('address: ', wallet.address);
      ethProvider.setWallet(wallet);
      return { address: wallet.address, wallet, ethProvider };
    }

    return undefined;
  } catch (error) {
    throw new Error(error);
  }
};
