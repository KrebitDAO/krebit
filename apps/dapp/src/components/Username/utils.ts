import { constants, getIssuers, sortByDate } from 'utils';
import { CREDENTIALS_INITIAL_STATE } from 'components/Credentials/initialState';

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

      let visualInformation;

      const visualInformationIssuers = getIssuers(type).find(issuer =>
        credential.type.includes(issuer.credentialType)
      );
      const visualInformationBuilderCredential = CREDENTIALS_INITIAL_STATE.find(
        state =>
          credential?.credentialSubject?.type?.toLowerCase() ===
          state.type.toLowerCase()
      );

      if (visualInformationIssuers) {
        visualInformation = visualInformationIssuers;
      } else if (visualInformationBuilderCredential) {
        visualInformation = {
          credentialType: 'Issuer',
          ...visualInformationBuilderCredential
        };
      } else {
        visualInformation = {
          credentialType: 'Issuer',
          primaryColor: 'gray',
          secondaryColor: 'haiti'
        };
      }

      const claimValue = await passport.getClaimValue(credential);

      const customCredential = {
        ...credential,
        visualInformation: {
          ...visualInformation,
          isEncryptedByDefault: !!claimValue?.encryptedString
        },
        value:
          visualInformation?.credentialType === 'Issuer'
            ? claimValue?.values
              ? claimValue
              : { values: claimValue }
            : claimValue
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
  const { type, credential, passport } = props;

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
};

export { getCredentials, getCredential, buildCredential };
