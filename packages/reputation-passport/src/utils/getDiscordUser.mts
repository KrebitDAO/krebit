import 'isomorphic-fetch';

import { config } from '../config/index.mjs';

interface Props {
  tokenType: string;
  accessToken: string;
}

const { DISCORD_URL } = config;

export const getDiscordUser = async (props: Props) => {
  const { tokenType, accessToken } = props;

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
