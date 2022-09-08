import { createHash } from 'crypto';
import { ethers } from 'ethers';
import { base64 } from 'ethers/lib/utils';
import { DIDDataStore } from '@glazed/did-datastore';
import { TileDocument } from '@ceramicnetwork/stream-tile';
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
  did?: string;
  expirationDate: string;
  tags?: string[];
  trust?: number;
  stake?: number;
  price?: number;
  encrypt?: 'hash' | 'lit' | 'plain';
  shareEncryptedWith?: string;
}

interface IssueProps {
  wallet: ethers.Wallet;
  idx: DIDDataStore;
  claim: ClaimProps;
}

interface HashProps {
  did: string;
  value: any;
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

// Generate a hash like SHA256(DID+PII), where PII is the (deterministic) JSON representation
// of the PII object after transforming it to an array of the form [[key:string, value:string], ...]
// with the elements sorted by key
// This hash can be used to de-duplicate provider verifications without revealing PII
export const hashClaimValue = (props: HashProps) => {
  return base64.encode(
    createHash('sha256')
      .update(props.did, 'utf-8')
      .update(JSON.stringify(objToSortedArray(props.value)))
      .digest()
  );
};

export const issueCredential = async (props: IssueProps) => {
  const { wallet, idx, claim } = props;

  if (!wallet) {
    throw new Error('Wallet not defined');
  }

  if (!idx) {
    throw new Error('IDX not defined');
  }

  const issuerAddres: string = await wallet.getAddress();

  // 5 min ago (there is a delay on the blockchain time)
  const issuanceDate = Date.now() - 1000 * 60 * 5;
  const expirationDate = new Date(claim?.expirationDate);

  if (!expirationDate) {
    throw new Error('No expiration date defined');
  }

  const lit = new Lit();

  if (typeof claim.value === 'object') {
    if (claim.encrypt == 'hash') {
      claim['value'] = hashClaimValue({ did: idx.id, value: claim.value });
      claim['encrypted'] = 'hash';
    } else if (claim.encrypt == 'lit') {
      let accessControlConditions = lit.getOwnsAddressCondition(
        claim.ethereumAddress
      );
      if (claim.shareEncryptedWith) {
        accessControlConditions = accessControlConditions.concat(
          lit.getShareWithCondition(claim.shareEncryptedWith)
        );
      }
      let encryptedContent = await lit.encrypt(
        JSON.stringify(claim.value),
        accessControlConditions,
        wallet
      );
      const stream = await TileDocument.create(
        idx.ceramic,
        accessControlConditions
      );
      claim['value'] = JSON.stringify({
        ...encryptedContent,
        accessControlConditions: stream.id.toUrl()
      });
      claim['encrypted'] = 'lit';
    } else {
      claim['value'] = JSON.stringify(claim.value);
      claim['encrypted'] = 'none';
    }
  }
  delete claim.encrypt;

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/eip712sig-2021'
    ],
    type: ['VerifiableCredential'].concat(claim.type, ...claim.tags),
    id: claim.id,
    issuer: {
      id: idx.id,
      ethereumAddress: issuerAddres
    },
    credentialSubject: {
      ...claim,
      id: claim.did
        ? claim.did
        : `did:pkh:eip155:${krbToken[currentConfig.network].domain.chainId}:${
            claim.ethereumAddress
          }`,
      trust: claim.trust ? claim.trust : 100, // How much we trust the evidence to sign this?
      stake: claim.stake ? claim.stake : 1, // In KRB
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
  console.debug('Credential: ', credential);
  const eip712credential = getEIP712Credential(credential);
  console.debug('eip712credential: ', eip712credential);
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
