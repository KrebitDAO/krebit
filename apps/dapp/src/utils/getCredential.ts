import 'isomorphic-fetch';

interface Props {
  verifyUrl: string;
  claimedCredential: any;
}

export const getCredential = async (props: Props) => {
  const { verifyUrl, claimedCredential } = props;

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ claimedCredential })
    }).then(result => result.json());

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};
