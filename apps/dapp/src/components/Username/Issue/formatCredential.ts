const LIMIT = 100;

export const formatCredential = (credential: any, type?: string) => {
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

      if (description?.length > LIMIT) {
        return description.slice(0, LIMIT) + '...';
      }

      return description;
    }

    return '';
  }

  if (type === 'image') {
    if (
      credential?.credentialSubject?.value?.imageUrl ||
      credential?.credentialSubject?.value?.values?.imageUrl ||
      credential?.credentialSubject?.value?.image ||
      credential?.credentialSubject?.value?.values?.image
    ) {
      return (
        credential?.credentialSubject?.value?.imageUrl ||
        credential?.credentialSubject?.value?.values?.imageUrl ||
        credential?.credentialSubject?.value?.image ||
        credential?.credentialSubject?.value?.values?.image
      );
    }

    if (
      credential?.visualInformation?.image ||
      credential?.visualInformation?.imageUrl
    ) {
      return (
        credential?.visualInformation?.image ||
        credential?.visualInformation?.imageUrl
      );
    }

    return '';
  }

  return credential;
};
