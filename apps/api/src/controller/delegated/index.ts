// TODO: Validate if address deserves the badge

import express from 'express';
import LitJsSdk from '@lit-protocol/sdk-nodejs';
import krebit from '@krebitdao/reputation-passport';
import { ethers } from 'ethers';

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

    if (!request?.body?.claimedCredential) {
      throw new Error(`No claimedCredential in body`);
    }

    if (!request?.body?.credentialSubjectAddress) {
      throw new Error(`No credentialSubjectAddress in body`);
    }

    if (!request?.body?.credentialSubjectAddressDID) {
      throw new Error(`No credentialSubjectAddress in body`);
    }

    const { claimedCredential } = request.body;
    const { credentialSubjectAddress } = request.body;
    const { credentialSubjectAddressDID } = request.body;
    const { credentialSubjectEmail } = request.body;

    console.log('credentialSubjectAddress:', credentialSubjectAddress);
    console.log('credentialSubjectAddressDID:', credentialSubjectAddressDID);
    console.log('credentialSubjectEmail:', credentialSubjectEmail);

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

      const issueTo = await Issuer.decryptClaimValue(
        claimValue.credentialSubjectList
      );
      console.log('issueTo: ', issueTo);

      // Is this a valid Issuer?, let'see if they have enough KRB balance or something.
      const valid =
        issueTo.findIndex(element => {
          return (
            element.toLowerCase() === credentialSubjectAddress.toLowerCase() ||
            element.toLowerCase() === credentialSubjectEmail.toLowerCase()
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

        const tokenIdHex = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
            ['string'],
            [claimedCredential.id]
          )
        );
        const tokenId = ethers.BigNumber.from(tokenIdHex);

        const claim = {
          id: claimedCredential.id,
          ethereumAddress: credentialSubjectAddress,
          did: credentialSubjectAddressDID,
          type: claimedCredential.id,
          typeSchema: claimValue.credentialSchema,
          tags: claimValue.tags?.length
            ? [
                `tokenIdHex:${tokenIdHex.toString()}`,
                `tokenId:${tokenId.toString()}`,
                'Community',
                claimValue.credentialType,
                ...claimValue.tags
              ]
            : [
                `tokenIdHex:${tokenIdHex.toString()}`,
                `tokenId:${tokenId.toString()}`,
                'Community',
                claimValue.credentialType
              ],
          value: {
            ...claimValue.values,
            parentCredential: claimedCredential.id,
            credentialType: claimValue.credentialType,
            onBehalveOfIssuer: claimedCredential.issuer
          },
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: claimedCredential.expirationDate
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
