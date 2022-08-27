import { createHash } from 'crypto';
import { ethers } from 'ethers';
import { base64 } from 'ethers/lib/utils';
import { DIDDataStore } from '@glazed/did-datastore';
import {
  EIP712VC,
  getEIP712Credential,
  getKrebitCredentialTypes
} from '@krebitdao/eip712-vc';

import { krbToken } from '../schemas';
import { Lit } from '../lib';
import { config } from '../config';

export interface ClaimProps {
  id: string;
  value: any;
  type: string;
  typeSchema: string;
  ethereumAddress: string;
  expirationDate: string;
  tags?: string[];
  trust?: number;
  stake?: number;
  price?: number;
  encrypt?: 'hash' | 'lit' | 'plain';
}

interface IssueProps {
  wallet: ethers.Wallet;
  idx: DIDDataStore;
  claim: ClaimProps;
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

export const issueCredential = async (props: IssueProps) => {
  const { wallet, idx, claim } = props;

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

  if (typeof claim.value === 'object') {
    if (claim.encrypt == 'hash') {
      // Generate a hash like SHA256(DID+PII), where PII is the (deterministic) JSON representation
      // of the PII object after transforming it to an array of the form [[key:string, value:string], ...]
      // with the elements sorted by key
      // This hash can be used to de-duplicate provider verifications without revealing PII
      const hash = base64.encode(
        createHash('sha256')
          .update(idx.id, 'utf-8')
          .update(JSON.stringify(objToSortedArray(claim.value)))
          .digest()
      );
      claim['value'] = hash;
      claim['encrypted'] = 'hash';
    } else if (claim.encrypt == 'lit') {
      let encryptedContent = await lit.encrypt(
        JSON.stringify(claim.value),
        lit.getOwnsAddressConditions(claim.ethereumAddress),
        wallet
      );
      claim['value'] = JSON.stringify(encryptedContent);
      claim['encrypted'] = 'lit';
    } else {
      claim['value'] = JSON.stringify(claim.value);
      claim['encrypted'] = 'none';
    }
  }

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/eip712sig-2021'
    ],
    type: ['VerifiableCredential'].concat(claim.type, ...claim.tags),
    id: claim.id,
    issuer: {
      id: idx.id,
      ethereumAddress: await wallet.getAddress()
    },
    credentialSubject: {
      ...claim,
      id: `did:pkh:eip155:${krbToken[currentConfig.network].domain.chainId}:${
        claim.ethereumAddress
      }`,
      trust: claim.trust ? claim.trust : 1, // How much we trust the evidence to sign this?
      stake: claim.stake ? claim.stake : 0, // In KRB
      price: claim.price ? claim.price : 0, // charged to the user for claiming KRBs
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
