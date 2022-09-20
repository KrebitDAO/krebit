import { regexValidations } from '@krebitdao/reputation-passport/dist/utils';

export const isValid = (type: string, value: string) => {
  if (type === 'address') {
    return value.match(regexValidations.address);
  }

  if (type === 'did') {
    return value.match(regexValidations.did);
  }

  if (type === 'ens') {
    return value.match(regexValidations.ens);
  }

  if (type === 'all') {
    return (
      value.match(regexValidations.address) ||
      value.match(regexValidations.did) ||
      value.match(regexValidations.ens)
    );
  }

  return false;
};
