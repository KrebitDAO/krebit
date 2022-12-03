import { getIssuers, sortByDate } from 'utils';

// types
import { Passport } from '@krebitdao/reputation-passport/dist/core/Passport';

interface IGetCredentialsProps {
  type: string;
  passport: Passport;
  limit?: number;
}

interface IGetCredentialProps {
  vcId: string;
  type: string;
  passport: Passport;
}

interface IBuildCredentialProps {
  type: string;
  credential: any;
  passport: Passport;
  isCustomCredential?: boolean;
}

const getCredentials = async (props: IGetCredentialsProps) => {
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

const getCredential = async (props: IGetCredentialProps) => {
  const { vcId, type, passport } = props;

  const currentCredential = await passport.getCredential(vcId);

  const stamps = await passport.getStamps({
    type: type,
    claimId: currentCredential.id
  });

  //const isMinted = await passport.isMinted(credential);
  const isMinted = false;

  const visualInformation = getIssuers(type).find(issuer =>
    currentCredential.type.includes(issuer.credentialType)
  );
  const claimValue = await passport.getClaimValue(currentCredential);

  const customCredential = {
    ...currentCredential,
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
    skills: currentCredential.type
  };
};

const buildCredential = async (props: IBuildCredentialProps) => {
  const { type, credential, passport, isCustomCredential = false } = props;

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
    skills: credential.type,
    isCustomCredential
  };
};

export { getCredentials, getCredential, buildCredential };
