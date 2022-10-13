import Krebit from '@krebitdao/reputation-passport';

export const isValid = (type: string, value: string) => {
  if (type === 'address') {
    return value.match(Krebit.utils.regexValidations.address);
  }

  if (type === 'did') {
    return value.startsWith('did:pkh:eip155:');
  }

  if (type === 'ens') {
    return value.match(Krebit.utils.regexValidations.ens);
  }

  return false;
};
