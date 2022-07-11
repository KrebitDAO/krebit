import { CeramicClient } from '@ceramicnetwork/http-client';
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';
import { DIDSession } from '@glazed/did-session';
import { DataModel } from '@glazed/datamodel';
import { DIDDataStore } from '@glazed/did-datastore';
import { hash } from '@stablelib/sha256';
import { fromString } from 'uint8arrays';
import { DID } from 'dids';

import { datamodel, idx } from './schemas/index.mjs';

const authSecretMsg = 'Allow this account to control your identity';
const DID_ERROR = 'Self.id not authenticated';

const authenticateClientDID = async (
  address: string,
  ethProvider: any,
  client: CeramicClient
) => {
  const authProvider = new EthereumAuthProvider(
    ethProvider?.provider || ethProvider,
    address
  );

  const session = new DIDSession({ authProvider });
  const did = await session.authorize({ domain: 'krebit.id' });
  console.log('did:', did.id);
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
  const session = new DIDSession({ authProvider });
  const did = await session.authorize({ domain: 'krebit.id' });

  console.log('did:', did);
  console.log('did:', did.id);

  client.setDID(did);

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
