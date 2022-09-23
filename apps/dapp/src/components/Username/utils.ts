import { Passport } from '@krebitdao/reputation-passport/dist/core';

import { constants, sortByDate } from 'utils';

interface IProps {
  type: string;
  passport: Passport;
  limit?: number;
}

const CONSTANT_CREDENTIALS_TYPE = {
  personhood: constants.PERSONHOOD_CREDENTIALS,
  workExperience: constants.WORK_CREDENTIALS,
  community: constants.COMMUNITY_CREDENTIALS
};

const getCredentials = async (props: IProps) => {
  const { type, passport, limit = 2 } = props;

  // TODO: Slice is a hacky way to limit the credentials, this should be replaced with pagination
  const currentCredentials = (
    await passport.getCredentials(undefined, type)
  ).slice(0, limit);

  return await Promise.all(
    currentCredentials.map(async credential => {
      const stamps = await passport.getStamps({
        type: type,
        claimId: credential.id
      });
      const visualInformation = CONSTANT_CREDENTIALS_TYPE[type].find(constant =>
        credential.type.includes(constant.id)
      );
      const claimValue = await passport.getClaimValue(credential);
      delete claimValue.proofs;
      const customCredential = {
        ...credential,
        visualInformation: {
          ...visualInformation,
          isEncryptedByDefault: !!claimValue?.encrypted
        },
        value: claimValue
      };

      return {
        credential: customCredential,
        stamps,
        skills: credential.type
      };
    })
  ).then(personhoods =>
    personhoods.sort((a, b) =>
      sortByDate(a.credential.issuanceDate, b.credential.issuanceDate, 'des')
    )
  );
};

export { getCredentials };
