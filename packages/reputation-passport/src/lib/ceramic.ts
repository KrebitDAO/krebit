import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DataModel } from '@glazed/datamodel';
import { DIDDataStore } from '@glazed/did-datastore';

// DID-session
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';
import { DIDSession } from '@glazed/did-session';

// ThreeId
import { getResolver as getKeyResolver } from 'key-did-resolver';
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver';
import { ThreeIdProvider } from '@3id/did-provider';
import { DID } from 'dids';
import { fromString } from 'uint8arrays/from-string';
import { hash } from '@stablelib/sha256';

import { datamodel } from '../schemas';

const DID_ERROR = 'DID session not authenticated';
const DOMAIN = 'krebit.id';

interface PublicIDXProps {
  client: CeramicClient;
}

interface AuthProviderProps {
  address: string;
  ethProvider: ethers.providers.Provider | ethers.providers.ExternalProvider;
  client: CeramicClient;
}

interface ProviderProps extends AuthProviderProps {
  provider?: 'did' | '3id';
}

const publicIDX = (props: PublicIDXProps) => {
  const { client } = props;

  const model = new DataModel({ ceramic: client, aliases: datamodel });
  const store = new DIDDataStore({ ceramic: client, model });

  return store;
};

const authDIDSession = async (props: AuthProviderProps) => {
  const { address, ethProvider, client } = props;

  const authProvider = new EthereumAuthProvider(ethProvider, address);
  const session = new DIDSession({ authProvider });

  const did = await session.authorize({ domain: DOMAIN });
  await client.setDID(did);

  // Creating model and store
  const model = new DataModel({ ceramic: client, aliases: datamodel });
  const store = new DIDDataStore({ ceramic: client, model });

  if (store.authenticated) {
    console.log('DID session authenticated: ', did.id);
    return store;
  }

  throw new Error(DID_ERROR);
};

const auth3IDProvider = async (props: AuthProviderProps) => {
  const { address, ethProvider, client } = props;

  const authProvider = new EthereumAuthProvider(ethProvider, address);
  const authId = (await authProvider.accountId()).toString();

  console.log(authId);

  const authSecretMsg = 'Allow this account to control your identity';
  const authSecretSigned = await authProvider.authenticate(authSecretMsg);
  const authSecret = hash(fromString(authSecretSigned.slice(2)));

  const threeID = await ThreeIdProvider.create({
    authId,
    authSecret,
    getPermission: () => Promise.resolve([]),
    ceramic: client
  });
  const did = new DID({
    provider: threeID.getDidProvider(),
    resolver: {
      ...get3IDResolver(client),
      ...getKeyResolver()
    }
  });
  await did.authenticate();
  await client.setDID(did);

  // Creating model and store
  const model = new DataModel({ ceramic: client, aliases: datamodel });
  const store = new DIDDataStore({ ceramic: client, model });

  if (store.authenticated) {
    console.log('3ID session authenticated: ', did.id);
    return store;
  }

  throw new Error(DID_ERROR);
};

const authProvider = async (props: ProviderProps) => {
  const { provider = 'did', address, ethProvider, client } = props;

  if (provider === 'did') {
    return await authDIDSession({
      address,
      ethProvider,
      client
    });
  }

  if (provider === '3id') {
    return await auth3IDProvider({
      address,
      ethProvider,
      client
    });
  }

  throw new Error('Provider not found');
};

export const ceramic = {
  publicIDX,
  authDIDSession,
  auth3IDProvider,
  authProvider
};
