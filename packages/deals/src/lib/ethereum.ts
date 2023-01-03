import { utils } from '../utils/index.js';
import { schemas } from '../schemas/index.js';
import { config } from '../config/index.js';

const currentConfig = config.get();

const switchNetwork = async (provider: any) => {
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${Number(
              schemas.krebitEscrow[currentConfig.network].domain.chainId
            ).toString(16)}`
          }
        ]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${Number(
                  schemas.krebitEscrow[currentConfig.network].domain.chainId
                ).toString(16)}`,
                rpcUrls: [currentConfig.rpcUrl],
                chainName: schemas.krebitEscrow[currentConfig.network].name,
                nativeCurrency: {
                  name: schemas.krebitEscrow[currentConfig.network].token,
                  symbol: schemas.krebitEscrow[currentConfig.network].token,
                  decimals: 18
                },
                blockExplorerUrls: [
                  schemas.krebitEscrow[currentConfig.network].blockUrl
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
      provider.on('chainChanged', (newNetwork: string) => {
        if (
          newNetwork !=
          `0x${Number(
            schemas.krebitEscrow[currentConfig.network].domain.chainId
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
    schemas.krebitEscrow[currentConfig.network].network
  );
};

export const ethereum = {
  getProvider,
  switchNetwork
};
