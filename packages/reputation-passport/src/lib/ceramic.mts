import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';
import { DIDSession } from '@glazed/did-session';
import { DataModel } from '@glazed/datamodel';
import { DIDDataStore } from '@glazed/did-datastore';

import { datamodel } from '../schemas/index.mjs';
import { WalletProvider } from '../utils/WalletProvider.mjs';

const DID_ERROR = 'Self.id not authenticated';
const DOMAIN = 'krebit.id';

interface Props {
  address: string;
  ethProvider:
    | EthereumAuthProvider
    | WalletProvider
    | ethers.providers.Web3Provider;
  client: CeramicClient;
}

const authenticateDID = async (props: Props) => {
  const { address, ethProvider, client } = props;

  const authProvider = new EthereumAuthProvider(ethProvider, address);
  const session = new DIDSession({ authProvider });

  const did = await session.authorize({ domain: DOMAIN });
  await client.setDID(did);

  // Creating model and store
  const model = new DataModel({ ceramic: client, aliases: datamodel });
  const store = new DIDDataStore({ ceramic: client, model });

  if (store.authenticated) {
    return store;
  }

  throw new Error(DID_ERROR);
};

export { authenticateDID };
