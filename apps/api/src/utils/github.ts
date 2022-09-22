import 'isomorphic-fetch';

const {
  SERVER_GITHUB_CLIENT_ID,
  SERVER_GITHUB_CLIENT_SECRET,
  SERVER_GITHUB_API_URL
} = process.env;

export type GithubFindMyUserResponse = {
  id?: string;
  login?: string;
  followers?: number;
  type?: string;
};

export const requestAccessToken = async (code: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${SERVER_GITHUB_CLIENT_ID}&client_secret=${SERVER_GITHUB_CLIENT_SECRET}&code=${code}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        }
      }
    ).then(result => result.json());

    console.log('response', response);

    if (!response.access_token) throw new Error(response);

    return response.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getGithubUser = async (code: string): Promise<any> => {
  try {
    // retrieve user's auth bearer token to authenticate client
    const accessToken = await requestAccessToken(code);

    const response = await fetch(`${SERVER_GITHUB_API_URL}/user`, {
      method: 'GET',
      headers: {
        Authorization: `token ${accessToken}`
      }
    }).then(result => result.json());

    if (!response) throw new Error(response);

    return response as GithubFindMyUserResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};
