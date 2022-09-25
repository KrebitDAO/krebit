import { auth, Client } from 'twitter-api-sdk';

export type TwitterUserResponse = {
  id?: string;
  name?: string;
  username?: string;
};

interface TwitterAuthProps {
  client: auth.OAuth2User;
  state: string;
  code_challenge: string;
  code: string;
}

export const getTwitterUser = async (
  props: TwitterAuthProps
): Promise<TwitterUserResponse> => {
  const { client, state, code_challenge, code } = props;
  try {
    client.generateAuthURL({
      state,
      code_challenge,
      code_challenge_method: 'plain'
    });

    // retrieve user's auth bearer token to authenticate client
    await client.requestAccessToken(code);
    const twitterClient = new Client(client);

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
): Promise<number> => {
  const { client, state, code_challenge, code } = props;
  try {
    client.generateAuthURL({
      state,
      code_challenge,
      code_challenge_method: 'plain'
    });

    // retrieve user's auth bearer token to authenticate client
    await client.requestAccessToken(code);
    const twitterClient = new Client(client);

    // public metrics returns more data on user
    const myUser = await twitterClient.users.findMyUser({
      'user.fields': ['public_metrics']
    });
    return myUser.data.public_metrics.followers_count;
  } catch (err) {
    console.log('err: ', err);
    throw new Error(err);
  }
};

export const getTwitterPostsCount = async (
  props: TwitterAuthProps
): Promise<number> => {
  const { client, state, code_challenge, code } = props;
  try {
    client.generateAuthURL({
      state,
      code_challenge,
      code_challenge_method: 'plain'
    });

    // retrieve user's auth bearer token to authenticate client
    await client.requestAccessToken(code);
    const twitterClient = new Client(client);

    // public metrics returns more data on user
    const myUser = await twitterClient.users.findMyUser({
      'user.fields': ['public_metrics']
    });
    return myUser.data.public_metrics.tweet_count;
  } catch (err) {
    console.log('err: ', err);
    throw new Error(err);
  }
};

export const twitter = {
  getTwitterUser,
  getTwitterFollowersCount,
  getTwitterPostsCount
};
