import { Passport } from '@krebitdao/reputation-passport/dist/core';
import { regexValidations } from '@krebitdao/reputation-passport/dist/utils';
import krbTokenSchema from '@krebitdao/reputation-passport/dist/schemas/krbToken.json';

export const getDID = async (value: string, passport: Passport) => {
  if (value.match(regexValidations.did)) {
    return value;
  }

  if (value.match(regexValidations.address)) {
    return `did:pkh:eip155:${
      krbTokenSchema[process.env.NEXT_PUBLIC_NETWORK]?.domain?.chainId
    }:${value}`;
  }

  if (value.match(regexValidations.ens)) {
    const address = await passport.resolveName(value);

    return `did:pkh:eip155:${
      krbTokenSchema[process.env.NEXT_PUBLIC_NETWORK]?.domain?.chainId
    }:${address}`;
  }

  return undefined;
};
