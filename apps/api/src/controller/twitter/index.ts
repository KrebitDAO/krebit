import express from 'express';
import LitJsSdk from '@lit-protocol/sdk-nodejs';
import krebit from '@krebitdao/reputation-passport';

import { connect, twitter } from '../../utils';

// Twitter Oauth2
import { Client, auth } from 'twitter-api-sdk';

const authClient = new auth.OAuth2User({
  client_id: process.env.SERVER_TWITTER_CLIENT_ID as string,
  client_secret: process.env.SERVER_TWITTER_CLIENT_SECRET as string,
  callback: process.env.SERVER_TWITTER_CALLBACK as string,
  scopes: ['tweet.read', 'users.read']
});

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL,
  SERVER_NETWORK
} = process.env;

export const TwitterController = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!request?.body) {
      throw new Error('Body not defined');
    }

    if (request?.body?.code) {
      const token = await twitter.getTwitterToken(
        request.body.code,
        request.body.address
      );
      return response.json(token);
    }

    if (!request?.body?.claimedCredentialId) {
      throw new Error(`No claimedCredentialId in body`);
    }

    const { claimedCredentialId } = request.body;
    const { wallet, ethProvider } = await connect();

    // Log in with wallet to Ceramic DID
    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider,
      address: wallet.address,
      ceramicUrl: SERVER_CERAMIC_URL,
      litSdk: LitJsSdk
    });
    const did = await Issuer.connect();
    console.log('DID:', did);

    const claimedCredential = await Issuer.getCredential(claimedCredentialId);

    console.log(
      'Verifying twitter with claimedCredential: ',
      claimedCredential
    );

    // Check self-signature
    console.log('checkCredential: ', Issuer.checkCredential(claimedCredential));

    // get the claimValue
    let claimValue = null;
    //Decrypt
    if (claimedCredential.credentialSubject.encrypted === 'lit') {
      claimValue = await Issuer.decryptCredential(claimedCredential);
    } else {
      claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('Claim value: ', claimValue);
    }
    const publicClaim: boolean =
      claimedCredential.credentialSubject.encrypted === 'none';

    // If claim is digitalProperty "twitter"
    if (claimedCredential?.credentialSubject?.type === 'Twitter') {
      // Connect to twitter and get user ID from code
      const twitterUser = await twitter.getTwitterUser({
        client: authClient,
        state: claimValue.proofs.state,
        code_challenge: claimedCredential.credentialSubject.ethereumAddress,
        code: claimValue.proofs.code
      });
      console.log('twitterUser: ', twitterUser);

      // If valid twitterID
      if (
        claimValue.host === 'twitter.com' &&
        twitterUser &&
        twitterUser.username.toLowerCase() === claimValue.username.toLowerCase()
      ) {
        console.log('Valid twitter ID:', twitterUser);

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: {
            ...claimValue,
            ...twitterUser
          },
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        }
        console.log('claim: ', claim);

        // Issue Verifiable credential (twitterUsername)
        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        await twitter.revokeTwitterToken(claimValue.proofs.code);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong twitter ID: ${twitterUser}`);
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'TwitterFollowersGT1K'
    ) {
      // Connect to twitter and get user ID from code
      const twitterUser = await twitter.getTwitterFollowersCount({
        client: authClient,
        state: claimValue.proofs.state,
        code_challenge: claimedCredential.credentialSubject.ethereumAddress,
        code: claimValue.proofs.code
      });
      console.log('twitterFollowersCount: ', twitterUser.followers);

      // If valid follower count
      if (
        claimValue.host === 'twitter.com' &&
        twitterUser &&
        twitterUser.username.toLowerCase() ===
          claimValue.username.toLowerCase() &&
        twitterUser.followers > 1000
      ) {
        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        }
        console.log('claim: ', claim);

        // Issue Verifiable credential (twitterUsername)

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        await twitter.revokeTwitterToken(claimValue.proofs.code);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(
          `Wrong twitter follower count: ${twitterUser.followers}`
        );
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'TwitterFollowersGT10K'
    ) {
      // Connect to twitter and get user ID from code
      const twitterUser = await twitter.getTwitterFollowersCount({
        client: authClient,
        state: claimValue.proofs.state,
        code_challenge: claimedCredential.credentialSubject.ethereumAddress,
        code: claimValue.proofs.code
      });
      console.log('twitterFollowersCount: ', twitterUser.followers);

      // If valid follower count
      if (
        claimValue.host === 'twitter.com' &&
        twitterUser &&
        twitterUser.username.toLowerCase() ===
          claimValue.username.toLowerCase() &&
        twitterUser.followers > 10000
      ) {
        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        }
        console.log('claim: ', claim);

        // Issue Verifiable credential (twitterUsername)

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(
          `Wrong twitter follower count: ${twitterUser.followers}`
        );
      }
    }
  } catch (err) {
    next(err);
  }
};
