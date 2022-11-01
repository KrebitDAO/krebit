import 'isomorphic-fetch';

interface IProps {
  accessToken: string;
}

interface IGuilgProps extends IProps {
  guildId: string;
}

const { SERVER_STACK_API_URL } = process.env;
const { SERVER_STACK_APP_KEY } = process.env;

export const getStackUser = async (props: IProps) => {
  const { accessToken } = props;

  try {
    const response = await fetch(
      `${SERVER_STACK_API_URL}/me?order=desc&sort=reputation&site=stackoverflow&key=${SERVER_STACK_APP_KEY}&access_token=${accessToken}`
    ).then(result => result.json());

    console.log('stack response:', response);
    if (response?.items?.length > 0) return response.items[0];
    else return null;
  } catch (error) {
    console.error(error);

    return null;
  }
};
export const stack = {
  getStackUser
};
