// TODO: check self-signature
// TODO: Check if the claim already has verifications by me
// TODO: Check if the proofValue of the sent VC is OK

import express from 'express';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { lib, utils } from '@krebitdao/reputation-passport';

import { connect, getDiscordUser } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL
} = process.env;

const ceramicClient = new CeramicClient(SERVER_CERAMIC_URL);

export const DiscordController = async (
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

    console.log(
      'Verifying discord with claimedCredential: ',
      claimedCredential
    );

    // If claim is digitalProperty "Discord"
    if (
      claimedCredential?.credentialSubject?.type === 'digitalProperty' &&
      claimedCredential?.credentialSubject?.value.includes('discord')
    ) {
      // Log in with wallet to Ceramic DID
      console.log('Authenticating with Self.Id...');
      const idx = await lib.ceramic.authProvider({
        address: wallet.address,
        ethProvider,
        client: ceramicClient
      });

      // Get evidence bearer token
      const value = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('claim value: ', value);

      const evidence = JSON.parse(value.evidence);
      console.log('evidence: ', evidence);

      // Connect to discord and get user ID from token
      const discord = await getDiscordUser({
        tokenType: evidence.tokenType,
        accessToken: evidence.accessToken
      });

      const expirationDate = new Date();
      const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
      expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
      console.log('expirationDate: ', expirationDate);

      const claim = {
        ...claimedCredential,
        credentialSubject: {
          ...claimedCredential.credentialSubject,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18 // charged to the user for claiming KRBs
        },
        expirationDate: new Date(expirationDate).toISOString()
      };
      console.log('claim: ', claim);

      // If discord userID == the VC userID
      if (discord.id === value.id) {
        // Issue Verifiable credential
        console.log('Valid discord:', discord);
        const result = await utils.issueCredential({ wallet, idx, claim });

        if (result) {
          return response.json(result);
        }
      } else {
        throw new Error(`Wrong discord: ${discord}`);
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};
