import 'isomorphic-fetch';

interface Props {
  address: string;
}

const { SERVER_SPECT_API_URL } = process.env;

export const getSpectUser = async (props: Props) => {
  const { address } = props;

  try {
    const response = await fetch(`${SERVER_SPECT_API_URL}/${address}`).then(
      result => result.json()
    );

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};
