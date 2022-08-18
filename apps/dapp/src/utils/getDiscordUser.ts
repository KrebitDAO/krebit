import 'isomorphic-fetch';

interface Props {
  tokenType: string;
  accessToken: string;
}

const { NEXT_SERVER_DISCORD_URL } = process.env;

export const getDiscordUser = async (props: Props) => {
  const { tokenType, accessToken } = props;

  try {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${tokenType} ${accessToken}`
      }
    }).then(result => result.json());

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};
