import express from 'express';
import { CeramicClient } from '@ceramicnetwork/http-client';
import krebit from '@krebitdao/reputation-passport';

import { connect, getSpectUser } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL
} = process.env;

export const SpectController = async (
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
    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider,
      address: wallet.address
    });
    const did = await Issuer.connect();
    console.log('DID:', did);

    // Connect to spect and get reputation from address
    const spect = await getSpectUser({ address });
    console.log('Importing from Spect:', spect);

    const expirationDate = new Date();
    const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    if (!spect.assignedClosedCards || spect.assignedClosedCards.length === 0) {
      throw new Error('Missing completed tasks');
    }

    const result = await Promise.all(
      await spect.assignedClosedCards.map(async task => {
        if (spect.cardDetails[task] && spect.cardDetails[task].status.paid) {
          let claim = {
            id: spect.cardDetails[task].id,
            ethereumAddress: address,
            type: 'workExperience',
            typeSchema: 'ceramic://workExperience',
            tags: ['spect', 'task', 'circle', 'community'],
            value: {
              title: spect.cardDetails[task].title,
              entity: spect.cardDetails[task].circle.name,
              imageUrl: spect.cardDetails[task].circle.avatar,
              skills: [{ skillId: 'participation', score: 100 }],
              startDate: '',
              endDate: spect.cardDetails[task].circle.deadline
                ? spect.cardDetails[task].circle.deadline
                : '',
              proofs: {
                url: `https://circles.spect.network/${spect.cardDetails[task].circle.slug}/${spect.cardDetails[task].project.slug}/${spect.cardDetails[task].slug}`,
                apiUrl: 'https://api.spect.network/user/' + address
              }
            },
            trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
            stake: parseInt(SERVER_STAKE, 10), // In KRB
            price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
            expirationDate: new Date(expirationDate).toISOString()
          };

          const issuedCredential = await Issuer.issue(claim);
          console.log('issuedCredential: ', issuedCredential);

          if (issuedCredential) return issuedCredential;
        }
      })
    );

    return response.json(result);
  } catch (err) {
    throw new Error(err);
  }
};
