import { Passport } from '@krebitdao/reputation-passport/dist/core';

import { getIssuers, sortByDate } from 'utils';

interface IProps {
  type: string;
  passport: Passport;
  limit?: number;
}

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

      //const isMinted = await passport.isMinted(credential);
      const isMinted = false;

      const visualInformation = getIssuers(type).find(issuer =>
        credential.type.includes(issuer.credentialType)
      );
      const claimValue = await passport.getClaimValue(credential);
      if (claimValue?.proofs) delete claimValue.proofs;
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
        isMinted,
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
