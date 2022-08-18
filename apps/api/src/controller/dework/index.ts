import express from 'express';
import { CeramicClient } from '@ceramicnetwork/http-client';
import krebit from '@krebitdao/reputation-passport';

import { connect, getDeworkUser } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL
} = process.env;

const ceramicClient = new CeramicClient(SERVER_CERAMIC_URL);

export const DeworkController = async (
  request: express.Request,
  response: express.Response
) => {
  console.log(request.body);
  try {
    if (!request?.body) {
      throw new Error('Body not defined');
    }

    if (!request?.body?.address) {
      throw new Error(`No address in body`);
    }

    const { address } = request.body;
    const { wallet, ethProvider } = await connect();

    // Log in with wallet to Ceramic DID
    console.log('Authenticating with Self.Id...');
    const idx = await krebit.lib.ceramic.authDIDSession({
      address: wallet.address,
      ethProvider,
      client: ceramicClient
    });

    // Connect to dework and get reputation from address
    const dework = await getDeworkUser({ address });
    console.log('Importing from Dework:', dework.address);

    const expirationDate = new Date();
    const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    if (!dework.tasks || dework.tasks.length === 0) {
      throw new Error('Missing tasks');
    }

    const result = await Promise.all(
      await dework.tasks.map(async task => {
        if (task.rewards && task.rewards.length > 0) {
          let claim = {
            id: task.permalink,
            credentialSubject: {
              encrypted: 'false',
              ethereumAddress: address,
              id: `did:pkh:eip155:80001:${address}`,
              type: 'workExperience',
              value: {
                ...task,
                issuingEntity: 'Dework',
                startDate: 'null',
                endDate: task.date,
                evidence: 'https://api.deworkxyz.com/v1/reputation/' + address
              },
              typeSchema: 'https://github.com/KrebitDAO/schemas/workExperience',
              trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
              stake: parseInt(SERVER_STAKE, 10), // In KRB
              price: parseInt(SERVER_PRICE, 10) * 10 ** 18 // charged to the user for claiming KRBs
            },
            expirationDate: new Date(expirationDate).toISOString()
          };

          const result = await krebit.utils.issueCredential({
            wallet,
            idx,
            claim
          });

          if (result) return result;
        }
      })
    );

    return response.json(result);
  } catch (err) {
    throw new Error(err);
  }
};
