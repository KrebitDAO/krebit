import { ethers } from 'ethers';

import { DIDDataStore } from '@glazed/did-datastore';
import {
  EIP712VC,
  getEIP712Credential,
  getKrebitCredentialTypes
} from '@krebitdao/eip712-vc';

import { krbToken } from '../schemas';
import { Lit } from '../lib';
import { config } from '../config';

// --- Crypto lib for hashing
import { createHash } from 'crypto';
import { base64 } from 'ethers/lib/utils';

interface Props {
  wallet: ethers.Wallet;
  idx: DIDDataStore;
  claim: any;
  encrypted?: 'hash' | 'lit' | 'plain';
}

const currentConfig = config.get();

// utility to create an ordered array of the given input (of the form [[key:string, value:string], ...])
const objToSortedArray = (obj: { [k: string]: string }): string[][] => {
  const keys: string[] = Object.keys(obj).sort();
  return keys.reduce((out: string[][], key: string) => {
    out.push([key, obj[key]]);
    return out;
  }, [] as string[][]);
};

const arrayToObject = (arr: string[][]): { [k: string]: string } => {
  return arr.reduce((o, key) => ({ ...o, [key[0]]: key[1] }), {});
};

export const issueCredential = async (props: Props) => {
  const { wallet, idx, claim, encrypted } = props;

  if (!wallet) {
    throw new Error('Wallet not defined');
  }

  if (!idx) {
    throw new Error('IDX not defined');
  }

  const issuanceDate = Date.now() - 1000 * 60 * 60 * 12;
  const expirationDate = new Date(claim?.expirationDate);

  if (!expirationDate) {
    throw new Error('No expiration date defined');
  }

  const lit = new Lit();

  if (typeof claim.credentialSubject.value === 'object') {
    if (encrypted == 'hash') {
      // Generate a hash like SHA256(DID+PII), where PII is the (deterministic) JSON representation
      // of the PII object after transforming it to an array of the form [[key:string, value:string], ...]
      // with the elements sorted by key
      // This hash can be used to de-duplicate provider verifications without revealing PII
      const hash = base64.encode(
        createHash('sha256')
          .update(idx.id, 'utf-8')
          .update(
            JSON.stringify(objToSortedArray(claim.credentialSubject.value))
          )
          .digest()
      );
      claim.credentialSubject.value = hash;
      claim.credentialSubject.encrypted = 'hash';
    } else if (encrypted == 'lit') {
      let encryptedContent = await lit.encrypt(
        JSON.stringify(claim.credentialSubject.value),
        lit.getOwnsAddressConditions(claim.credentialSubject.ethereumAddress),
        wallet
      );
      claim.credentialSubject.value = JSON.stringify(encryptedContent);
      claim.credentialSubject.encrypted = 'lit';
    } else {
      claim.credentialSubject.value = JSON.stringify(
        claim.credentialSubject.value
      );
      claim.credentialSubject.encrypted = 'plain';
    }
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
      ethereumAddress: await wallet.getAddress()
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

  const eip712credential = getEIP712Credential(credential);

  const krebitTypes = getKrebitCredentialTypes();
  const eip712_vc = new EIP712VC(krbToken[currentConfig.network].domain);
  const verifiableCredential = await eip712_vc.createEIP712VerifiableCredential(
    eip712credential,
    krebitTypes,
    async () => {
      return await wallet._signTypedData(
        krbToken[currentConfig.network].domain,
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
  return w3Credential;
};
