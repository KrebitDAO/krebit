import { CeramicClient } from '@ceramicnetwork/http-client';
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver';
import { getResolver as getKeyResolver } from 'key-did-resolver';
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
import { ThreeIdProvider } from '@3id/did-provider';
import { DataModel } from '@glazed/datamodel';
import { DIDDataStore } from '@glazed/did-datastore';
import { hash } from '@stablelib/sha256';
import { fromString } from 'uint8arrays';
import { DID } from 'dids';

import { datamodel, idx } from './schemas';

const authSecretMsg = 'Allow this account to control your identity';
const DID_ERROR = 'Self.id not authenticated';

const authenticateClientDID = async (
  address: string,
  ethProvider: any,
  client: CeramicClient
) => {
  const threeIdConnect = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(
    ethProvider?.provider || ethProvider,
    address
  );

  await threeIdConnect.connect(authProvider);
  const provider = threeIdConnect.getDidProvider();

  const did = new DID({
    provider,
    resolver: get3IDResolver(client),
  });
  await did.authenticate();
  await client.setDID(did);

  // Creating model and store
  const model = new DataModel({ ceramic: client, aliases: datamodel });
  const store = new DIDDataStore({ ceramic: client, model });

  (window as any).datamodel = model;
  (window as any).idx = store;

  if ((window as any).idx.authenticated) {
    return idx;
  }

  throw new Error(DID_ERROR);
};

const authenticateServerDID = async (
  address: string,
  ethProvider: any,
  client: CeramicClient
) => {
  const authProvider = new EthereumAuthProvider(
    ethProvider?.provider || ethProvider,
    address
  );
  const authId = (await authProvider.accountId()).toString();
  console.log('authProvider id: ', authId);

  const authSecretSigned = await authProvider.authenticate(authSecretMsg);
  const authSecret = hash(fromString(authSecretSigned.slice(2)));

  const threeID = await ThreeIdProvider.create({
    authId,
    authSecret,
    getPermission: () => Promise.resolve([]),
    ceramic: client,
  });
  const did = new DID({
    provider: threeID.getDidProvider(),
    resolver: {
      ...get3IDResolver(client),
      ...getKeyResolver(),
    },
  });
  await did.authenticate();
  console.log('did:', did.id);

  await client.setDID(did);

  console.log('Setting Ceramic DataStore...');

  // Creating model and store
  const model = new DataModel({ ceramic: client, aliases: datamodel });
  const store = new DIDDataStore({ ceramic: client, model });

  if (store.authenticated) {
    return store;
  }

  throw new Error(DID_ERROR);
};

const publicIDX = (client: CeramicClient) => {
  const model = new DataModel({ ceramic: client, aliases: datamodel });

  return new DIDDataStore({ ceramic: client, model });
};

const getEthereumAddress = cryptoAccounts => {
  if (cryptoAccounts) {
    const ethereumAddress = Object.keys(cryptoAccounts).find(value =>
      value.includes('eip155')
    );

    if (ethereumAddress) {
      return ethereumAddress.substring(0, ethereumAddress.indexOf('@'));
    }

    return null;
  }

  return null;
};

export {
  authenticateClientDID,
  authenticateServerDID,
  publicIDX,
  getEthereumAddress,
};
