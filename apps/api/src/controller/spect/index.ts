import express from 'express';
import krebit from '@krebitdao/reputation-passport';
import LitJsSdk from '@lit-protocol/sdk-nodejs';

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

    console.log('Verifying spect with claimedCredential: ', claimedCredential);

    // Check self-signature
    console.log('checkCredential: ', Issuer.checkCredential(claimedCredential));

    // get the claimValue
    let claimValue = null;
    //Decrypt
    if (claimedCredential.credentialSubject.encrypted === 'lit') {
      claimValue = await Issuer.decryptCredential(claimedCredential);
    } else {
      claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('Claim value: ', claimValue);
    }
    const publicClaim: boolean =
      claimedCredential.credentialSubject.encrypted === 'none';

    //Tasks for a specific Circle or Skill
    if (
      claimedCredential?.credentialSubject?.type === 'SpectCompletedTasksGT10'
    ) {
      // Connect to spect and get reputation from address
      const spect = await getSpectUser({
        address: claimedCredential.credentialSubject.ethereumAddress
      });
      console.log('Importing from Spect:', spect);

      const circleTasks = spect.assignedClosedCards
        .map(task => {
          if (
            spect.cardDetails[task] &&
            spect.cardDetails[task].circle.slug.toLowerCase() ===
              claimValue.entity.toLowerCase()
          ) {
            return spect.cardDetails[task];
          }
        })
        .filter(task => task !== undefined);

      if (circleTasks.length > 10) {
        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);
        const skills = circleTasks
          .map(task => {
            return task.labels;
          })
          .flatMap(skill => {
            return skill != undefined ? skill : 'Other';
          });
        const skillSet = [...new Set(skills)] as string[];
        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2)?.concat(skillSet),
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        } else {
          claim.value['skills'] = skillSet.map(skill => {
            return {
              skillId: skill,
              score: 100
            };
          });
        }
        console.log('claim: ', claim);

        // Issue Verifiable credential

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong spect ID: ${spect}`);
      }
    }
  } catch (err) {
    next(err);
  }
};
