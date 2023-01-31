import { ethers } from 'ethers';
import Krebit from '@krebitdao/reputation-passport';
import { PKPWallet } from '@lit-protocol/pkp-ethers.js';

const PKP_PUBKEY =
  '0x0439e24fbe3332dd2abe3073f663a58fc74674095e5834ebbe7a86fd52f1cbe54b8268d6426fbd66a6979d787b6848b750f3a64a6354da4616f93a3031f3d44e95';

const authSig = {
  sig: '0x8c4b3b2a2f8f0b33ad8092719a604e94ffd2d938c115741e7155cdea3653fca75285ed2499ec1c6f60ab4b1e5e9fab2d4e6cf36abf32fe515d67de152736dfcd1b',
  derivedVia: 'web3.eth.personal.sign',
  signedMessage:
    'localhost:3000 wants you to sign in with your Ethereum account:\n0x5B8A8d043f2235a29E4b063c20299050931832Dc\n\n\nURI: http://localhost:3000/\nVersion: 1\nChain ID: 80001\nNonce: McW3494o8EuALAzJn\nIssued At: 2022-12-06T18:09:09.646Z\nExpiration Time: 2022-12-13T18:09:09.644Z',
  address: '0x5B8A8d043f2235a29E4b063c20299050931832Dc'
};

const { SERVER_ETHEREUM_SEED, SERVER_NETWORK } = process.env;

export const connect = async () => {
  try {
    const ethProvider = Krebit.lib.ethereum.getProvider();

    // Create wallet from ethereum seed
    let wallet: PKPWallet;

    try {
      const pkpWallet = new PKPWallet({
        pkpPubKey: PKP_PUBKEY,
        controllerAuthSig: authSig,
        provider: 'https://rpc-mumbai.maticvigil.com'
      });

      await pkpWallet.init();

      // Unlock/Decrypt local wallet
      const unlockedWallet = ethers.Wallet.fromMnemonic(SERVER_ETHEREUM_SEED);

      // Connect wallet with provider for signing the transaction
      wallet = pkpWallet;
    } catch (error) {
      console.error('Failed to use local Wallet: ', error);
    }

    if (wallet && wallet.address) {
      console.log('address: ', wallet.address);
      ethProvider.setWallet(wallet as any);

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

      return { wallet, ethProvider };
    }

    return undefined;
  } catch (error) {
    throw new Error(error);
  }
};
