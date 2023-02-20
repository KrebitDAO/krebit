import { isValidJSON } from 'utils';

// types
import { Passport } from '@krebitdao/reputation-passport/dist/core/Passport';

interface IProps {
  passport: Passport;
}

export const getReferralCredentials = async (props: IProps) => {
  const { passport } = props;

  const currentCredentials = await passport.getCredentials(
    undefined,
    'Referral'
  );
  const credentials = await Promise.all(
    currentCredentials.map(async credential => {
      const stamps = await passport.getStamps({
        type: 'Referral',
        claimId: credential.id
      });

      if (stamps && stamps?.length > 0) {
        return credential;
      }

      return undefined;
    })
  );

  const values = credentials
    .filter(credential => credential !== undefined)
    .map(credential => ({
      ...credential,
      credentialSubject: {
        ...credential.credentialSubject,
        value: isValidJSON(credential?.credentialSubject?.value)
          ? JSON.parse(credential?.credentialSubject?.value)
          : credential?.credentialSubject?.value
      }
    }))
    .map(credential => ({
      text: credential.credentialSubject.value.name,
      value: credential.vcId
    }));

  return values || [];
};
