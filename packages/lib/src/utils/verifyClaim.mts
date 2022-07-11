import { ethers } from 'ethers';
import { DIDDataStore } from '@glazed/did-datastore';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import eip712VC from '@krebitdao/eip712-vc';

import { krbToken } from '../schemas/index.mjs';

import { Lit, getOwnsAddressConditions, decodeb64 } from '../lit.mjs';

const NETWORK = process.env.NEXT_PUBLIC_NETWORK;

export const issueCredential = async (
  wallet: ethers.Wallet,
  idx: DIDDataStore,
  claim: any
) => {
  const issuanceDate = Date.now() - 1000 * 60 * 60 * 12;
  const expirationDate = new Date(claim.expirationDate);

  if (claim.credentialSubject.encrypted === 'true') {
    let encryptedContent = await Lit.encrypt(
      JSON.stringify(claim.credentialSubject.value),
      getOwnsAddressConditions(claim.credentialSubject.ethereumAddress),
      wallet
    );
    claim.credentialSubject.value = JSON.stringify(encryptedContent);
  } else {
    claim.credentialSubject.value = JSON.stringify(
      claim.credentialSubject.value
    );
  }

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/eip712sig-2021'
    ],
    type: ['VerifiableCredential', claim.credentialSubject.type],
    id: claim.id,
    issuer: {
      id: idx.id,
      ethereumAddress: wallet.address
    },
    credentialSubject: {
      ...claim.credentialSubject,
      nbf: Math.floor(issuanceDate / 1000),
      exp: Math.floor(expirationDate.getTime() / 1000)
    },
    credentialSchema: {
      id: 'https://github.com/KrebitDAO/eip712-vc',
      type: 'Eip712SchemaValidator2021'
    },
    issuanceDate: new Date(issuanceDate).toISOString(),
    expirationDate: claim.expirationDate
  };

  const eip712credential = eip712VC.getEIP712Credential(credential);

  if (wallet) {
    const krebitTypes = eip712VC.getKrebitCredentialTypes();
    const eip712_vc = new eip712VC.EIP712VC(krbToken[NETWORK].domain);
    const verifiableCredential = await eip712_vc.createEIP712VerifiableCredential(
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
      proof: verifiableCredential.proof
    };

    console.log('W3C Verifiable Credential: ', w3Credential);

    //Upload attestation to Self.Id and Textile with Status Signed
    try {
      console.log('Saving signed attestation on Self.Id...');

      const attestationDoc = await TileDocument.create(
        idx.ceramic,
        w3Credential,
        {
          schema: idx.model.getSchemaURL('VerifiableCredential'),
          family: 'krebit',
          controllers: [idx.id],
          tags: credential.type
        }
      );
      console.log('Created stream: ', attestationDoc.id.toUrl());
      let result = null;
      if (attestationDoc.id.toUrl()) {
        const krbProfile = await idx.get('issuedCredentials');

        if (krbProfile && krbProfile.issued && krbProfile.issued.length < 100) {
          const current = krbProfile.issued ? krbProfile.issued : [];

          if (!current.includes(attestationDoc.id.toUrl())) {
            current.push(attestationDoc.id.toUrl());

            result = await idx.merge('issuedCredentials', {
              issued: current
            });
          }
        } else {
          result = await idx.set('issuedCredentials', {
            issued: [attestationDoc.id.toUrl()]
          });
        }
      }

      if (result) {
        return {
          issuedCredential: w3Credential,
          issuedCredentialId: attestationDoc.id.toUrl()
        };
      }
    } catch (error) {
      console.error('issueCredential failure:', error);

      return false;
    }
  }
};
