import 'isomorphic-fetch';

interface Props {
  verifyUrl: string;
  claimedCredential?: any;
  claimedCredentialId?: string;
}

export const getCredential = async (props: Props) => {
  const { verifyUrl, claimedCredential, claimedCredentialId } = props;

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        claimedCredential: claimedCredential ? claimedCredential : null,
        claimedCredentialId: claimedCredentialId ? claimedCredentialId : null
      })
    }).then(result => result.json());

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};
