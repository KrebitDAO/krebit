import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DataModel } from '@glazed/datamodel';
import { DIDDataStore } from '@glazed/did-datastore';
import localStore from 'store2';

// DID-session
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';
import { DIDSession } from 'did-session';

import { datamodel } from '../schemas';

const DID_ERROR = 'DID session not authenticated';
const DOMAIN = 'krebit.id';

interface PublicIDXProps {
  client: CeramicClient;
}

interface AuthProviderProps {
  client: CeramicClient;
  address?: string;
  ethProvider?: ethers.providers.Provider | ethers.providers.ExternalProvider;
  session?: DIDSession | undefined;
}

const publicIDX = (props: PublicIDXProps) => {
  const { client } = props;

  const model = new DataModel({ ceramic: client, aliases: datamodel });
  const store = new DIDDataStore({ ceramic: client, model });

  return store;
};

const authDIDSession = async (props: AuthProviderProps) => {
  const { client, address, ethProvider, session } = props;
  let currentSession: DIDSession = session;

  if (!currentSession) {
    const authProvider = new EthereumAuthProvider(ethProvider, address);
    const newSession = await DIDSession.authorize(authProvider, {
      resources: [`ceramic://*`],
      domain: DOMAIN
    });

    localStore.set(
      'krebit.reputation-passport.session',
      newSession.serialize()
    );

    currentSession = newSession;
  }

  const did = currentSession.did;
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

export const ceramic = {
  publicIDX,
  authDIDSession
};
