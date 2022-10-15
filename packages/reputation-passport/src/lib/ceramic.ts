import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DataModel } from '@glazed/datamodel';
import { DIDDataStore } from '@glazed/did-datastore';
import localStore from 'store2';

// DID-session
import { DIDSession } from 'did-session';
import { EthereumNodeAuth, getAccountId } from '@didtools/pkh-ethereum';

import { schemas } from '../schemas/index.js';

const DID_ERROR = 'DID session not authenticated';
const DOMAIN = 'krebit.id';

export interface PublicIDXProps {
  client: CeramicClient;
}

export interface AuthProviderProps {
  client: CeramicClient;
  address?: string;
  ethProvider?: ethers.providers.Provider | ethers.providers.ExternalProvider;
  session?: DIDSession | undefined;
  defaultChainId?: string | undefined;
}

const publicIDX = (props: PublicIDXProps) => {
  const { client } = props;

  const model = new DataModel({ ceramic: client, aliases: schemas.datamodel });
  const store = new DIDDataStore({ ceramic: client, model });

  return store;
};

const authDIDSession = async (props: AuthProviderProps) => {
  const { client, address, ethProvider, session, defaultChainId } = props;
  let currentSession: DIDSession = session;

  if (!currentSession) {
    let accountId = await getAccountId(ethProvider, address);

    accountId.chainId.reference = defaultChainId ? defaultChainId : '1';
    console.log('Account chainId: ', accountId.chainId.reference);
    const authMethod = await EthereumNodeAuth.getAuthMethod(
      ethProvider,
      accountId,
      DOMAIN
    );

    const newSession = await DIDSession.authorize(authMethod, {
      resources: [`ceramic://*`],
      domain: DOMAIN
    });

    localStore.set('did-session', newSession.serialize());

    currentSession = newSession;
  }

  const did = currentSession.did;
  await client.setDID(did);

  // Creating model and store
  const model = new DataModel({ ceramic: client, aliases: schemas.datamodel });
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
