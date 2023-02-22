import { CREDENTIALS_INITIAL_STATE } from 'components/Credentials/initialState';
import { getIssuers, sortByDate, isValidJSON } from 'utils';

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

const TEXT_LIMIT = 100;

const getCredentials = async (props: IGetCredentialsProps) => {
  const { type, passport, limit = 2 } = props;

  // TODO: Slice is a hacky way to limit the credentials, this should be replaced with pagination
  const currentCredentials = (await passport.getCredentials(undefined, type))
    .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate, 'des'))
    .slice(0, limit);

  return await Promise.all(
    currentCredentials.map(async credential => {
      let parsedCredential = {
        ...credential,
        credentialSubject: {
          ...credential?.credentialSubject,
          value: isValidJSON(credential?.credentialSubject?.value)
            ? JSON.parse(credential?.credentialSubject?.value)
            : credential?.credentialSubject?.value
        }
      };

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
      const visualInformationFromBuilder = credential?.type
        .map(type =>
          CREDENTIALS_INITIAL_STATE.find(state =>
            type.toLowerCase().includes(state.type)
          )
        )
        .filter(value => value !== undefined);

      const title = formatCredential(parsedCredential, 'title');
      const description = formatCredential(parsedCredential, 'description');
      const image = formatCredential(parsedCredential, 'image');
      const icon = formatCredential(parsedCredential, 'icon');
      const rating = formatCredential(parsedCredential, 'rating');

      if (visualInformationIssuers) {
        visualInformation = {
          ...visualInformationIssuers,
          metadata: {
            title,
            description,
            image,
            icon,
            rating
          }
        };
      } else if (visualInformationBuilderCredential) {
        visualInformation = {
          ...visualInformationBuilderCredential,
          credentialType: 'Issuer',
          metadata: {
            title,
            description,
            image,
            icon,
            rating
          }
        };
      } else {
        visualInformation = {
          credentialType: 'Issuer',
          primaryColor: 'gray',
          secondaryColor: 'haiti',
          metadata: {
            title,
            description,
            image,
            icon,
            rating
          }
        };
      }

      if (visualInformationFromBuilder?.length > 0) {
        visualInformation = {
          ...visualInformation,
          builder: visualInformationFromBuilder[0]
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

  let parsedCredential = {
    ...credential,
    credentialSubject: {
      ...credential?.credentialSubject,
      value: isValidJSON(credential?.credentialSubject?.value)
        ? JSON.parse(credential?.credentialSubject?.value)
        : credential?.credentialSubject?.value
    }
  };

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
  const visualInformationFromBuilder = credential?.type
    .map(type =>
      CREDENTIALS_INITIAL_STATE.find(state =>
        type.toLowerCase().includes(state.type)
      )
    )
    .filter(value => value !== undefined);

  const title = formatCredential(parsedCredential, 'title');
  const description = formatCredential(parsedCredential, 'description');
  const image = formatCredential(parsedCredential, 'image');
  const icon = formatCredential(parsedCredential, 'icon');
  const rating = formatCredential(parsedCredential, 'rating');

  if (visualInformationIssuers) {
    visualInformation = {
      ...visualInformationIssuers,
      metadata: {
        title,
        description,
        image,
        icon,
        rating
      }
    };
  } else {
    visualInformation = {
      credentialType: 'Issuer',
      primaryColor: 'gray',
      secondaryColor: 'haiti',
      metadata: {
        title,
        description,
        image,
        icon,
        rating
      }
    };
  }

  if (visualInformationFromBuilder?.length > 0) {
    visualInformation = {
      ...visualInformation,
      builder: visualInformationFromBuilder[0],
      metadata: {
        title,
        description,
        image,
        icon,
        rating
      }
    };
  }

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

const formatCredential = (credential: any, type?: string) => {
  if (type === 'title') {
    if (
      credential?.credentialSubject?.value?.name ||
      credential?.credentialSubject?.value?.title
    ) {
      return (
        credential?.credentialSubject?.value?.name ||
        credential?.credentialSubject?.value?.title
      );
    }

    if (
      credential?.credentialSubject?.value?.values?.name ||
      credential?.credentialSubject?.value?.values?.title
    ) {
      return (
        credential?.credentialSubject?.value?.values?.name ||
        credential?.credentialSubject?.value?.values?.title
      );
    }

    if (
      credential?.visualInformation?.builder?.title ||
      credential?.visualInformation?.title
    ) {
      return (
        credential?.visualInformation?.builder?.title ||
        credential?.visualInformation?.title
      );
    }

    if (credential?.credentialSubject?.type) {
      return credential?.credentialSubject?.type;
    }

    return '';
  }

  if (type === 'description') {
    if (
      credential?.credentialSubject?.value?.description ||
      credential?.credentialSubject?.value?.values?.description
    ) {
      let description =
        credential?.credentialSubject?.value?.description ||
        credential?.credentialSubject?.value?.values?.description;

      if (description?.length > TEXT_LIMIT) {
        return description.slice(0, TEXT_LIMIT) + '...';
      }

      return description;
    }

    return '';
  }

  if (type === 'image') {
    if (
      credential?.credentialSubject?.value?.imageUrl ||
      credential?.credentialSubject?.value?.image ||
      credential?.credentialSubject?.value?.values?.imageUrl ||
      credential?.credentialSubject?.value?.values?.image
    ) {
      return (
        credential?.credentialSubject?.value?.imageUrl ||
        credential?.credentialSubject?.value?.image ||
        credential?.credentialSubject?.value?.values?.imageUrl ||
        credential?.credentialSubject?.value?.values?.image
      );
    }

    if (
      credential?.visualInformation?.builder?.image ||
      credential?.visualInformation?.builder?.imageUrl ||
      credential?.visualInformation?.image ||
      credential?.visualInformation?.imageUrl
    ) {
      return (
        credential?.visualInformation?.builder?.image ||
        credential?.visualInformation?.builder?.imageUrl ||
        credential?.visualInformation?.image ||
        credential?.visualInformation?.imageUrl
      );
    }

    return '';
  }

  if (type === 'icon') {
    if (
      credential?.visualInformation?.builder?.icon ||
      credential?.visualInformation?.icon
    ) {
      return (
        credential?.visualInformation?.builder?.icon ||
        credential?.visualInformation?.icon
      );
    }

    return '';
  }

  if (type === 'rating') {
    if (
      credential?.credentialSubject?.value?.values?.rating ||
      credential?.credentialSubject?.value?.rating
    ) {
      return parseInt(
        credential?.credentialSubject?.value?.values?.rating ||
          credential?.credentialSubject?.value?.rating,
        10
      );
    }

    return 0;
  }

  return credential;
};

export { getCredentials, getCredential, buildCredential, formatCredential };
