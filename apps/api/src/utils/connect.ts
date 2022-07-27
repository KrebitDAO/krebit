import { ethers } from 'ethers';
import { schemas, utils, lib } from '@krebitdao/reputation-passport';

const { SERVER_ETHEREUM_SEED, SERVER_NETWORK } = process.env;

export const connect = async () => {
  try {
    const ethProvider =
      (await lib.ethereum.getProvider()) as utils.WalletProvider;

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

      const krbContract = new ethers.Contract(
        schemas.krbToken[SERVER_NETWORK].address,
        schemas.krbToken.abi,
        ethProvider
      );

      if (!krbContract) {
        throw new Error('Contract not found');
      }

      // Get current KRB balance
      // We need at least krbContract.minBalanceToIssue()
      const krbBalance = await krbContract.balanceOf(wallet.address);
      console.log('krbBalance: ', ethers.utils.formatUnits(krbBalance, 18));

      const minBalanceToIssue = await krbContract.minBalanceToIssue();
      console.log(
        'minBalanceToIssue: ',
        ethers.utils.formatUnits(minBalanceToIssue, 18)
      );

      if (krbBalance < minBalanceToIssue) {
        throw new Error('Not enough KRB balance to Issue');
      }

      return { wallet, ethProvider };
    }

    return undefined;
  } catch (error) {
    throw new Error(error);
  }
};
