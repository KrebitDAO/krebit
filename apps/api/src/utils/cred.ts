import 'isomorphic-fetch';

interface IProps {
  address: string;
}

const { SERVER_CRED_API_URL } = process.env;
const { SERVER_CRED_API_TOKEN } = process.env;

export const getScore = async (props: IProps) => {
  const { address } = props;
  try {
    const response = await fetch(
      `${SERVER_CRED_API_URL}/score/address/${address}`,
      {
        method: 'GET',
        headers: {
          authorization: `Token ${SERVER_CRED_API_TOKEN}`
        }
      }
    ).then(result => result.json());
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const cred = {
  getScore
};
