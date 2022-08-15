import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDDataStore } from '@glazed/did-datastore';
import {
  W3CCredential,
  EIP712VerifiableCredential,
  getEIP712Credential,
  getKrebitCredentialTypes
} from '@krebitdao/eip712-vc';

import { ceramic, graph, Lit } from '../lib';
import { issueCredential } from '../utils';
import { krbToken } from '../schemas';
import { config, IConfigProps } from '../config';

const getEIP712credential = (stamp: any) =>
  ({
    ...stamp,
    id: stamp.claimId,
    credentialSubject: {
      ...stamp.credentialSubject,
      id: stamp.credentialSubjectDID
    }
  } as EIP712VerifiableCredential);

export class Krebit {
  public ceramic: CeramicClient;
  public idx: DIDDataStore;
  public address: string;
  public did: string;
  public krbContract: any;
  public wallet: ethers.Signer;
  public ethProvider:
    | ethers.providers.Provider
    | ethers.providers.ExternalProvider;
  private currentConfig: IConfigProps;

  constructor(props?: IConfigProps) {
    const currentConfig = config.update(props);
    this.currentConfig = currentConfig;
  }

  async connect(
    wallet: ethers.Signer,
    ethProvider: ethers.providers.Provider | ethers.providers.ExternalProvider,
    address: string
  ) {
    const ceramicClient = new CeramicClient(this.currentConfig.ceramicUrl);
    this.idx = await ceramic.authDIDSession({
      address,
      ethProvider,
      client: ceramicClient
    });
    this.address = address;
    this.ethProvider = ethProvider;
    this.ceramic = ceramicClient;
    this.did = this.idx.id;
    this.wallet = wallet;
    this.krbContract = new ethers.Contract(
      krbToken[this.currentConfig.network].address,
      krbToken.abi,
      wallet
    );

    return this.did;
  }

  isConnected = async () => {
    return this.idx.authenticated;
  };

  // add to my issuer ceramic
  setTypeSchema = async (type: string, schema: any) => {
    if (!this.isConnected()) throw new Error('Not connected');

    // Upload attestation to Ceramic
    try {
      let content = await this.idx.get('claimTypes');
      content = content ? content : {};
      content[type] = schema;

      return (await this.idx.set('claimTypes', content)).toUrl();
    } catch (err) {
      throw new Error(err);
    }
  };

  getTypeSchema = async (type?: string) => {
    try {
      const content = await this.idx.get('claimTypes', this.did);

      if (content) {
        if (type) {
          return content[type];
        }

        return content;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // claimedCredentials from ceramic
  checkCredentialSignature = async (w3cCredential: W3CCredential) => {
    const eip712credential = getEIP712Credential(w3cCredential);
    const krebitTypes = getKrebitCredentialTypes();
    const signer = ethers.utils.verifyTypedData(
      w3cCredential.proof.eip712.domain,
      krebitTypes,
      eip712credential,
      w3cCredential.proof.proofValue
    );

    return signer == w3cCredential.issuer.ethereumAddress;
  };

  // checks the signature
  decryptClaim = async (w3cCredential: W3CCredential) => {
    const encrypted = JSON.parse(w3cCredential.credentialSubject.value);
    const lit = new Lit();

    return await lit.decrypt(
      encrypted.encryptedString,
      encrypted.encryptedSymmetricKey,
      encrypted.accessControlConditions,
      this.wallet
    );
  };

  // to get access to private data
  verifyClaim = async (claim, verification: any) => {
    //TODO if you have permission to decrypt the claim, you can compare it's hash to the verifiable credential
    return true;
  };

  // sign
  // returns w3cCredential
  issue = async (claim: any, typeShema: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    // check the types of the claim before issuing
    return issueCredential({
      wallet: this.wallet as ethers.Wallet,
      idx: this.idx,
      claim
    });
  };

  /* TODO
  batchIssue = async (addresses[], dids[], claims[], types[]) => {
    return true;
  };
  */

  // Delegate power to another issuer for a dynamic list of users
  /* TODO
  delegateIssue = async (issuerAddres, issuerDid, addresses[] dids[]) => {
    return true;
  };
  */

  // Stamp
  // on-chain  (claim KRB reputation)
  stampCredential = async (w3cCredential: W3CCredential) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712Credential(w3cCredential);
    const tx = await this.krbContract.registerVC(
      eip712credential,
      w3cCredential.proof.proofValue,
      {
        from: this.address,
        value: w3cCredential.credentialSubject.price.toString()
      }
    );

    return tx.hash;
  };

  stampCost = async (w3cCredential: W3CCredential) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712Credential(w3cCredential);

    // Estimate cost
    const cost = ethers.utils.parseUnits(
      ethers.utils.formatUnits(
        w3cCredential.credentialSubject.price.toString(),
        18
      ),
      'gwei'
    );

    //Estimate fee
    const feeWei = await this.krbContract.estimateGas.registerVC(
      eip712credential,
      w3cCredential.proof.proofValue,
      {
        from: this.address,
        value: w3cCredential.credentialSubject.price.toString()
      }
    );

    return {
      estimatedFee: ethers.utils.formatUnits(feeWei, 'gwei'),
      totalCost: ethers.utils.formatUnits(cost.add(feeWei), 'gwei')
    };
  };

  // registered eip712credentials from subgraph
  // getVerifications = async (type, filter) => {
  getStamps = async (first: number = 100, type: string, claimId: string) => {
    // Get verifications from subgraph
    let where = {};

    if (type) where['_type'] = `["VerifiableCredential","${type}"]`;
    if (claimId) where['claimId'] = claimId;

    //Get verifications from subgraph
    return await graph.verifiableCredentialsQuery({
      first,
      orderBy: 'issuanceDate',
      orderDirection: 'desc',
      where
    });
  };

  //from the contract? or graph? : issued, revoked, expired, suspended, disputed
  //checkStatus = async (verification: any) => {
  checkStamp = async (stamp: any) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712credential(stamp);
    return await this.krbContract.getVCStatus(eip712credential);
  };

  //on-chain
  // stamp = eip712credential
  revokeStamp = async (stamp: any, reason: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712credential(stamp);

    //call krbToken Contract
    const tx = await this.krbContract.revokeVC(eip712credential, reason, {
      value: 0,
      from: eip712credential.issuer.ethereumAddress
    });

    return tx.hash;
  };

  //on-chain
  suspendStamp = async (stamp: any, reason: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712credential(stamp);

    //call krbToken Contract
    const tx = await this.krbContract.suspendVC(eip712credential, reason, {
      value: 0,
      from: eip712credential.issuer.ethereumAddress
    });

    return tx.hash;
  };

  //on-chain
  expireStamp = async (stamp: any) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712credential(stamp);

    //call krbToken Contract
    const tx = await this.krbContract.expiredVC(eip712credential, {
      value: 0,
      from: eip712credential.issuer.ethereumAddress
    });

    return tx.hash;
  };

  //on-chain
  removeStamp = async (stamp: any, reason: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712credential(stamp);

    //call krbToken Contract
    const tx = await this.krbContract.deleteVC(eip712credential, reason, {
      value: 0,
      from: eip712credential.issuer.ethereumAddress
    });

    return tx.hash;
  };
}
