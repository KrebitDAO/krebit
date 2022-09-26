import 'isomorphic-fetch';

interface IProps {
  tokenType: string;
  accessToken: string;
}

interface IGuilgProps extends IProps {
  guildId: string;
}

const { SERVER_DISCORD_API_URL } = process.env;

export const getDiscordUser = async (props: IProps) => {
  const { tokenType, accessToken } = props;

  try {
    const response = await fetch(`${SERVER_DISCORD_API_URL}/users/@me`, {
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

export const getDiscordGuild = async (props: IGuilgProps) => {
  const { tokenType, accessToken, guildId } = props;

  try {
    const response = await fetch(`${SERVER_DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        authorization: `${tokenType} ${accessToken}`
      }
    }).then(result => result.json());
    return response.filter(guild => {
      return guild.id === guildId;
    })[0];
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const getDiscordGuildMember = async (props: IGuilgProps) => {
  const { tokenType, accessToken, guildId } = props;

  try {
    const response = await fetch(
      `${SERVER_DISCORD_API_URL}/users/@me/guilds/${guildId}/member`,
      {
        headers: {
          authorization: `${tokenType} ${accessToken}`
        }
      }
    ).then(result => result.json());

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const discord = {
  getDiscordUser,
  getDiscordGuild,
  getDiscordGuildMember
};
