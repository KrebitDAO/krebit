import express from 'express';
import { CeramicClient } from '@ceramicnetwork/http-client';
import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import krebit from '@krebitdao/reputation-passport';

import { connect, getTwitterUser } from '../../utils';

// Twitter Oauth2
import { Client, auth } from 'twitter-api-sdk';

const authClient = new auth.OAuth2User({
  client_id: process.env.NEXT_PUBLIC_PASSPORT_TWITTER_CLIENT_ID as string,
  client_secret: process.env.SERVER_TWITTER_CLIENT_SECRET as string,
  callback: process.env.NEXT_PUBLIC_PASSPORT_TWITTER_CALLBACK as string,
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

const ceramicClient = new CeramicClient(SERVER_CERAMIC_URL);

export const TwitterController = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!request?.body) {
      throw new Error('Body not defined');
    }

    if (!request?.body?.claimedCredential) {
      throw new Error(`No claimedCredential in body`);
    }

    const { claimedCredential } = request.body;
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

    console.log(
      'Verifying twitter with claimedCredential: ',
      claimedCredential
    );

    // TODO: check self-signature
    // TODO: Check if the claim already has verifications by me
    // TODO: Check if the proofValue of the sent VC is OK
    console.log(
      'checkCredential: ',
      await Issuer.checkCredential(claimedCredential)
    );

    // If claim is digitalProperty "twitter"
    if (
      claimedCredential?.credentialSubject?.type === 'digitalProperty' &&
      claimedCredential?.credentialSubject?.value.includes('twitter')
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
      if (twitterUser && twitterUser.username) {
        delete claimValue.proofs;

        console.log('Valid twitter ID:', twitterUser);

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredential.id,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: `did:pkh:eip155:${krebit.schemas.krbToken[SERVER_NETWORK]?.domain?.chainId}:${claimedCredential.credentialSubject.ethereumAddress}`,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(1),
          value: {
            ...claimValue,
            ...twitterUser
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

        // TODO: Issue Verifiable credential (twitterFollowers)
        // TODO: Issue Verifiable credential (twitterTweets)
        //TODO: return array of issuedCredentials

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong twitter ID: ${twitterUser}`);
      }
    }
  } catch (err) {
    next(err);
  }
};
