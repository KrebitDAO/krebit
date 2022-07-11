import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDDataStore } from '@glazed/did-datastore';
import { PrivateKey } from '@textile/hub';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { Lit, getOwnsAddressConditions, decodeb64 } from '../lit.mjs';

const ED25519_KEY = 'ed25519';

export const getED25519 = async (
  idx: DIDDataStore,
  ceramic: CeramicClient,
  wallet: ethers.Wallet
) => {
  let ed25519Identity: PrivateKey;
  let ed25519 = await idx.get(ED25519_KEY);
  console.log('ed25519: ', ed25519);

  if (ed25519 === null || Object.keys(ed25519).length === 0) {
    ed25519Identity = PrivateKey.fromRandom();

    const encryptedContent = await Lit.encrypt(
      ed25519Identity.toString(),
      getOwnsAddressConditions(wallet.address),
      wallet
    );
    //console.log('encryptedContent: ', encryptedContent);

    //console.log('schemaURL: ', idx.model.getSchemaURL('EncryptedContent'));

    const doc = await TileDocument.create(ceramic, encryptedContent, {
      schema: idx.model.getSchemaURL('EncryptedContent'),
      family: 'krebit',
      controllers: [idx.id],
      tags: ['lit', 'ed25519'],
    });

    //console.log('litDoc: ', doc.id.toString());

    let newValue = {
      publicKey: ed25519Identity.public.toString(),
      privateKey: 'ceramic://' + doc.id.toString(),
    };
    console.log('ed25519: ', newValue);

    await idx.set('ed25519', newValue);

    return ed25519Identity;
  }
  try {
    const ed25519Private = await ceramic.loadStream(ed25519.privateKey);

    console.log('Encrypted ed25519: ', ed25519Private.content);

    const decryptedString = await Lit.decrypt(
      ed25519Private.content['encryptedZip'],
      ed25519Private.content['symKey'],
      ed25519Private.content['accessControlConditions'],
      wallet,
      ed25519Private.content['accessControlConditionType']
    );

    //console.log('decryptedString: ', decryptedString);

    ed25519Identity = PrivateKey.fromString(decryptedString);
    return ed25519Identity;
  } catch (error) {
    console.error('Error decrypting: ', error);
  }
};
