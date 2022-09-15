import express from 'express';
import { CeramicClient } from '@ceramicnetwork/http-client';
import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import krebit from '@krebitdao/reputation-passport';

import {
  connect,
  getTwitterUser,
  getTwitterFollowersCount,
  getTwitterPostsCount
} from '../../utils';

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

    // If claim is digitalProperty "twitter"
    if (
      claimedCredential?.credentialSubject?.type === 'twitter' &&
      claimedCredential?.credentialSubject?.typeSchema.includes(
        'digitalProperty'
      )
    ) {
      // Get evidence bearer token
      const claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('claim value: ', claimValue);

      // Connect to twitter and get user ID from code
      const twitterUser = await getTwitterUser({
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
        delete claimValue.proofs;

        console.log('Valid twitter ID:', twitterUser);

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: `did:pkh:eip155:${krebit.schemas.krbToken[SERVER_NETWORK]?.domain?.chainId}:${claimedCredential.credentialSubject.ethereumAddress}`,
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
          expirationDate: new Date(expirationDate).toISOString(),
          encrypt: 'hash' as 'hash'
        };
        console.log('claim: ', claim);

        // Issue Verifiable credential (twitterUsername)

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong twitter ID: ${twitterUser}`);
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'twitterFollowers'
    ) {
      // Get evidence bearer token
      const claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('claim value: ', claimValue);

      // Connect to twitter and get user ID from code
      const followers = await getTwitterFollowersCount({
        client: authClient,
        state: claimValue.proofs.state,
        code_challenge: claimedCredential.credentialSubject.ethereumAddress,
        code: claimValue.proofs.code
      });
      console.log('twitterFollowersCount: ', followers);

      let valid = false;
      switch (claimValue.followers) {
        case 'gt100':
          valid = followers > 100;
          break;
        case 'gt500':
          valid = followers > 500;
          break;
        case 'gt1000':
          valid = followers > 1000;
          break;
        case 'gt5K':
          valid = followers > 5000;
          break;
        case 'gt10K':
          valid = followers > 10000;
          break;
        case 'gt50K':
          valid = followers > 50000;
          break;
        case 'gt100K':
          valid = followers > 100000;
          break;
        case 'gt1M':
          valid = followers > 1000000;
          break;
        default:
          valid =
            !claimValue.followers.startsWith('gt') &&
            parseInt(claimValue.followers) > 0;
      }

      // If valid follower count
      if (claimValue.host === 'twitter.com' && valid) {
        delete claimValue.proofs;

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: `did:pkh:eip155:${krebit.schemas.krbToken[SERVER_NETWORK]?.domain?.chainId}:${claimedCredential.credentialSubject.ethereumAddress}`,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: {
            host: claimValue.host,
            protocol: claimValue.protocol,
            followers: claimValue.followers
          },
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        console.log('claim: ', claim);

        // Issue Verifiable credential (twitterUsername)

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong twitter ID: ${followers}`);
      }
    }
  } catch (err) {
    next(err);
  }
};
