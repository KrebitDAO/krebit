import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDDataStore } from '@glazed/did-datastore';
import { PrivateKey } from '@textile/hub';
import { fromString } from 'uint8arrays';

const CURRENT_VALUE = 'ed25519';

export const getED25519 = async (idx: DIDDataStore, ceramic: CeramicClient) => {
  let ed25519Identity: PrivateKey;
  let ed25519 = await idx.get(CURRENT_VALUE);

  if (ed25519 === null || Object.keys(ed25519).length === 0) {
    ed25519Identity = PrivateKey.fromRandom();

    const jwe = await ceramic.did.createJWE(
      fromString(ed25519Identity.toString()),
      [idx.id]
    );

    ed25519 = {
      publicKey: ed25519Identity.public.toString(),
      privateKey: jwe,
    };

    await idx.set(CURRENT_VALUE, ed25519);
  }

  const ed25519Private = (await ceramic.did.decryptJWE(
    ed25519.privateKey
  )) as Uint8Array & string;
  ed25519Identity = PrivateKey.fromString(ed25519Private);

  return ed25519Identity;
};
