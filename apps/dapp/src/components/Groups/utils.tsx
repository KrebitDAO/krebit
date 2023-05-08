import { getAddressFromDid } from '@orbisclub/orbis-sdk/utils';
import { lib as passportLib } from '@krebitdao/reputation-passport/dist/lib';

const substring = (value: string, length = 20, isAddress = false) => {
  if (isAddress) {
    const address = getAddressFromDid(value)?.address;

    if (!address) {
      return value?.substring(0, length) + '...';
    }

    return (
      address?.substring(0, length) +
      '...' +
      address?.substring(address?.length - 4)
    );
  }

  return value?.substring(0, length);
};

const getDomains = async (did: string) => {
  let ensDomain = null;
  let unsDomain = null;
  let reputation = null;

  if (!did.match('did:pkh:solana')) {
    let address = getAddressFromDid(did)?.address;

    if (address) {
      ensDomain = await passportLib.ens.lookupAddress(address);
      unsDomain = await passportLib.uns.lookupAddress(address);
      reputation = await passportLib.graph.erc20BalanceQuery(address);
    }
  }

  return {
    ensDomain,
    unsDomain,
    reputation: reputation?.value || 0
  };
};

export { substring, getDomains };
