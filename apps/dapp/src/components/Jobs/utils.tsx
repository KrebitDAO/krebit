import { getAddressFromDid } from '@orbisclub/orbis-sdk/utils';
import { lib as passportLib } from '@krebitdao/reputation-passport/dist/lib';

const substring = (value: string, length = 30, isAddress = false) => {
  if (isAddress) {
    return getAddressFromDid(value)?.address?.substring(0, length);
  }

  return value?.substring(0, length);
};

const getDomains = async (did: string) => {
  let ensDomain = null;
  let unsDomain = null;

  if (!did.match('did:pkh:solana')) {
    let address = getAddressFromDid(did)?.address;

    if (address) {
      ensDomain = await passportLib.ens.lookupAddress(address);
      unsDomain = await passportLib.uns.lookupAddress(address);
    }
  }

  return {
    ensDomain,
    unsDomain
  };
};

export { substring, getDomains };
