import { ethers } from 'ethers';

import { krbToken } from './schemas';

const { APP_NETWORK_PROVIDER, APP_NETWORK } = process.env;

const getProvider = async () => {
  if (window && (window as any).ethereum) {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${Number(krbToken[APP_NETWORK].domain.chainId).toString(
              16
            )}`,
          },
        ],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${Number(
                  krbToken[APP_NETWORK].domain.chainId
                ).toString(16)}`,
                rpcUrls: [APP_NETWORK_PROVIDER],
                chainName: krbToken[APP_NETWORK].name,
                nativeCurrency: {
                  name: krbToken[APP_NETWORK].token,
                  symbol: krbToken[APP_NETWORK].token,
                  decimals: 18,
                },
                blockExplorerUrls: [krbToken[APP_NETWORK].blockUrl],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network: ', addError);
        }
      }

      console.error('Error switching network: ', switchError);
    } finally {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        APP_NETWORK
      );

      (window as any).ethereum.on('chainChanged', (newNetwork: string) => {
        if (
          newNetwork !=
          `0x${Number(krbToken[APP_NETWORK].domain.chainId).toString(16)}`
        ) {
          window.location.reload();
        }
      });

      return provider;
    }
  }

  return new ethers.providers.JsonRpcProvider(APP_NETWORK_PROVIDER);
};

export { getProvider };
