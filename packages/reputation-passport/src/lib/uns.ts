import { Resolution } from '@unstoppabledomains/resolution';

const resolveName = async (name: string) => {
  const resolution = new Resolution();

  //Get resolvedAddress from UNS
  const address = await resolution.addr(name, 'ETH');

  return address;
};

// domainNameQuery from UNS
const lookupAddress = async (address: string) => {
  const resolution = new Resolution();

  //Get resolvedAddress from UNS
  const domain = await resolution.reverse(address);
  //console.debug('UNS:', domain);
  return domain;
};

export const uns = {
  resolveName,
  lookupAddress
};
