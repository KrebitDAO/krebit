import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDDataStore } from '@glazed/did-datastore';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DIDSession } from 'did-session';
import { Biconomy } from '@biconomy/mexa';
import {
  W3CCredential,
  EIP712VerifiableCredential,
  getEIP712Credential,
  getKrebitCredentialTypes
} from '@krebitdao/eip712-vc';
import localStore from 'store2';

import { ceramic, graph, Lit } from '../lib';
import { issueCredential, ClaimProps } from '../utils';
import { krbToken } from '../schemas';
import { config, IConfigProps } from '../config';

interface IProps extends IConfigProps {
  wallet: ethers.Signer;
  ethProvider: ethers.providers.Provider | ethers.providers.ExternalProvider;
  address: string;
}

interface IssuerProps {
  first?: number;
  type?: string;
}

interface StampsProps {
  first?: number;
  type?: string;
  claimId?: string;
}

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

  constructor(props?: IProps) {
    const currentConfig = config.update(props);
    this.currentConfig = currentConfig;

    const ceramicClient = new CeramicClient(this.currentConfig.ceramicUrl);
    this.address = props.address;
    this.ethProvider = props.ethProvider;
    this.ceramic = ceramicClient;
    this.wallet = props.wallet;
    this.krbContract = new ethers.Contract(
      krbToken[this.currentConfig.network].address,
      krbToken.abi,
      props.wallet
    );
  }

  connect = async (currentSession?: string) => {
    if (currentSession) {
      const session = await DIDSession.fromSession(currentSession);

      this.idx = await ceramic.authDIDSession({
        client: this.ceramic,
        session
      });
    } else {
      this.idx = await ceramic.authDIDSession({
        client: this.ceramic,
        address: this.address,
        ethProvider: this.ethProvider
      });
    }

    this.did = this.idx.id;

    return this.did;
  };

  isConnected = async () => {
    const currentSession = localStore.get('ceramic-session');

    if (!currentSession) return false;

    const session = await DIDSession.fromSession(currentSession);

    if (session.hasSession && session.isExpired) return false;

    this.idx = await ceramic.authDIDSession({ client: this.ceramic, session });
    this.did = this.idx.id;

    return this.idx.authenticated;
  };

  // add to my issuer ceramic
  setTypeSchema = async (type: string, schema: any) => {
    if (!this.isConnected()) throw new Error('Not connected');

    console.log('Saving typeSchema on Ceramic...');

    const stream = await TileDocument.create(this.idx.ceramic, schema, {
      family: 'krebit',
      controllers: [this.idx.id],
      tags: ['typeSchema', type]
    });
    const schemaUrl = stream.id.toUrl();

    try {
      let content = await this.idx.get('claimTypes');
      content = content ? content : {};
      content[type] = schemaUrl;

      await this.idx.set('claimTypes', content);
      return schemaUrl;
    } catch (err) {
      throw new Error(err);
    }
  };

  getTypeSchema = async (type?: string, did?: string) => {
    try {
      const content = await this.idx.get('claimTypes', did ? did : this.did);

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

  checkCredential = (w3cCredential: W3CCredential) => {
    const expired = this.isCredentialExpired(w3cCredential);
    console.debug('expired: ', expired);
    const validSignature = this.validCredentialSignature(w3cCredential);
    console.debug('validSignature: ', validSignature);
    return !expired && validSignature;
  };

  validCredentialSignature = (w3cCredential: W3CCredential) => {
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

  isCredentialExpired = (w3cCredential: W3CCredential) => {
    const now = new Date();
    return now.toISOString() >= w3cCredential.expirationDate;
  };

  // checks the signature
  decryptClaim = async (w3cCredential: W3CCredential) => {
    if (!this.isConnected()) throw new Error('Not connected');
    if (w3cCredential.credentialSubject.encrypted === 'lit') {
      const encrypted = JSON.parse(w3cCredential.credentialSubject.value);
      const lit = new Lit();

      return await lit.decrypt(
        encrypted.encryptedString,
        encrypted.encryptedSymmetricKey,
        encrypted.accessControlConditions,
        this.wallet
      );
    }
  };

  /*
  // Check if the plain claimed value matches the encrypted/hashed credential value
  // to get access to private data
  verifyClaim = async (claim: any, w3cCredential: W3CCredential) => {
    //TODO if you have permission to decrypt the claim, you can compare it's hash to the verifiable credential
    return true;
  };*/

  // get IssuerCredential from subgraph
  getIssuers = async (props: IssuerProps) => {
    const { first, type } = props;
    //Get verifications from subgraph
    let where = {};
    where['credentialStatus'] = 'Issued';
    //where['issuerDID'] = process.env.KREBIT_DID;
    if (type) where['_type'] = `["VerifiableCredential","issuer","${type}"]`;

    //Get verifications from subgraph
    return await graph.verifiableCredentialsQuery({
      first: first ? first : 100,
      orderBy: 'issuanceDate',
      orderDirection: 'desc',
      where: where
    });
  };

  // sign
  // returns w3cCredential
  issue = async (claim: ClaimProps) => {
    if (!this.isConnected()) throw new Error('Not connected');

    // TODO: check the types of the claim before issuing

    return await issueCredential({
      wallet: this.wallet as ethers.Wallet,
      idx: this.idx,
      claim
    });
  };

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

    const balance = await this.wallet.getBalance();
    console.log('balance: ', balance);
    if (balance > ethers.constants.Zero) {
      return await this.stamp(w3cCredential);
    } else {
      // Pass connected wallet provider under walletProvider field
      let biconomy = new Biconomy(
        this.ethProvider as ethers.providers.ExternalProvider,
        {
          apiKey: this.currentConfig.biconomyKey,
          debug: true,
          walletProvider: this.ethProvider,
          strictMode: false
        }
      );

      return await new Promise(resolve =>
        biconomy.onEvent(biconomy.READY, async () => {
          const provider = biconomy.getEthersProvider();

          // Initialize your dapp here like getting user accounts etc
          const metaContract = new ethers.Contract(
            krbToken[this.currentConfig.network].address,
            krbToken.abi,
            biconomy.getSignerByAddress(this.address)
          );

          const eip712credential = getEIP712Credential(w3cCredential);

          let { data } = await metaContract.populateTransaction.registerVC(
            eip712credential,
            w3cCredential.proof.proofValue
          );
          let txParams = {
            data: data,
            to: krbToken[this.currentConfig.network].address,
            from: this.address,
            signatureType: 'EIP712_SIGN'
          };
          const tx = await provider.send('eth_sendTransaction', [txParams]);
          resolve(tx);
        })
      );
    }
  };

  // Stamp
  // on-chain  (claim KRB reputation)
  stamp = async (w3cCredential: W3CCredential) => {
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
  getStamps = async (props: StampsProps) => {
    const { first, type, claimId } = props;
    // Get verifications from subgraph
    let where = {};

    if (type) where['_type'] = `["VerifiableCredential","${type}"]`;
    if (claimId) where['claimId'] = claimId;

    //Get verifications from subgraph
    return await graph.verifiableCredentialsQuery({
      first: first ? first : 100,
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
