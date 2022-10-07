import { ethers } from 'ethers';

import { utils } from '../utils/index.js';
import { schemas } from '../schemas/index.js';
import { config } from '../config/index.js';

const currentConfig = config.get();

const getWeb3Provider = async () => {
  if ((window as any).ethereum) {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${Number(
              schemas.krbToken[currentConfig.network].domain.chainId
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
                  schemas.krbToken[currentConfig.network].domain.chainId
                ).toString(16)}`,
                rpcUrls: [currentConfig.rpcUrl],
                chainName: schemas.krbToken[currentConfig.network].name,
                nativeCurrency: {
                  name: schemas.krbToken[currentConfig.network].token,
                  symbol: schemas.krbToken[currentConfig.network].token,
                  decimals: 18
                },
                blockExplorerUrls: [
                  schemas.krbToken[currentConfig.network].blockUrl
                ]
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
          `0x${Number(
            schemas.krbToken[currentConfig.network].domain.chainId
          ).toString(16)}`
        ) {
          window.location.reload();
        }
      });

      return provider;
    }
  }
};

const getProvider = () => {
  return new utils.WalletProvider(
    currentConfig.rpcUrl,
    schemas.krbToken[currentConfig.network].network
  );
};

export const ethereum = {
  getProvider,
  getWeb3Provider
};
