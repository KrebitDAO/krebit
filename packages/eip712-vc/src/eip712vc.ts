import { utils } from 'ethers';

const { keccak256, getAddress, toUtf8Bytes, defaultAbiCoder } = utils;

import {
  DOMAIN_ENCODING,
  EIP712Config,
  EIP712DomainTypedData,
  DOMAIN_TYPE,
  VERIFIABLE_CREDENTIAL_PRIMARY_TYPE,
  VERIFIABLE_CREDENTIAL_EIP712_TYPE,
  CREDENTIAL_SCHEMA_EIP712_TYPE,
  VERIFIABLE_CREDENTIAL_W3C_TYPE,
  CREDENTIAL_SCHEMA_W3C_TYPE,
  W3CCredential,
  CredentialPayload,
  VerifiableCredential,
  EIP712CredentialTypedData,
  EIP712MessageTypes,
  EIP712Credential,
  EIP712VerifiableCredential,
  W3CCredentialTypedData,
  SignTypedData,
  VerifyTypedData,
  EIP712TypedData,
  Proof
} from './types';

export type {
  EIP712Config,
  EIP712MessageTypes,
  EIP712CredentialTypedData,
  EIP712TypedData,
  CredentialPayload,
  VerifiableCredential,
  EIP712VerifiableCredential,
  W3CCredential,
  W3CCredentialTypedData,
  SignTypedData,
  VerifyTypedData
};

export const DEFAULT_CONTEXT = 'https://www.w3.org/2018/credentials/v1';
export const EIP712_CONTEXT =
  'https://raw.githubusercontent.com/w3c-ccg/ethereum-eip712-signature-2021-spec/main/contexts/v1/index.json';
export const DEFAULT_VC_TYPE = 'VerifiableCredential';

export function getKrebitCredentialTypes(): any {
  return {
    VerifiableCredential: VERIFIABLE_CREDENTIAL_EIP712_TYPE,
    CredentialSchema: CREDENTIAL_SCHEMA_EIP712_TYPE,
    CredentialSubject: [
      { name: 'id', type: 'string' },
      { name: 'ethereumAddress', type: 'address' },
      { name: '_type', type: 'string' },
      { name: 'typeSchema', type: 'string' },
      { name: 'value', type: 'string' },
      { name: 'encrypted', type: 'string' },
      { name: 'trust', type: 'uint8' },
      { name: 'stake', type: 'uint256' },
      { name: 'price', type: 'uint256' },
      { name: 'nbf', type: 'uint256' },
      { name: 'exp', type: 'uint256' }
    ],
    Issuer: [
      { name: 'id', type: 'string' },
      { name: 'ethereumAddress', type: 'address' }
    ]
  };
}

const renameType = (
  obj: { id?: string | undefined } & { [x: string]: any }
) => {
  const keyValues = Object.keys(obj).map(key => {
    if (key === 'type') {
      return { ['_type']: obj[key] };
    } else {
      return { [key]: obj[key] };
    }
  });
  return Object.assign({}, ...keyValues);
};

export function getEIP712Credential(
  credential: W3CCredential
): EIP712Credential {
  return {
    _context: JSON.stringify(credential['@context']),
    _type: JSON.stringify(credential.type),
    id: credential.id,
    issuer: credential.issuer,
    credentialSubject: renameType(credential.credentialSubject),
    credentialSchema: renameType(credential.credentialSchema),
    issuanceDate: credential.issuanceDate,
    expirationDate: credential.expirationDate
  };
}

export class EIP712VC {
  private eip712Config: EIP712Config;

  public constructor(eip712Config: EIP712Config) {
    this.eip712Config = eip712Config;
  }

  public getDomainSeparator() {
    return keccak256(
      defaultAbiCoder.encode(
        ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
        [
          keccak256(toUtf8Bytes(DOMAIN_ENCODING)),
          keccak256(toUtf8Bytes(this.eip712Config.name)),
          keccak256(toUtf8Bytes(this.eip712Config.version)),
          this.eip712Config.chainId,
          this.eip712Config.verifyingContract
        ]
      )
    );
  }

  public getDomainTypedData(): EIP712DomainTypedData {
    return {
      name: this.eip712Config.name,
      version: this.eip712Config.version,
      chainId: this.eip712Config.chainId,
      verifyingContract: this.eip712Config.verifyingContract
    };
  }

  public async createW3CVerifiableCredential(
    credential: W3CCredential,
    credentialSubjectTypes: any,
    signTypedData: SignTypedData<EIP712MessageTypes>
  ): Promise<VerifiableCredential> {
    const credentialTypedData = this.getW3CCredentialTypedData(
      credential,
      credentialSubjectTypes
    );

    let signature = await signTypedData(credentialTypedData);

    let proof: Proof = {
      verificationMethod:
        credentialTypedData.message.issuer.id + '#ethereumAddress',
      ethereumAddress: credentialTypedData.message.issuer.ethereumAddress,
      created: new Date(Date.now()).toISOString(),
      proofPurpose: 'assertionMethod',
      type: 'EthereumEip712Signature2021',
      ...credentialTypedData.message.proof,
      proofValue: signature,
      eip712: {
        domain: { ...credentialTypedData.domain },
        types: { ...credentialTypedData.types },
        primaryType: credentialTypedData.primaryType
      }
    };

    let verifiableCredential = {
      ...credential,
      proof
    };

    return verifiableCredential;
  }

  public getW3CCredentialTypedData(
    credential: W3CCredential,
    credentialSubjectTypes: any
  ): W3CCredentialTypedData {
    return {
      domain: this.getDomainTypedData(),
      primaryType: VERIFIABLE_CREDENTIAL_PRIMARY_TYPE,
      message: credential,
      types: {
        EIP712Domain: DOMAIN_TYPE,
        VerifiableCredential: VERIFIABLE_CREDENTIAL_W3C_TYPE,
        CredentialSchema: CREDENTIAL_SCHEMA_W3C_TYPE,
        ...credentialSubjectTypes
      }
    };
  }

  public async verifyW3CCredential(
    issuer: string,
    credential: W3CCredential,
    credentialSubjectTypes: any,
    proofValue: string,
    verifyTypedData: VerifyTypedData<EIP712MessageTypes>
  ): Promise<boolean> {
    let data: W3CCredentialTypedData = this.getW3CCredentialTypedData(
      credential,
      credentialSubjectTypes
    );
    const recoveredAddress = await verifyTypedData(data, proofValue);

    return getAddress(issuer) === getAddress(recoveredAddress);
  }

  /**
   * Creates a VerifiableCredential given a `EIP712CredentialTypedData`
   *
   * This method transforms the payload into the [EIP712 Typed Data](https://eips.ethereum.org/EIPS/eip-712)
   * described in the [W3C EIP712 VC spec](https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec) and then validated to conform to the minimum spec
   * required W3C spec.
   *
   * @param signTypedData `Issuer` the DID, signer and algorithm that will sign the token
   * @param credentialTypedData `EIP712CredentialTypedData`
   * @return a `Promise` that resolves to the verifiable credential or rejects with `TypeError` if the
   * `payload` is not W3C compliant
   */
  public async createEIP712VerifiableCredential(
    credential: EIP712Credential,
    credentialSubjectTypes: any,
    signTypedData: SignTypedData<EIP712MessageTypes>
  ): Promise<EIP712VerifiableCredential> {
    const credentialTypedData = this.getEIP712CredentialTypedData(
      credential,
      credentialSubjectTypes
    );

    let signature = await signTypedData(credentialTypedData);

    let proof: Proof = {
      verificationMethod:
        credentialTypedData.message.issuer.id + '#ethereumAddress',
      ethereumAddress: credentialTypedData.message.issuer.ethereumAddress,
      created: new Date(Date.now()).toISOString(),
      proofPurpose: 'assertionMethod',
      type: 'EthereumEip712Signature2021',
      ...credentialTypedData.message.proof,
      proofValue: signature,
      eip712: {
        domain: { ...credentialTypedData.domain },
        types: { ...credentialTypedData.types },
        primaryType: credentialTypedData.primaryType
      }
    };

    let verifiableCredential = {
      ...credential,
      proof
    };

    return verifiableCredential;
  }

  public getEIP712CredentialTypes(
    credentialSubjectTypes: any
  ): EIP712CredentialTypedData {
    return {
      VerifiableCredential: VERIFIABLE_CREDENTIAL_EIP712_TYPE,
      CredentialSchema: CREDENTIAL_SCHEMA_EIP712_TYPE,
      ...credentialSubjectTypes
    };
  }

  public getEIP712CredentialTypedData(
    credential: EIP712Credential,
    credentialSubjectTypes: any
  ): EIP712CredentialTypedData {
    return {
      domain: this.getDomainTypedData(),
      primaryType: VERIFIABLE_CREDENTIAL_PRIMARY_TYPE,
      message: credential,
      types: {
        EIP712Domain: DOMAIN_TYPE,
        VerifiableCredential: VERIFIABLE_CREDENTIAL_EIP712_TYPE,
        CredentialSchema: CREDENTIAL_SCHEMA_EIP712_TYPE,
        ...credentialSubjectTypes
      }
    };
  }

  public async verifyEIP712Credential(
    issuer: string,
    credential: EIP712Credential,
    credentialSubjectTypes: any,
    proofValue: string,
    verifyTypedData: VerifyTypedData<EIP712MessageTypes>
  ): Promise<boolean> {
    let data: EIP712CredentialTypedData = this.getEIP712CredentialTypedData(
      credential,
      credentialSubjectTypes
    );
    const recoveredAddress = await verifyTypedData(data, proofValue);

    return getAddress(issuer) === getAddress(recoveredAddress);
  }
}
