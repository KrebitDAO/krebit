// TODO: Validate if address deserves the badge

import express from 'express';
import LitJsSdk from '@lit-protocol/sdk-nodejs';
import krebit from '@krebitdao/reputation-passport';

import { connect, generateUID } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL
} = process.env;

export const DelegatedController = async (
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

    if (!request?.body?.credentialSubjectAddress) {
      throw new Error(`No credentialSubjectAddress in body`);
    }

    if (!request?.body?.credentialSubjectAddressDID) {
      throw new Error(`No credentialSubjectAddress in body`);
    }

    const { claimedCredentialId } = request.body;
    const { credentialSubjectAddress } = request.body;
    const { credentialSubjectAddressDID } = request.body;

    console.log('credentialSubjectAddress:', credentialSubjectAddress);
    console.log('credentialSubjectAddressDID:', credentialSubjectAddressDID);

    const { wallet, ethProvider } = await connect();

    // Log in with wallet to Ceramic DID
    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider,
      address: wallet.address,
      ceramicUrl: SERVER_CERAMIC_URL
    });
    const did = await Issuer.connect();
    console.log('DID:', did);

    const claimedCredential = await Issuer.getCredential(claimedCredentialId);

    console.log(
      'Verifying delegated credential with claimedCredential: ',
      claimedCredential
    );

    // Check self-signature
    console.log(
      'checkCredential: ',
      await Issuer.checkCredential(claimedCredential)
    );

    // If claim is digitalProperty "twitter"
    if (
      claimedCredential?.credentialSubject?.type === 'Issuer' &&
      claimedCredential?.credentialSubject?.value.includes('credentialType')
    ) {
      // Get evidence bearer token
      const claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('claim value: ', claimValue);

      // Is this a valid Issuer?, let'see if they have enough KRB balance or something.
      const valid =
        claimValue.values?.issueTo?.findIndex(element => {
          return (
            element.toLowerCase() === credentialSubjectAddress.toLowerCase()
          );
        }) > -1 &&
        claimValue.ethereumAddress.toLowerCase() ===
          wallet.address.toLowerCase() &&
        credentialSubjectAddress.toLowerCase() !==
          claimedCredential.credentialSubject.ethereumAddress;

      // If valid issuer
      if (valid) {
        console.log(
          'Valid issuer:',
          claimedCredential.credentialSubject.ethereumAddress
        );

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: credentialSubjectAddress,
          did: credentialSubjectAddressDID,
          type: claimValue.credentialType,
          typeSchema: claimValue.credentialSchema,
          tags: claimValue.tags?.length
            ? ['Community', ...claimValue.tags]
            : ['Community'],
          value: {
            ...claimValue.values,
            parentCredential: claimedCredentialId,
            onBehalveOfIssuer: claimedCredential.issuer
          },
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        console.log('claim: ', claim);

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

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
    next(err);
  }
};
