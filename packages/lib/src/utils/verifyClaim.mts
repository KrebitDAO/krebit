import { ethers } from 'ethers';
import { DIDDataStore } from '@glazed/did-datastore';
import eip712VC from '@krebitdao/eip712-vc';
import { PrivateKey, PublicKey, Users } from '@textile/hub';

import { krbToken } from '../schemas/index.mjs';
import { ILastMessage } from './getLastMessage.mjs';

const NETWORK = process.env.NEXT_PUBLIC_NETWORK;
const TRUST = parseInt(process.env.SERVER_TRUST, 10);
const STAKE = parseInt(process.env.SERVER_STAKE, 10);
const EXPIRES_YEARS = parseInt(process.env.SERVER_EXPIRES_YEARS, 10);

export const verifyClaim = async (
  wallet: ethers.Wallet,
  idx: DIDDataStore,
  message: ILastMessage,
  claim: any,
  ed25519: PrivateKey,
  userAPI: Users
) => {
  const issuanceDate = Date.now() - 1000 * 60 * 60 * 12;
  const expirationDate = new Date();

  expirationDate.setFullYear(expirationDate.getFullYear() + EXPIRES_YEARS);

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/eip712sig-2021',
    ],
    type: ['VerifiableCredential', claim.credentialSubject.type],
    id: claim.id,
    issuer: {
      id: idx.id,
      ethereumAddress: wallet.address,
    },
    credentialSubject: {
      ...claim.credentialSubject,
      nbf: Math.floor(issuanceDate / 1000),
      exp: EXPIRES_YEARS ? Math.floor(expirationDate.getTime() / 1000) : 0,
      trust: TRUST,
      stake: STAKE,
      price: message.deal.price * 10 ** 18,
    },
    credentialSchema: {
      id: 'https://github.com/KrebitDAO/eip712-vc',
      type: 'Eip712SchemaValidator2021',
    },
    issuanceDate: new Date(issuanceDate).toISOString(),
    expirationDate: new Date(expirationDate).toISOString(),
  };

  const eip712credential = eip712VC.getEIP712Credential(credential);

  if (wallet) {
    const krebitTypes = eip712VC.getKrebitCredentialTypes();
    const eip712_vc = new eip712VC.EIP712VC(krbToken[NETWORK].domain);
    const verifiableCredential =
      await eip712_vc.createEIP712VerifiableCredential(
        eip712credential,
        krebitTypes,
        async () => {
          return await wallet._signTypedData(
            krbToken[NETWORK].domain,
            krebitTypes,
            eip712credential
          );
        }
      );

    const w3Credential = {
      ...credential,
      proof: verifiableCredential.proof,
    };

    console.log('W3C Verifiable Credential: ', w3Credential);

    //Upload attestation to Self.Id and Textile with Status Signed
    try {
      console.log('Saving signed attestation on Self.Id...');

      // Update Attestations
      const attestationDoc = await idx.model.createTile(
        'VerifiableCredential',
        w3Credential
      );
      const krbProfile = await idx.get('issuedCredentials');

      let result = null;

      if (krbProfile) {
        const current = krbProfile.issued ? krbProfile.issued : [];

        if (!current.includes(attestationDoc.id.toUrl())) {
          current.push(attestationDoc.id.toUrl());

          result = await idx.merge('issuedCredentials', {
            issued: current,
          });
        }
      } else {
        result = await idx.set('issuedCredentials', {
          issued: [attestationDoc.id.toUrl()],
        });
      }

      if (result) {
        console.log('Sending Attestation to Credential Subject...');

        try {
          // Get To public textile Identity from To DID
          const recipient = await idx.get('ed25519', message.did);
          const recipientKey = PublicKey.fromString(recipient.publicKey);

          // Encode message object as string
          const encoder = new TextEncoder();
          const body = encoder.encode(
            JSON.stringify({
              subject: 'Verifiable Credential',
              text: {
                blocks: [
                  {
                    key: 'b7395',
                    text: 'Signed Attestation',
                    type: 'unstyled',
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                  },
                ],
                entityMap: {},
              },
              to: message.did,
              from: idx.id,
              address: wallet.address,
              attachedVC: w3Credential,
              vcId: attestationDoc.id.toUrl(),
            })
          );

          const msg = await userAPI.sendMessage(ed25519, recipientKey, body);
          if (msg.createdAt) {
            console.log('Message has been Sent.');
            return true;
          }
        } catch (error) {
          console.error('Send Message failure:', error);

          return false;
        }
      }
    } catch (error) {
      console.error('Update failure:', error);

      return false;
    }
  }
};
