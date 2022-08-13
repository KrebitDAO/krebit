import { ethers } from 'ethers';
import { DIDDataStore } from '@glazed/did-datastore';
import eip712VC from '@krebitdao/eip712-vc';

import { config } from '../config';
import { krbToken } from '../schemas';
import { litProvider } from '../lib';

const { NETWORK } = config;

interface Props {
  wallet: ethers.Wallet;
  idx: DIDDataStore;
  claim: any;
}

export const issueCredential = async (props: Props) => {
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

  const lit = await litProvider();

  if (claim.credentialSubject.encrypted === 'true') {
    let encryptedContent = await lit.encrypt(
      JSON.stringify(claim.credentialSubject.value),
      lit.getOwnsAddressConditions(claim.credentialSubject.ethereumAddress),
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

  const eip712credential = eip712VC.getEIP712Credential(credential);

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
  return w3Credential;
};
