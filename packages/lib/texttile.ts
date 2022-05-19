import { Client, createUserAuth, Identity } from '@textile/hub';

const { APP_USER_GROUP_KEY, APP_USER_GROUP_SECRET } = process.env;

const setAuth = async () => {
  const expiration = new Date(Date.now() + 3600 * 1000 * 24);
  const userAuth = await createUserAuth(
    APP_USER_GROUP_KEY,
    APP_USER_GROUP_SECRET,
    expiration
  );

  return userAuth;
};

const getClient = async (textileID: Identity) => {
  const auth = await setAuth();

  const client = Client.withUserAuth(auth);
  await client.getToken(textileID);

  return client;
};

export { setAuth, getClient };
