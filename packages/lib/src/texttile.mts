import { Client, createUserAuth, Identity, Users } from '@textile/hub';

const USER_GROUP_KEY = process.env.NEXT_PUBLIC_USER_GROUP_KEY;
const USER_GROUP_SECRET = process.env.NEXT_PUBLIC_USER_GROUP_SECRET;

const setAuth = async () => {
  const expiration = new Date(Date.now() + 3600 * 1000 * 24);
  const userAuth = await createUserAuth(
    USER_GROUP_KEY,
    USER_GROUP_SECRET,
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

const getUser = async (textileID: Identity) => {
  const auth = await setAuth();

  const client = Users.withUserAuth(auth);
  await client.getToken(textileID);

  return client;
};

export { setAuth, getClient, getUser };
