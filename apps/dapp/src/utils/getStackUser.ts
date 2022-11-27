import 'isomorphic-fetch';

interface Props {
  accessToken: string;
}

const { NEXT_PUBLIC_STACK_URL } = process.env;
const { NEXT_PUBLIC_STACK_APP_KEY } = process.env;

export const getStackUser = async (props: Props) => {
  const { accessToken } = props;

  try {
    const response = await fetch(
      `${NEXT_PUBLIC_STACK_URL}&key=${NEXT_PUBLIC_STACK_APP_KEY}&access_token=${accessToken}`
    ).then(result => result.json());

    if (response.items.length > 0) return response.items[0];
    else return null;
  } catch (error) {
    console.error(error);

    return null;
  }
};
