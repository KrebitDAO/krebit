// types
import { Passport } from '@krebitdao/reputation-passport/dist/core/Passport';

interface IProps {
  passport: Passport;
}

export const getReferralCredentials = async (props: IProps) => {
  const { passport } = props;

  const credentials = await passport.getCredentials(undefined, 'Referral');
  const values = credentials
    .map(credential => ({
      ...credential,
      credentialSubject: {
        ...credential.credentialSubject,
        value: JSON.parse(credential?.credentialSubject?.value)
      }
    }))
    .map(credential => ({
      text: credential.credentialSubject.value.name,
      value: credential.vcId
    }));

  return values || [];
};
