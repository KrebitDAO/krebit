import express from 'express';
import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import krebit from '@krebitdao/reputation-passport';

import {
  connect,
  startPhoneVerification,
  checkPhoneVerification
} from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL
} = process.env;

export const PhoneController = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!request?.body) {
      throw new Error('Body not defined');
    }

    let channel = 'sms';
    if (request?.body?.channel) {
      channel = request.body.channel;
    }

    // Check and decrypt claimed credential

    const { wallet, ethProvider } = await connect();

    // Log in with wallet to Ceramic DID
    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider,
      address: wallet.address,
      litSdk: LitJsSdk,
      ceramicUrl: SERVER_CERAMIC_URL
    });
    const did = await Issuer.connect();
    console.log('DID:', did);

    let claimedCredential = null;
    if (request?.body?.claimedCredential) {
      claimedCredential = request.body.claimedCredential;
    } else if (request?.body?.claimedCredentialId) {
      claimedCredential = await Issuer.getCredential(
        request.body.claimedCredentialId
      );
    }

    console.log('Verifying phone with claimedCredential: ', claimedCredential);

    console.log(
      'checkCredential: ',
      await Issuer.checkCredential(claimedCredential)
    );

    if (claimedCredential?.credentialSubject?.type !== 'phoneNumber') {
      throw new Error(`claimedCredential type is not phoneNumber`);
    }

    // get the claimValue
    let claimValue = null;
    //Decrypt
    if (claimedCredential.credentialSubject.encrypted === 'lit') {
      claimValue = await Issuer.decryptClaimValue(claimedCredential);
      console.log('Decrypted claim value: ', claimValue);
    } else {
      claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('Claim value: ', claimValue);
    }

    if (
      claimValue?.proofs?.verificationId &&
      claimValue?.proofs?.verificationId != ''
    ) {
      // Check Verification status
      console.log('proofs: ', claimValue.proofs);
      const verification = await checkPhoneVerification(
        '+'.concat(claimValue.countryCode).concat(claimValue.number),
        claimValue.proofs.nonce
      );
      console.log('verification: ', verification);
      // If verification number matches claimed number
      if (
        parseInt(verification.to) ===
          parseInt(
            claimValue.countryCode.toString() + claimValue.number.toString()
          ) &&
        verification.status === 'approved'
      ) {
        // Issue verifiable credential
        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: request.body.claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString(),
          encrypt: 'hash' as 'hash'
        };
        console.log('claim: ', claim);

        // Issue Verifiable credential

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        console.log(
          'Valid hash: ',
          Issuer.compareClaimValueHash(claimValue, issuedCredential)
        );

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        return response.json({ status: verification.status });
      }
    } else {
      // Start Twilio verification
      const verificationId = await startPhoneVerification(
        '+'.concat(claimValue.countryCode).concat(claimValue.number),
        channel
      );
      console.log('verificationId: ', verificationId);
      // return verificationId
      if (verificationId) {
        return response.json({ verificationId });
      }
    }
  } catch (err) {
    next(err);
  }
};
