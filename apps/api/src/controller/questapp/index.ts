// TODO: Validate if address deserves the badge

import express from 'express';
import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import krebit from '@krebitdao/reputation-passport';

import { connect, generateUID } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE
} = process.env;

export const QuestappController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    if (!request?.body) {
      throw new Error('Body not defined');
    }

    if (!request?.body?.address) {
      throw new Error(`No address in body`);
    }

    if (!request?.body?.communityId) {
      throw new Error(`No communityId in body`);
    }

    const { address, communityId } = request.body;
    const { wallet, ethProvider } = await connect();

    console.log('Verifying questapp for address: ', address);
    console.log('Valid quest found in community: ', communityId);

    // Log in with wallet to Ceramic DID
    console.log('Connecting to DID...');

    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider,
      address: wallet.address,
      litSdk: LitJsSdk
    });
    const did = await Issuer.connect();
    console.log('DID:', did);

    /*
    const badgeSchema = krebit.schemas.claims.badge;
    console.log(
      'add type:',
      await Issuer.setTypeSchema('questBadge', badgeSchema)
    );

    console.log('typeSchemas:', await Issuer.getTypeSchema());
    console.log('questBadgeSchema:', await Issuer.getTypeSchema('questBadge'));

    console.log('DID authenticated:', await Issuer.isConnected());

*/

    const badgeValue = {
      communityId,
      name: 'Community Badge Name',
      imageIpfs: 'ipfs://asdf',
      description: 'Badge for users that meet some criteria',
      skills: [{ skillId: 'participation', score: 100 }],
      xp: '1'
    };

    const expirationDate = new Date();
    const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    const claim = {
      id: `quest-${generateUID(10)}`,
      ethereumAddress: wallet.address,
      did: `did:pkh:eip155:1:${wallet.address}`,
      type: 'questBadge',
      value: badgeValue,
      tags: ['quest', 'badge', 'community'],
      typeSchema: 'https://github.com/KrebitDAO/schemas/questBadge',
      trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
      stake: parseInt(SERVER_STAKE, 10), // In KRB
      price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
      expirationDate: new Date(expirationDate).toISOString(),
      encrypt: 'lit' as 'lit'
    };
    console.log('claim: ', claim);

    // Issue Verifiable credential (needs signer)
    const issuedCredential = await Issuer.issue(claim);

    console.log(
      'Verifying signature:',
      await Issuer.checkCredential(issuedCredential)
    );

    const decrypted = await Issuer.decryptClaim(issuedCredential);

    console.log('Decrypted:', decrypted);

    /*
    //Optional: saveIssued
    const passport = new core.Passport();
    await passport.connect(ethProvider, wallet.address);
    const addedCredentialId = await passport.addVerifiableCredential(
      issuedCredential
    );
    
    //const issuedCredentials = await passport.getIssued();
    //console.log('issuedCredentials:', issuedCredentials);
    /*const result = await passport.removeIssued(
      'ceramic://kjzl6cwe1jw14af60zi1kmyyg5togxsggje7rvs2hdk9cckl49dzr76y36n3j9z'
    );
    console.log('Removed previous:', result);
*/
    if (true) {
      return response.json({
        //issuedCredential,
        decrypted
        //addedCredentialId
        //issuedCredentialId
        //result
      });
    }
  } catch (err) {
    console.log('err:', err);
    throw new Error(err);
  }
};
