import { ethers } from 'ethers';

import { WalletProvider } from '../utils';
import { krbToken } from '../schemas';
import { config } from '../config';

const currentConfig = config.get();

const getWeb3Provider = async () => {
  if ((window as any).ethereum) {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${Number(
              krbToken[currentConfig.network].domain.chainId
            ).toString(16)}`
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
                chainId: `0x${Number(
                  krbToken[currentConfig.network].domain.chainId
                ).toString(16)}`,
                rpcUrls: [currentConfig.rpcUrl],
                chainName: krbToken[currentConfig.network].name,
                nativeCurrency: {
                  name: krbToken[currentConfig.network].token,
                  symbol: krbToken[currentConfig.network].token,
                  decimals: 18
                },
                blockExplorerUrls: [krbToken[currentConfig.network].blockUrl]
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
        (window as any).ethereum
      );

      (window as any).ethereum.on('chainChanged', (newNetwork: string) => {
        if (
          newNetwork !=
          `0x${Number(krbToken[currentConfig.network].domain.chainId).toString(
            16
          )}`
        ) {
          window.location.reload();
        }
      });

      return provider;
    }
  }
};

const getProvider = () => {
  return new WalletProvider(currentConfig.rpcUrl, currentConfig.network);
};

export const ethereum = {
  getProvider,
  getWeb3Provider
};
