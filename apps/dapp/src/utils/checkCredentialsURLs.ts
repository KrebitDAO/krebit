import krbToken from '@krebitdao/reputation-passport/dist/schemas/krbToken.json';
import krebitNFT from '@krebitdao/reputation-passport/dist/schemas/krebitNFT.json';
import ethers from 'ethers';

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
      ethers.utils.defaultAbiCoder.encode(['string'], [values])
    );
    const tokenId = ethers.BigNumber.from(tokenIdHex);
    value = tokenId.toString();
  }

  if (type === 'ceramic') {
    currentUrl = `https://cerscan.com/testnet-clay/stream/${value}`;
  }

  if (type === 'polygon') {
    let url = krbToken[process.env.NEXT_PUBLIC_NETWORK]?.txUrl;

    currentUrl = `${url}${value}`;
  }

  if (type === 'rarible') {
    let contract = krebitNFT[process.env.NEXT_PUBLIC_NETWORK]?.address;
    currentUrl = `https://testnet.rarible.com/token/polygon/${contract}:${value}`;
  }

  window.open(currentUrl, '_blank');
};
