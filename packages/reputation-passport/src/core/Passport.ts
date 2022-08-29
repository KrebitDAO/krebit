import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDDataStore } from '@glazed/did-datastore';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DIDSession } from 'did-session';
import { W3CCredential } from '@krebitdao/eip712-vc';
import localStore from 'store2';

import { ceramic, graph } from '../lib';
import { config, IConfigProps } from '../config';

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
    this.address = props?.address;
    this.ethProvider = props?.ethProvider;
  }

  async connect() {
    this.idx = await ceramic.authDIDSession({
      client: this.ceramic,
      address: this.address,
      ethProvider: this.ethProvider
    });
    this.did = this.idx.id;

    return this.did;
  }

  isConnected = async () => {
    const currentSession = localStore.get('krebit.reputation-passport.session');

    if (!currentSession) return false;

    const session = await DIDSession.fromSession(currentSession);

    if (session.hasSession && session.isExpired) return false;

    this.idx = await ceramic.authDIDSession({ client: this.ceramic, session });
    this.did = this.idx.id;

    return this.idx.authenticated;
  };

  getReputation = async () => {
    //from subgraph
    const balance = await graph.erc20BalanceQuery(this.address);

    return balance ? balance.value : 0;
  };

  read(address: string, did: string) {
    this.did = did;
    this.address = address;
    // TODO get did from address with resolver

    const ceramicClient = new CeramicClient(this.currentConfig.ceramicUrl);
    this.idx = ceramic.publicIDX({
      client: ceramicClient
    });
    this.ceramic = ceramicClient;
  }

  // basiProfile from ceramic
  getProfile = async () => {
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

    console.log('Saving VerifiableCredentialn on Ceramic...');

    const stream = await TileDocument.create(this.idx.ceramic, w3cCredential, {
      schema: this.idx.model.getSchemaURL('VerifiableCredential'),
      family: 'krebit',
      controllers: [this.idx.id],
      tags: w3cCredential.type
    });
    return stream.id.toUrl();
  };

  // claimedCredentials from ceramic
  getVerifiableCredential = async (credentialId: any) => {
    const stream = await TileDocument.load(this.idx.ceramic, credentialId);
    return stream.content as W3CCredential;
  };

  // claimedCredentials from ceramic
  checkCredentialStatus = async (credentialId: any) => {
    console.log('Checking VerifiableCredentialn from Ceramic...');
    const w3cCredential: W3CCredential = await this.getVerifiableCredential(
      credentialId
    );
    let result = null;

    const issuedList = await this.idx.get(
      'issuedCredentials',
      w3cCredential.issuer.id
    );
    if (issuedList && issuedList.issued) {
      const issued = issuedList.issued ? issuedList.issued : [];

      if (!issued.includes(credentialId)) {
        result = 'Issued';
      }
    }

    const revokedList = await this.idx.get(
      'revokedCredentials',
      w3cCredential.issuer.id
    );
    if (revokedList && revokedList.issued) {
      const revoked = revokedList.revoked ? revokedList.revoked : [];

      if (!revoked.includes(credentialId)) {
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
    console.log('Saving VerifiableCredentialn on Ceramic...');

    const stream = await TileDocument.load(this.idx.ceramic, credentialId);

    return await stream.update({
      schema: this.idx.model.getSchemaURL('VerifiableCredential'),
      family: 'krebit',
      controllers: [this.idx.id],
      tags: w3cCredential.type
    });
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
          console.log('current:', current);
          if (!current.includes(vcId)) {
            current.push(vcId);
            console.log('current push:', current);
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
  revokeCredential = async (verificationId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    // Upload attestation to Ceramic
    try {
      await this.removeIssued(verificationId);
      let result = null;

      if (verificationId) {
        const content = await this.idx.get('revokedCredentials');

        if (content && content.revoked) {
          const current = content.revoked ? content.revoked : [];
          console.log('current:', current);
          if (!current.includes(verificationId)) {
            current.push(verificationId);
            console.log('current push:', current);
            result = await this.idx.merge('revokedCredentials', {
              revoked: current
            });
          }
        } else {
          result = await this.idx.set('revokedCredentials', {
            revoked: [verificationId]
          });
        }
      }

      if (result) {
        return verificationId;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  //remove from issuedCredentials in ceramic
  removeIssued = async (verificationId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    try {
      let result = null;
      const content = await this.idx.get('issuedCredentials');

      if (content && content.issued) {
        const current = content.issued ? content.issued : [];

        if (current.includes(verificationId)) {
          current.splice(current.indexOf(verificationId), 2);
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
                  return vcStream.content;
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
  removeClaim = async (verificationId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    try {
      let result = null;
      const content = await this.idx.get('claimedCredentials');

      if (content && content.claimed) {
        const current = content.claimed ? content.claimed : [];

        if (current.includes(verificationId)) {
          current.splice(current.indexOf(verificationId), 2);
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
                  return vcStream.content;
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
  removeCredential = async (verificationId: string) => {
    if (!this.isConnected()) throw new Error('Not connected');

    try {
      let result = null;
      const content = await this.idx.get('heldCredentials');

      if (content && content.held) {
        const current = content.held ? content.held : [];

        if (current.includes(verificationId)) {
          current.splice(current.indexOf(verificationId), 2);
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
  getCredentials = async (type?: string) => {
    try {
      let result = [];
      const content = await this.idx.get('heldCredentials', this.did);

      if (content && content.held) {
        const current = content.held ? content.held : [];

        result = await Promise.all(
          await current.map(async vcId => {
            let vcStream = await this.ceramic.loadStream(vcId);

            if (vcStream) {
              if (type) {
                if (vcStream.content.type.includes(type))
                  return vcStream.content;
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

  // registeredCredentials from subgraph
  getStamps = async (props: StampsProps) => {
    const { first, type, claimId } = props;
    const where = {
      credentialSubjectDID: this.did,
      credentialSubjectAddress: this.address
    };

    if (type) where['_type_contains_nocase'] = type;
    if (claimId) where['claimId'] = claimId;

    //Get verifications from subgraph
    return await graph.verifiableCredentialsQuery({
      first: first ? first : 10,
      orderBy: 'issuanceDate',
      orderDirection: 'desc',
      where
    });
  };
}
