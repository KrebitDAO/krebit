// TODO: Validate if address deserves the badge

import express from 'express';
import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import krebit from '@krebitdao/reputation-passport';

import { connect, generateUID } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL
} = process.env;

export const QuestappController = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!request?.body) {
      throw new Error('Body not defined');
    }

    if (!request?.body?.claimedCredentialId) {
      throw new Error(`No claimedCredentialId in body`);
    }

    const { claimedCredentialId } = request.body;
    const { wallet, ethProvider } = await connect();

    // Log in with wallet to Ceramic DID
    console.log('Connecting to DID...');

    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider,
      address: wallet.address,
      ceramicUrl: SERVER_CERAMIC_URL,
      litSdk: LitJsSdk
    });
    const did = await Issuer.connect();
    console.log('DID:', did);

    const delegateCredential = await Issuer.getCredential(claimedCredentialId);

    console.log(
      'checkCredential: ',
      await Issuer.checkCredential(delegateCredential)
    );

    console.log(
      'Issuing badge credential on behalf of parent credential: ',
      delegateCredential
    );
    //Save the delegation credential to our passport
    const passport = new krebit.core.Passport({
      ethProvider: ethProvider,
      address: wallet.address,
      ceramicUrl: process.env.NEXT_PUBLIC_CERAMIC_URL
    });
    await passport.connect();
    const delegateCredentialUrl = await passport.addCredential(
      delegateCredential
    );
    console.log('delegateCredentialUrl: ', delegateCredentialUrl);

    const delegateCredentialValue = JSON.parse(
      delegateCredential.credentialSubject.value
    );
    console.log('delegateCredentialValue: ', delegateCredentialValue);

    const badgeValue = {
      entity: 'Krebit DAO',
      name: 'Community member of the month',
      imageUrl: 'ipfs://asdf',
      description: 'Badge for users that meet some awesome criteria',
      skills: [{ skillId: 'participation', score: 100 }],
      xp: '1',
      onBehalveOfIssuer: delegateCredential.issuer.id,
      parentCredential: delegateCredentialUrl
    };

    const expirationDate = new Date();
    const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    const claim = {
      id: `quest-${generateUID(10)}`,
      ethereumAddress: '0xd6eeF6A4ceB9270776d6b388cFaBA62f5Bc3357f',
      //did: `did:pkh:eip155:1:0xd6eeF6A4ceB9270776d6b388cFaBA62f5Bc3357f`,
      type: delegateCredentialValue.credentialType,
      value: badgeValue,
      tags: ['quest', 'krebit', 'Community'],
      typeSchema: delegateCredentialValue.credentialSchema,
      expirationDate: new Date(expirationDate).toISOString()
    };
    console.log('claim: ', claim);

    // Issue Verifiable credential (needs signer)
    const issuedCredential = await Issuer.issue(claim);

    if (issuedCredential) {
      return response.json(issuedCredential);
    }
  } catch (err) {
    next(err);
  }
};
