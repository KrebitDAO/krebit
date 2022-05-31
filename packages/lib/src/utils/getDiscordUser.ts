const DISCORD_URL = 'https://discord.com/api/users/@me';

export const getDiscordUser = async (
  tokenType: string,
  accessToken: string
) => {
  try {
    const response = await fetch(DISCORD_URL, {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    }).then(result => result.json());

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};
