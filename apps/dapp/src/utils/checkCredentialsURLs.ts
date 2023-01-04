import { ethers } from 'ethers';
import { schemas } from '@krebitdao/reputation-passport/dist/schemas';

export const checkCredentialsURLs = (
  type: string,
  valuesType: string,
  values: any
) => {
  if (!window) return;

  let currentUrl: string;
  let value: string;

  if (valuesType === 'credential') {
    value = values?.vcId.replace('ceramic://', '');
  }

  if (valuesType === 'tx') {
    value = values?.transaction;
  }

  if (valuesType === 'nft') {
    const tokenIdHex = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['string'],
        [values?.credentialSubject?.type]
      )
    );
    const tokenId = ethers.BigNumber.from(tokenIdHex);
    value = tokenId.toString();
  }

  if (type === 'ceramic') {
    currentUrl =
      process.env.NEXT_PUBLIC_NETWORK === 'polygon'
        ? `https://cerscan.com/mainnet/stream/${value}`
        : `https://cerscan.com/testnet-clay/stream/${value}`;
  }

  if (type === 'polygon') {
    let url = schemas.krbToken[process.env.NEXT_PUBLIC_NETWORK]?.txUrl;

    currentUrl = `${url}${value}`;
  }

  if (type === 'rarible') {
    let contract =
      schemas.krebitNFT[
        process.env.NEXT_PUBLIC_NETWORK
      ]?.address?.toLowerCase();
    currentUrl =
      process.env.NEXT_PUBLIC_NETWORK === 'polygon'
        ? `https://rarible.com/token/polygon/${contract}:${value}`
        : `https://testnet.rarible.com/token/polygon/${contract}:${value}`;
  }

  if (type === 'opensea') {
    let contract =
      schemas.krebitNFT[
        process.env.NEXT_PUBLIC_NETWORK
      ]?.address?.toLowerCase();
    currentUrl =
      process.env.NEXT_PUBLIC_NETWORK === 'polygon'
        ? `https://opensea.io/assets/matic/${contract}/${value}`
        : `https://testnets.opensea.io/assets/mumbai/${contract}/${value}`;
  }

  window.open(currentUrl, '_blank');
};
