import { getIssuers, sortByDate } from 'utils';

// types
import { Passport } from '@krebitdao/reputation-passport/dist/core/Passport';

interface IProps {
  type: string;
  passport: Passport;
  limit?: number;
}

const getCredentials = async (props: IProps) => {
  const { type, passport, limit = 2 } = props;

  // TODO: Slice is a hacky way to limit the credentials, this should be replaced with pagination
  const currentCredentials = (await passport.getCredentials(undefined, type))
    .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate, 'des'))
    .slice(0, limit);

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

      const customCredential = {
        ...credential,
        visualInformation: {
          ...visualInformation,
          isEncryptedByDefault: !!claimValue?.encryptedString
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
  );
};

export { getCredentials };
