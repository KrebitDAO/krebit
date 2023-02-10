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

export const getDiscordUserLitAction = `
  const getDiscordUser = async () => {
    try {
      const response = await fetch(params.serverDiscordApiUrl + "/users/@me", {
        headers: {
          authorization: params.tokenType + " " + params.accessToken,
        }
      }).then(result => result.json());

      if (response?.id !== params?.id) return;

      const sigShare = await LitActions.signEcdsa({ toSign: params.credentialToSign, publicKey, sigName });
    } catch (error) {
      console.error(error);
    }
  }

  getDiscordUser();
`;

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
  getDiscordUserLitAction,
  getDiscordGuild,
  getDiscordGuildMember
};
