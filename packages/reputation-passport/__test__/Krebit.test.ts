import { ethers } from 'ethers';

import Krebit from '../src';

describe('Krebit Class', () => {
  let wallet: ethers.Wallet;
  let ethProvider: ethers.providers.Provider;

  beforeAll(async () => {
    ethProvider = Krebit.lib.ethereum.getProvider();

    const pKey = ethers.Wallet.createRandom();
    wallet = new ethers.Wallet(pKey, ethProvider);
  });

  test('The user should be able to connect with her Wallet, EthProvider, and Address', async () => {
    console.log(wallet, ethProvider);
  });
});
