import krbTokenSchema from '@krebitdao/reputation-passport/dist/schemas/krbToken.json';

const addressRegex = '0x[a-fA-F0-9]{40}';
const didRegex = `did:pkh:eip155:${
  krbTokenSchema[process.env.NEXT_PUBLIC_NETWORK].domain.chainId
}:${addressRegex}`;

export const isValid = (type: string, value: string) => {
  if (type === 'address') {
    return value.match(addressRegex);
  }

  if (type === 'did') {
    return value.match(didRegex);
  }

  return false;
};
