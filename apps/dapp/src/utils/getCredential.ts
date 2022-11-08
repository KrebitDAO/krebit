import 'isomorphic-fetch';

interface Props {
  verifyUrl: string;
  claimedCredential?: any;
  claimedCredentialId?: string;
  credentialSubjectAddress?: string;
  credentialSubjectAddressDID?: string;
}

export const getCredential = async (props: Props) => {
  const {
    verifyUrl,
    claimedCredential,
    claimedCredentialId,
    credentialSubjectAddress,
    credentialSubjectAddressDID
  } = props;

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        claimedCredential: claimedCredential ? claimedCredential : null,
        claimedCredentialId: claimedCredentialId ? claimedCredentialId : null,
        credentialSubjectAddress: credentialSubjectAddress
          ? credentialSubjectAddress
          : null,
        credentialSubjectAddressDID: credentialSubjectAddressDID
          ? credentialSubjectAddressDID
          : null
      })
    }).then(result => result.json());

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};
