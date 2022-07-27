// TODO: Validate if address deserves the badge

import express from 'express';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { lib, utils } from '@krebitdao/reputation-passport';

import { connect } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL,
} = process.env;

const ceramicClient = new CeramicClient(SERVER_CERAMIC_URL);

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
    const badgeValue = {
      communityId,
      name: 'Community Badge Name',
      imageIPFS: 'ipfs://asdf',
      description: 'Badge for users that meet some criteria',
      skills: [{ skillId: 'participation', score: 100 }],
      xp: '1',
    };

    const expirationDate = new Date();
    const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    const claim = {
      id: 'uri://badge-id',
      credentialSubject: {
        encrypted: 'false',
        ethereumAddress: address,
        id: `did:pkh:eip155:1:${address}`,
        type: 'questBadge',
        value: badgeValue,
        typeSchema: 'https://github.com/KrebitDAO/schemas/questBadge',
        trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
        stake: parseInt(SERVER_STAKE, 10), // In KRB
        price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
      },
      expirationDate: new Date(expirationDate).toISOString(),
    };
    console.log('claim: ', claim);

    // Log in with wallet to Ceramic DID
    console.log('Authenticating with Self.Id...');
    const idx = await lib.ceramic.authenticateDID({
      address: wallet.address,
      ethProvider,
      client: ceramicClient,
    });

    // Issue Verifiable credential
    const result = await utils.issueCredential({ wallet, idx, claim });

    if (result) {
      return response.json(result);
    }
  } catch (err) {
    throw new Error(err);
  }
};
