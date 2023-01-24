import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDDataStore } from '@glazed/did-datastore';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DIDSession } from 'did-session';
import { W3CCredential } from '@krebitdao/eip712-vc';
import localStore from 'store2';

import { lib } from '../lib/index.js';
import { utils } from '../utils/index.js';
import { config, IConfigProps } from '../config/index.js';

interface IProps extends IConfigProps {
  ethProvider?: ethers.providers.Provider | ethers.providers.ExternalProvider;
  address?: string;
}

interface StampsProps {
  first?: number;
  type?: string;
  claimId?: string;
}

export class Passport {
  public ceramic: CeramicClient;
  public idx: DIDDataStore;
  public did: string;
  public ens: string;
  public uns: string;
  public address: string;
  public ethProvider:
    | ethers.providers.Provider
    | ethers.providers.ExternalProvider;
  private currentConfig: IConfigProps;

  constructor(props?: IProps) {
    const currentConfig = config.update(props);
    this.currentConfig = currentConfig;
    const ceramicClient = new CeramicClient(this.currentConfig.ceramicUrl);
    this.ceramic = ceramicClient;
    this.address = props?.address?.toLocaleLowerCase();
    this.ethProvider = props?.ethProvider;
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

    this.did = this.idx.id.toLocaleLowerCase();
    this.ens = await lib.ens.lookupAddress(this.address);
    this.uns = await lib.uns.lookupAddress(this.address);
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
    this.did = this.idx.id.toLocaleLowerCase();

    return this.idx.authenticated;
  };

  getReputation = async () => {
    //from subgraph
    if (!this.address) return;

    const balance = await lib.graph.erc20BalanceQuery(this.address);

    return balance ? balance.value : 0;
  };

  read = async (value: string) => {
    if (value.startsWith('0x')) {
      this.address = value.toLocaleLowerCase();
      let defaultDID = await lib.orbis.getDefaultDID(this.address);
      this.did = defaultDID ? defaultDID : `did:pkh:eip155:1:${value}`;

      this.ens = await lib.ens.lookupAddress(this.address);
      this.uns = await lib.uns.lookupAddress(this.address);
    } else if (value.startsWith('did:pkh:eip155:')) {
      this.did = value.toLocaleLowerCase();
      this.address = (value as string).match(utils.regexValidations.address)[0];
      this.ens = await lib.ens.lookupAddress(this.address);
      this.uns = await lib.uns.lookupAddress(this.address);
    } else if (value.endsWith('.eth')) {
      const ensInfo = await this.readEns(value);

      this.address = ensInfo?.address.toLocaleLowerCase();
      let defaultDID = await lib.orbis.getDefaultDID(this.address);
      this.did = defaultDID ? defaultDID : `did:pkh:eip155:1:${this.address}`;
      this.ens = ensInfo?.ens;
      this.uns = await lib.uns.lookupAddress(this.address);
    } else {
      const unsInfo = await this.readUns(value);

      this.address = unsInfo?.address.toLocaleLowerCase();
      let defaultDID = await lib.orbis.getDefaultDID(this.address);
      this.did = defaultDID ? defaultDID : `did:pkh:eip155:1:${this.address}`;
      this.uns = unsInfo?.uns;
      this.ens = await lib.ens.lookupAddress(this.address);
    }

    if (!this.did || !this.address) {
      throw new Error('Invalid did or address');
    }

    const ceramicClient = new CeramicClient(this.currentConfig.ceramicUrl);
    this.idx = lib.ceramic.publicIDX({
      client: ceramicClient
    });
    this.ceramic = ceramicClient;
  };

  readEns = async (name: string) => {
    const address = await lib.ens.resolveName(name);

    if (address) {
      return {
        ens: name,
        address
      };
    } else {
      throw new Error('No resolved address for that ENS domain');
    }
  };

  readUns = async (name: string) => {
    const address = await lib.uns.resolveName(name);

    if (address) {
      return {
        uns: name,
        address
      };
    } else {
      throw new Error('No resolved address for that ENS domain');
    }
  };

  // basiProfile from ceramic
  getProfile = async () => {
    if (!this.idx) throw new Error('Not connected');
    try {
      const content = await this.idx.get('basicProfile', this.did);
      if (content) {
        return content;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // basiProfile from ceramic
  updateProfile = async (profile: any) => {
    if (!this.idx) throw new Error('Not connected');
    try {
      const content = await this.idx.set('basicProfile', profile);
      if (content) {
        return content;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // claimedCredentials from ceramic
  addVerifiableCredential = async (w3cCredential: W3CCredential) => {
    if (!this.isConnected()) throw new Error('Not connected');

    console.log('Saving VerifiableCredential on Ceramic...');

    const stream = await TileDocument.create(this.idx.ceramic, w3cCredential, {
      schema: this.idx.model.getSchemaURL('VerifiableCredential'),
      family: 'krebit',
      controllers: [this.idx.id],
      tags: w3cCredential.type
    });
    return stream.id.toUrl();
  };

  // get credential from ceramic
  getCredential = async (vcId: string) => {
    if (!this.idx) throw new Error('Not connected');
    if (!vcId.startsWith('ceramic://')) return null;
    const stream = await TileDocument.load(this.idx.ceramic, vcId);
    return stream.content as W3CCredential;
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

  // claimedCredentials from ceramic
  checkCredentialStatus = async (vcId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');
    console.log('Checking VerifiableCredential from Ceramic...');
    const w3cCredential: W3CCredential = await this.getCredential(vcId);
    let result = null;

    const issuedList = await this.idx.get(
      'issuedCredentials',
      w3cCredential.issuer.id
    );
    if (issuedList && issuedList.issued) {
      const issued = issuedList.issued ? issuedList.issued : [];

      if (!issued.includes(vcId)) {
        result = 'Issued';
      }
    }

    const revokedList = await this.idx.get(
      'revokedCredentials',
      w3cCredential.issuer.id
    );
    if (revokedList && revokedList.issued) {
      const revoked = revokedList.revoked ? revokedList.revoked : [];

      if (!revoked.includes(vcId)) {
        result = 'Revoked';
      }
    }

    const now = new Date();
    if (w3cCredential.expirationDate >= now.toISOString()) {
      result = 'Expired';
    }

    return result;
  };

  // claimedCredentials from ceramic
  updateVerifiableCredential = async (
    credentialId: string,
    w3cCredential: W3CCredential
  ) => {
    if (!this.isConnected()) throw new Error('Not connected');
    console.debug('Updating VerifiableCredential on Ceramic...', w3cCredential);

    const stream = await TileDocument.load(this.idx.ceramic, credentialId);

    return await stream.update(w3cCredential);
  };

  // issuedCredentials in ceramic
  addIssued = async (w3cCredential: W3CCredential) => {
    if (!this.isConnected()) throw new Error('Not connected');

    if (
      w3cCredential.issuer.ethereumAddress.toLowerCase() !=
      this.address.toLowerCase()
    )
      throw new Error('Not by this address');
    if (w3cCredential.issuer.id.toLowerCase() != this.did.toLowerCase())
      throw new Error('Not by this did');

    // Upload attestation to Ceramic
    try {
      const vcId = await this.addVerifiableCredential(w3cCredential);
      let result = null;

      if (vcId) {
        const content = await this.idx.get('issuedCredentials');

        if (content && content.issued) {
          const current = content.issued ? content.issued : [];
          if (!current.includes(vcId)) {
            current.push(vcId);
            result = await this.idx.merge('issuedCredentials', {
              issued: current
            });
          }
        } else {
          result = await this.idx.set('issuedCredentials', {
            issued: [vcId]
          });
        }
      }

      if (result) {
        return vcId;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // issuedCredentials in ceramic
  revokeCredential = async (vcId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    // Upload attestation to Ceramic
    try {
      await this.removeIssued(vcId);
      let result = null;

      if (vcId) {
        const content = await this.idx.get('revokedCredentials');

        if (content && content.revoked) {
          const current = content.revoked ? content.revoked : [];
          console.log('current:', current);
          if (!current.includes(vcId)) {
            current.push(vcId);
            console.log('current push:', current);
            result = await this.idx.merge('revokedCredentials', {
              revoked: current
            });
          }
        } else {
          result = await this.idx.set('revokedCredentials', {
            revoked: [vcId]
          });
        }
      }

      if (result) {
        return vcId;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  //remove from issuedCredentials in ceramic
  removeIssued = async (vcId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    try {
      const credential: W3CCredential = await this.getCredential(vcId);
      credential.credentialSubject.value = '{"removed":true}';
      await this.updateVerifiableCredential(vcId, credential);

      let result = null;
      const content: W3CCredential = await this.idx.get('issuedCredentials');
      if (content && content.issued) {
        const current = content.issued ? content.issued : [];

        if (current.includes(vcId)) {
          current.splice(current.indexOf(vcId), 1);
          result = await this.idx.merge('issuedCredentials', {
            issued: current
          });
        }
      }

      if (result) {
        return result;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // issuedCredentials from ceramic
  getIssued = async (type?: string) => {
    if (!this.idx) throw new Error('Not connected');
    try {
      let result = [];
      const content = await this.idx.get('issuedCredentials', this.did);

      if (content && content.issued) {
        const current = content.issued ? content.issued : [];

        result = await Promise.all(
          await current.map(async vcId => {
            let vcStream = await this.ceramic.loadStream(vcId);

            if (vcStream) {
              if (type) {
                if (vcStream.content.type.includes(type))
                  return {
                    ...vcStream.content,
                    vcId: vcId
                  };
              } else {
                return { ...vcStream.content, vcId: vcId };
              }
            }
          })
        );
      }
      return result.filter(c => c != null);
    } catch (err) {
      throw new Error(err);
    }
  };

  // claimedCredentials from ceramic
  addClaim = async (w3cCredential: W3CCredential) => {
    if (!this.isConnected()) throw new Error('Not connected');

    if (
      w3cCredential.credentialSubject.ethereumAddress.toLowerCase() !=
      this.address.toLowerCase()
    )
      throw new Error('Not for this address');
    if (
      w3cCredential.credentialSubject.id.toLowerCase() != this.did.toLowerCase()
    )
      throw new Error('Not for this did');

    // Upload attestation to Ceramic
    try {
      let result = null;
      const vcId = await this.addVerifiableCredential(w3cCredential);

      if (vcId) {
        const content = await this.idx.get('claimedCredentials');

        if (content && content.claimed) {
          const current = content.claimed ? content.claimed : [];

          if (!current.includes(vcId)) {
            current.push(vcId);

            result = await this.idx.merge('claimedCredentials', {
              claimed: current
            });
          }
        } else {
          result = await this.idx.set('claimedCredentials', {
            claimed: [vcId]
          });
        }
      }

      if (result) {
        return vcId;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // claimedCredentials from ceramic
  removeClaim = async (vcId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    try {
      const credential: W3CCredential = await this.getCredential(vcId);
      credential.credentialSubject.value = '{"removed":true}';
      await this.updateVerifiableCredential(vcId, credential);
      let result = null;
      const content = await this.idx.get('claimedCredentials');

      if (content && content.claimed) {
        const current = content.claimed ? content.claimed : [];

        if (current.includes(vcId)) {
          current.splice(current.indexOf(vcId), 1);
          result = await this.idx.merge('claimedCredentials', {
            claimed: current
          });
        }
      }
      if (result) {
        return result;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // claimedCredentials from ceramic, filter by type
  getClaims = async (type?: string) => {
    if (!this.idx) throw new Error('Not connected');
    try {
      let result = [];
      const content = await this.idx.get('claimedCredentials', this.did);

      if (content && content.claimed) {
        const current = content.claimed ? content.claimed : [];

        result = await Promise.all(
          await current.map(async vcId => {
            let vcStream = await this.ceramic.loadStream(vcId);

            if (vcStream) {
              if (type) {
                if (vcStream.content.type.includes(type))
                  return {
                    ...vcStream.content,
                    vcId: vcId
                  };
              } else {
                return vcStream.content;
              }
            }
          })
        );
      }
      return result.filter(c => c != null);
    } catch (err) {
      throw new Error(err);
    }
  };

  // heldCredentials in ceramic
  addCredential = async (w3cCredential: W3CCredential) => {
    if (!this.isConnected()) throw new Error('Not connected');

    if (
      w3cCredential.credentialSubject.ethereumAddress.toLowerCase() !=
      this.address.toLowerCase()
    )
      throw new Error('Not for this address');
    if (
      w3cCredential.credentialSubject.id.toLowerCase() != this.did.toLowerCase()
    )
      throw new Error('Not for this did');

    // Upload attestation to Ceramic
    try {
      const vcId = await this.addVerifiableCredential(w3cCredential);
      let result = null;

      if (vcId) {
        const content = await this.idx.get('heldCredentials');

        if (content && content.held) {
          const current = content.held ? content.held : [];

          if (!current.includes(vcId)) {
            current.push(vcId);

            result = await this.idx.merge('heldCredentials', {
              held: current
            });
          }
        } else {
          result = await this.idx.set('heldCredentials', {
            held: [vcId]
          });
        }
      }

      if (result) {
        return vcId;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // heldCredentials in ceramic
  removeCredential = async (vcId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    try {
      const credential: W3CCredential = await this.getCredential(vcId);
      if (credential.id.startsWith('ceramic://')) {
        await this.removeClaim(credential.id);
      }

      let result = null;
      const content = await this.idx.get('heldCredentials');

      if (content && content.held) {
        const current = content.held ? content.held : [];

        if (current.includes(vcId)) {
          current.splice(current.indexOf(vcId), 1);
          result = await this.idx.merge('heldCredentials', {
            held: current
          });
        }
      }

      if (result) {
        return result;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // heldCredentials from ceramic, filter by type
  getCredentials = async (type?: string, tag?: string) => {
    if (!this.idx) throw new Error('Not connected');
    try {
      let result = [];
      const content = await this.idx.get('heldCredentials', this.did);

      if (content && content.held) {
        const current = content.held ? content.held : [];

        result = await Promise.all(
          current.map(async vcId => {
            let vcStream = await this.ceramic.loadStream(vcId);

            if (vcStream) {
              if (type) {
                if (vcStream.content.credentialSubject.type === type)
                  return {
                    ...vcStream.content,
                    vcId: vcId
                  };
              } else if (tag) {
                if (vcStream.content.type.includes(tag))
                  return {
                    ...vcStream.content,
                    vcId: vcId
                  };
              } else {
                return { ...vcStream.content, vcId: vcId };
              }
            }
          })
        );
      }
      return result.filter(c => c != null);
    } catch (err) {
      throw new Error(err);
    }
  };

  getSkills = async () => {
    const credentials = await this.getCredentials();
    return credentials.flatMap(credential => credential.type);
  };

  // registeredCredentials from subgraph
  getStamps = async (props: StampsProps) => {
    const { first, type, claimId } = props;
    const where = {
      credentialSubjectDID: this.did.toLowerCase(),
      credentialSubjectAddress: this.address.toLowerCase()
    };

    if (type) where['_type_contains_nocase'] = type;
    if (claimId) where['claimId'] = claimId;

    //Get verifications from subgraph
    return await lib.graph.verifiableCredentialsQuery({
      first: first ? first : 10,
      orderBy: 'issuanceDate',
      orderDirection: 'desc',
      where
    });
  };

  // write to my ceramic
  createDocument = async (
    content: any,
    tags: string[],
    schema: string,
    family: string = 'krebit'
  ) => {
    if (!this.isConnected()) throw new Error('Not connected');

    console.log('Saving document on Ceramic...');

    try {
      const stream = await TileDocument.create(this.idx.ceramic, {
        family,
        controllers: [this.idx.id],
        tags,
        schema
      });
      return stream.id.toString();
    } catch (err) {
      throw new Error(err);
    }
  };
}
