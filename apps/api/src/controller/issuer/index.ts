import express from 'express';
//import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import krebit from '@krebitdao/reputation-passport';

import { connect, generateUID } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE
} = process.env;

export const IssuerController = async (
  request: express.Request,
  response: express.Response
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
      address: wallet.address
    });
    const did = await Issuer.connect();
    console.log('DID:', did);

    console.log('Verifying issuer with claimedCredential: ', claimedCredential);

    // TODO: check self-signature
    // TODO: Check if the claim already has verifications by me
    // TODO: Check if the proofValue of the sent VC is OK
    console.log(
      'checkCredential: ',
      await Issuer.checkCredential(claimedCredential)
    );

    // If claim is digitalProperty "twitter"
    if (
      claimedCredential?.credentialSubject?.type === 'issuer' &&
      claimedCredential?.credentialSubject?.value.includes('credentialType')
    ) {
      // Get evidence bearer token
      const claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('claim value: ', claimValue);

      // Is this a valid Issuer, let'ssee if they have enough KRB balance or something.

      // If valid issuer
      if (true) {
        console.log(
          'Valid issuer:',
          claimedCredential.credentialSubject.ethereumAddress
        );

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredential.id,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id
            ? claimedCredential.credentialSubject.id
            : `did:pkh:eip155:1:${claimedCredential.credentialSubject.ethereumAddress}`,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: [claimValue.credentialType],
          value: claimValue,
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
        throw new Error(
          `Wrong issuer: ${claimedCredential.credentialSubject.ethereumAddress}`
        );
      }
    }
  } catch (err) {
    console.log('err: ', err);
    throw new Error(err);
  }
};
