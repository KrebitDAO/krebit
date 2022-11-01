import 'isomorphic-fetch';

interface Props {
  address: string;
}

const { SERVER_DEWORK_API_URL } = process.env;

export const getDeworkUser = async (props: Props) => {
  const { address } = props;

  try {
    const response = await fetch(`${SERVER_DEWORK_API_URL}/${address}`).then(
      result => result.json()
    );

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};
