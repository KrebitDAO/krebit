import { CeramicClient } from '@ceramicnetwork/http-client';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
import { DataModel } from '@glazed/datamodel';
import { DIDDataStore } from '@glazed/did-datastore';
import { DID } from 'dids';

import { datamodel, idx } from './schemas';

const { SERVER_CERAMIC_URL } = process.env;

const client = new CeramicClient(SERVER_CERAMIC_URL);

const authenticateDID = async (address: string, ethProvider: any) => {
  const threeIdConnect = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(
    ethProvider?.provider || ethProvider,
    address
  );

  await threeIdConnect.connect(authProvider);
  const provider = threeIdConnect.getDidProvider();

  const did = new DID({
    provider,
    resolver: ThreeIdResolver.getResolver(client),
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

  throw new Error('Self.id not authenticated');
};

const publicIDX = () => {
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

export { authenticateDID, publicIDX, getEthereumAddress };
