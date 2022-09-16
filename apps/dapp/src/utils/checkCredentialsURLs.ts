import krbToken from '@krebitdao/reputation-passport/dist/schemas/krbToken.json';

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

  if (valuesType === 'stamp') {
    value = values?.transaction;
  }

  if (type === 'ceramic') {
    currentUrl = `https://cerscan.com/testnet-clay/stream/${value}`;
  }

  if (type === 'polygon') {
    let url = krbToken[process.env.NEXT_PUBLIC_NETWORK]?.txUrl;

    currentUrl = `${url}${value}`;
  }

  window.open(currentUrl, '_blank');
};
