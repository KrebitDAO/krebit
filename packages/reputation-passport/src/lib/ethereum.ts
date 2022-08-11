import { ethers } from 'ethers';

import { config } from '../config';
import { WalletProvider } from '../utils';
import { krbToken } from '../schemas';

const { NETWORK_PROVIDER, NETWORK } = config;

const getProvider = async () => {
  if (!global.window) {
    return new WalletProvider(NETWORK_PROVIDER, NETWORK);
  }

  if ((window as any).ethereum) {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${Number(krbToken[NETWORK].domain.chainId).toString(
              16
            )}`
          }
        ]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${Number(krbToken[NETWORK].domain.chainId).toString(
                  16
                )}`,
                rpcUrls: [NETWORK_PROVIDER],
                chainName: krbToken[NETWORK].name,
                nativeCurrency: {
                  name: krbToken[NETWORK].token,
                  symbol: krbToken[NETWORK].token,
                  decimals: 18
                },
                blockExplorerUrls: [krbToken[NETWORK].blockUrl]
              }
            ]
          });
        } catch (addError) {
          console.error('Error adding network: ', addError);
        }
      }

      console.error('Error switching network: ', switchError);
    } finally {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        NETWORK
      );

      (window as any).ethereum.on('chainChanged', (newNetwork: string) => {
        if (
          newNetwork !=
          `0x${Number(krbToken[NETWORK].domain.chainId).toString(16)}`
        ) {
          window.location.reload();
        }
      });

      return provider;
    }
  }
};

export const ethereum = { getProvider };
