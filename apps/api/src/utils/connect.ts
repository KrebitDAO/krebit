import { ethers } from 'ethers';
import Krebit from '@krebitdao/reputation-passport';
import { PKPWallet } from '@lit-protocol/pkp-ethers.js';

import { signAuthMessage } from '../utils';

const { SERVER_ETHEREUM_SEED, SERVER_NETWORK, SERVER_PUBLIC_PKP } = process.env;

export const connect = async () => {
  try {
    const ethProvider = Krebit.lib.ethereum.getProvider();
    const pkpEthProvider = Krebit.lib.ethereum.getProvider();

    // Create wallet from ethereum seed
    let wallet: ethers.Wallet;
    let pkpWallet: PKPWallet;

    // Create sign from Lit
    let litAuthSign;

    try {
      // Unlock/Decrypt local wallet
      const unlockedWallet = ethers.Wallet.fromMnemonic(SERVER_ETHEREUM_SEED);

      // Connect wallet with provider for signing the transaction
      wallet = unlockedWallet.connect(ethProvider);

      const authSign = await signAuthMessage({
        wallet
      });

      litAuthSign = authSign;

      const pkp = new PKPWallet({
        pkpPubKey: SERVER_PUBLIC_PKP,
        controllerAuthSig: authSign,
        provider: 'https://rpc-mumbai.maticvigil.com'
      });
      await pkp.init();

      pkpWallet = pkp;
    } catch (error) {
      console.error('Failed to use local Wallet: ', error);
    }

    if (wallet && wallet.address && pkpWallet && pkpWallet.address) {
      console.log('address: ', wallet.address);
      console.log('pkp address: ', pkpWallet.address);
      ethProvider.setWallet(wallet);
      pkpEthProvider.setWallet(pkpWallet as any);

      const krbContract = new ethers.Contract(
        Krebit.schemas.krbToken[SERVER_NETWORK].address,
        Krebit.schemas.krbToken.abi,
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
        throw new Error('Not enough $KRB balance to Issue');
      }

      return { wallet, ethProvider, pkpWallet, pkpEthProvider, litAuthSign };
    }

    return undefined;
  } catch (error) {
    throw new Error(error);
  }
};
