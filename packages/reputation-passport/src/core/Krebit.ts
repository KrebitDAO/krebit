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

import { lib } from '../lib/index.js';
import { utils, ClaimProps } from '../utils/index.js';
import { schemas } from '../schemas/index.js';
import { config, IConfigProps } from '../config/index.js';

interface IProps extends IConfigProps {
  wallet: ethers.Signer;
  ethProvider: ethers.providers.Provider | ethers.providers.ExternalProvider;
  address: string;
}

interface IssuerProps {
  first?: number;
  type: string;
}

interface StampsProps {
  first?: number;
  type?: string;
  claimId?: string;
}

interface EncryptedProps {
  encryptedSymmetricKey: string;
  encryptedString?: string;
  accessControlConditions?: any[];
  unifiedAccessControlConditions?: string;
}

const getEIP712CredentialFromStamp = (stamp: any) =>
  ({
    ...stamp,
    id: stamp.claimId,
    credentialSubject: {
      ...stamp.credentialSubject,
      id: stamp.credentialSubjectDID,
      stake: Number(stamp.credentialSubject.stake),
      nbf: Number(stamp.credentialSubject.nbf),
      exp: Number(stamp.credentialSubject.exp)
    }
  } as EIP712VerifiableCredential);

export class Krebit {
  public ceramic: CeramicClient;
  public idx: DIDDataStore;
  public address: string;
  public did: string;
  public krbContract: any;
  public nftContract: any;
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
      schemas.krbToken[this.currentConfig.network].address,
      schemas.krbToken.abi,
      props.wallet
    );
    this.nftContract = new ethers.Contract(
      schemas.krebitNFT[this.currentConfig.network].address,
      schemas.krebitNFT.abi,
      props.wallet
    );
  }

  connect = async (currentSession?: string, defaultChainId?: string) => {
    if (currentSession) {
      const session = await DIDSession.fromSession(currentSession);

      this.idx = await lib.ceramic.authDIDSession({
        client: this.ceramic,
        session
      });
    } else {
      this.idx = await lib.ceramic.authDIDSession({
        client: this.ceramic,
        address: this.address,
        ethProvider: this.ethProvider,
        defaultChainId
      });
    }

    this.did = this.idx.id;

    return this.did;
  };

  isConnected = async () => {
    const currentSession = localStore.get('did-session');

    if (!currentSession) return false;

    const session = await DIDSession.fromSession(currentSession);

    if (session.hasSession && session.isExpired) return false;

    this.idx = await lib.ceramic.authDIDSession({
      client: this.ceramic,
      session
    });
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
    if (!this.idx) throw new Error('Not connected');
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

  // get credential from ceramic
  getCredential = async (vcId: string) => {
    if (!this.idx) throw new Error('Not connected');
    if (!vcId.startsWith('ceramic://')) return null;
    const stream = await TileDocument.load(this.idx.ceramic, vcId);
    return stream.content as W3CCredential;
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

  // get Current Lit Access Control Conditions
  getEncryptedCredentialConditions = async (vcId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');
    console.log(
      'Getting VerifiableCredential unifiedAccessControlConditions from Ceramic...'
    );
    const w3cCredential: W3CCredential = await this.getCredential(vcId);

    if (w3cCredential.credentialSubject.encrypted === 'lit') {
      const encrypted = JSON.parse(w3cCredential.credentialSubject.value);
      const stream = await TileDocument.load(
        this.idx.ceramic,
        encrypted.unifiedAccessControlConditions
      );
      return stream.content as any;
    }
  };

  // add address to Lit Access Control Conditions
  shareEncryptedCredentialWith = async (
    vcId: string,
    newAccessControlConditions: any[]
  ) => {
    if (!this.isConnected()) throw new Error('Not connected');
    console.log(
      'Updating VerifiableCredential unifiedAccessControlConditions on Ceramic...'
    );
    const w3cCredential: W3CCredential = await this.getCredential(vcId);

    if (w3cCredential.credentialSubject.encrypted === 'lit') {
      const encrypted = JSON.parse(w3cCredential.credentialSubject.value);
      const lit = new lib.Lit();
      const stream = await TileDocument.load(
        this.idx.ceramic,
        encrypted.unifiedAccessControlConditions
      );

      const updated = await lit.updateConditions(
        encrypted.encryptedSymmetricKey,
        newAccessControlConditions,
        this.wallet
      );
      if (updated) {
        return await stream.update(newAccessControlConditions);
      }
    }
  };

  // add address to Lit Access Control Conditions
  removeAllEncryptedCredentialShares = async (vcId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');
    console.log(
      'Updating VerifiableCredential unifiedAccessControlConditions on Ceramic...'
    );
    const w3cCredential: W3CCredential = await this.getCredential(vcId);

    if (w3cCredential.credentialSubject.encrypted === 'lit') {
      const encrypted = JSON.parse(w3cCredential.credentialSubject.value);
      const lit = new lib.Lit();
      const stream = await TileDocument.load(
        this.idx.ceramic,
        encrypted.unifiedAccessControlConditions
      );
      const newAccessControlConditions = lit.getOwnsAddressCondition(
        this.address
      );
      const updated = await lit.updateConditions(
        encrypted.encryptedSymmetricKey,
        newAccessControlConditions,
        this.wallet
      );
      if (updated) {
        return await stream.update(newAccessControlConditions);
      }
    }
  };

  decryptCredential = async (w3cCredential: W3CCredential) => {
    console.log('decrypting', w3cCredential);
    if (!this.isConnected()) throw new Error('Not connected');
    if (w3cCredential.credentialSubject.encrypted === 'lit') {
      try {
        const encrypted = JSON.parse(w3cCredential.credentialSubject.value);
        return await this.decryptClaimValue(encrypted);
      } catch (err) {
        console.error(`Could not decrypt: ${err.message}`);
        //throw new Error(`Could not decrypt: ${err.message}`);
      }
    } else if (w3cCredential.credentialSubject.encrypted === 'hash') {
      const claimedCredential: W3CCredential = await this.getCredential(
        w3cCredential.id
      );
      if (claimedCredential) {
        return await this.decryptCredential(claimedCredential);
      } else {
        throw new Error(`Could not retrieve claimed credential value`);
      }
    }
  };

  decryptClaimValue = async (encryptedClaimValue: EncryptedProps) => {
    if (!this.isConnected()) throw new Error('Not connected');
    if (
      encryptedClaimValue.encryptedString &&
      encryptedClaimValue.encryptedSymmetricKey &&
      encryptedClaimValue.unifiedAccessControlConditions
    ) {
      try {
        const lit = new lib.Lit();
        const stream = await TileDocument.load(
          this.idx.ceramic,
          encryptedClaimValue.unifiedAccessControlConditions
        );
        const unifiedAccessControlConditions = stream.content as any;
        const result = await lit.decrypt(
          encryptedClaimValue.encryptedString,
          encryptedClaimValue.encryptedSymmetricKey,
          unifiedAccessControlConditions,
          this.wallet
        );
        if (result) {
          return JSON.parse(result);
        }
      } catch (err) {
        console.error(`Could not decrypt: ${err.message}`);
        //throw new Error(`Could not decrypt: ${err.message}`);
      }
    } else {
    }
  };

  getClaimValue = async (w3cCredential: W3CCredential) => {
    if (w3cCredential.credentialSubject.encrypted === 'hash') {
      const claimedCredential: W3CCredential = await this.getCredential(
        w3cCredential.id
      );
      if (claimedCredential) {
        return await this.getClaimValue(claimedCredential);
      } else {
        throw new Error(`Could not retrieve claimed credential value`);
      }
    } else {
      return JSON.parse(w3cCredential.credentialSubject.value);
    }
  };

  // Check if the plain claimed value matches the hashed credential value
  compareClaimValueHash = (claimValue: any, w3cCredential: W3CCredential) => {
    if (w3cCredential.credentialSubject.encrypted === 'hash') {
      const hash = utils.hashClaimValue({
        did: w3cCredential.issuer.id,
        value: claimValue
      });
      console.debug('claimValueHash: ', hash);
      return w3cCredential.credentialSubject.value === hash;
    }
  };

  // get IssuerCredential from subgraph
  getIssuers = async (props: IssuerProps) => {
    const { first, type } = props;
    //Get verifications from subgraph
    let where = {};
    where['credentialStatus'] = 'Issued';
    where['credentialSubject_'] = { _type: 'Issuer' };
    where['claimId_starts_with'] = 'ceramic://';
    if (type) where['_type_contains_nocase'] = type;

    //Get verifications from subgraph
    return await lib.graph.verifiableCredentialsQuery({
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

    // Check the types of the claim before issuing

    try {
      await utils.validateSchema({ idx: this.idx, claim });
    } catch (err) {
      throw new Error(err);
    }

    return await utils.issueCredential({
      wallet: this.wallet as ethers.Wallet,
      idx: this.idx,
      claim
    });
  };

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
            schemas.krbToken[this.currentConfig.network].address,
            schemas.krbToken.abi,
            biconomy.getSignerByAddress(this.address)
          );

          const eip712credential = getEIP712Credential(w3cCredential);

          let { data } = await metaContract.populateTransaction.registerVC(
            eip712credential,
            w3cCredential.proof.proofValue
          );
          let txParams = {
            data: data,
            to: schemas.krbToken[this.currentConfig.network].address,
            from: this.address,
            signatureType: 'EIP712_SIGN'
          };
          const tx = await provider.send('eth_sendTransaction', [txParams]);
          resolve(tx);
        })
      );
    }
  };

  // Mint
  // on-chain  (claim Krebit NFT)
  mintCredentialNFT = async (w3cCredential: W3CCredential) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const balance = await this.wallet.getBalance();
    console.log('balance: ', balance);
    if (balance > ethers.constants.Zero) {
      return await this.mintNFT(w3cCredential);
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
            schemas.krebitNFT[this.currentConfig.network].address,
            schemas.krebitNFT.abi,
            biconomy.getSignerByAddress(this.address)
          );

          const eip712credential = getEIP712Credential(w3cCredential);

          let { data } =
            await metaContract.populateTransaction.mintWithCredential(
              this.address,
              w3cCredential.credentialSubject.type,
              eip712credential,
              w3cCredential.proof.proofValue,
              0x0
            );
          let txParams = {
            data: data,
            to: schemas.krebitNFT[this.currentConfig.network].address,
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

  // on-chain  (claim Krebit NFT)
  mintNFT = async (w3cCredential: W3CCredential) => {
    if (!this.isConnected()) throw new Error('Not connected');
    console.log('Minting credential: ', w3cCredential);
    const eip712credential = getEIP712Credential(w3cCredential);
    const price = await this.nftContract.price();
    const tx = await this.nftContract.mintWithCredential(
      this.address,
      w3cCredential.credentialSubject.type,
      eip712credential,
      w3cCredential.proof.proofValue,
      0x0,
      {
        from: this.address,
        value: price.toString()
      }
    );
    console.log('mint Tx: ', tx);
    return tx.hash;
  };

  // on-chain  (Krebit NFT credentialMinted)
  isMinted = async (w3cCredential: W3CCredential) => {
    if (!this.isConnected()) throw new Error('Not connected');
    let tokenID = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['string'],
        [w3cCredential.credentialSubject.type]
      )
    );
    return await this.nftContract.credentialMinted(tokenID);
  };

  // on-chain  (Krebit NFT balance)
  nftBalance = async (credentialType: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const balance = await this.nftContract.balanceOfCredential(
      this.address,
      credentialType
    );

    return balance;
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
    if (type) where['_type_contains_nocase'] = type;
    if (claimId) where['claimId'] = claimId;

    //Get verifications from subgraph
    return await lib.graph.verifiableCredentialsQuery({
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

    const eip712credential = getEIP712CredentialFromStamp(stamp);
    return await this.krbContract.getVCStatus(eip712credential);
  };

  //on-chain
  // stamp = eip712credential
  revokeStamp = async (stamp: any, reason: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712CredentialFromStamp(stamp);

    //call krbToken Contract
    const tx = await this.krbContract.revokeVC(eip712credential, reason, {
      value: ethers.constants.Zero.toString(),
      from: this.address
    });

    return tx.hash;
  };

  //on-chain
  suspendStamp = async (stamp: any, reason: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712CredentialFromStamp(stamp);

    //call krbToken Contract
    const tx = await this.krbContract.suspendVC(eip712credential, reason, {
      value: ethers.constants.Zero.toString(),
      from: this.address
    });

    return tx.hash;
  };

  //on-chain
  expireStamp = async (stamp: any) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712CredentialFromStamp(stamp);

    //call krbToken Contract
    const tx = await this.krbContract.expiredVC(eip712credential, {
      value: ethers.constants.Zero.toString(),
      from: this.address
    });

    return tx.hash;
  };

  //on-chain
  removeStamp = async (stamp: any, reason: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    const eip712credential = getEIP712CredentialFromStamp(stamp);

    //call krbToken Contract
    const tx = await this.krbContract.deleteVC(eip712credential, reason, {
      value: ethers.constants.Zero.toString(),
      from: this.address
    });

    return tx.hash;
  };
}
