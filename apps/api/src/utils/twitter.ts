import { auth, Client } from 'twitter-api-sdk';

export type TwitterUserResponse = {
  id?: string;
  name?: string;
  username?: string;
  followers?: number;
  posts?: number;
};

interface TwitterAuthProps {
  client: auth.OAuth2User;
  state: string;
  code_challenge: string;
  code: string;
}

export const getTwitterToken = async (code: string, address: string) => {
  try {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        client_id: process.env.SERVER_TWITTER_CLIENT_ID,
        redirect_uri: process.env.SERVER_TWITTER_CALLBACK,
        code_verifier: address
      })
    }).then(result => result.json());
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const revokeTwitterToken = async (token: string) => {
  try {
    const response = await fetch('https://api.twitter.com/2/oauth2/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        token: token,
        client_id: process.env.SERVER_TWITTER_CLIENT_ID
      })
    }).then(result => result.json());
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const getTwitterUser = async (
  props: TwitterAuthProps
): Promise<TwitterUserResponse> => {
  const { client, state, code_challenge, code } = props;
  try {
    /*client.generateAuthURL({
      state,
      code_challenge,
      code_challenge_method: 'plain'
    });

    // retrieve user's auth bearer token to authenticate client
    await client.requestAccessToken(code);*/
    const twitterClient = new Client(code);

    // return information about the (authenticated) requesting user
    const myUser = await twitterClient.users.findMyUser();
    return { ...myUser.data };
  } catch (err) {
    console.log('err: ', err);
    throw new Error(err);
  }
};

export const getTwitterFollowersCount = async (
  props: TwitterAuthProps
): Promise<TwitterUserResponse> => {
  const { client, state, code_challenge, code } = props;
  try {
    /* client.generateAuthURL({
      state,
      code_challenge,
      code_challenge_method: 'plain'
    });

    // retrieve user's auth bearer token to authenticate client
    await client.requestAccessToken(code);*/
    const twitterClient = new Client(code);

    // public metrics returns more data on user
    const myUser = await twitterClient.users.findMyUser({
      'user.fields': ['public_metrics']
    });
    return {
      ...myUser.data,
      followers: myUser.data.public_metrics.followers_count
    };
  } catch (err) {
    console.log('err: ', err);
    throw new Error(err);
  }
};

export const getTwitterPostsCount = async (
  props: TwitterAuthProps
): Promise<TwitterUserResponse> => {
  const { client, state, code_challenge, code } = props;
  try {
    /*client.generateAuthURL({
      state,
      code_challenge,
      code_challenge_method: 'plain'
    });

    // retrieve user's auth bearer token to authenticate client
    await client.requestAccessToken(code);*/
    const twitterClient = new Client(code);

    // public metrics returns more data on user
    const myUser = await twitterClient.users.findMyUser({
      'user.fields': ['public_metrics']
    });

    return {
      ...myUser.data,
      posts: myUser.data.public_metrics.tweet_count
    };
  } catch (err) {
    console.log('err: ', err);
    throw new Error(err);
  }
};

export const twitter = {
  getTwitterToken,
  revokeTwitterToken,
  getTwitterUser,
  getTwitterFollowersCount,
  getTwitterPostsCount
};
