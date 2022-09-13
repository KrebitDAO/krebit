import express from 'express';
import { CeramicClient } from '@ceramicnetwork/http-client';
import krebit from '@krebitdao/reputation-passport';

import { connect, getDiscordUser } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL,
  SERVER_NETWORK
} = process.env;

export const DiscordController = async (
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
      ceramicUrl: SERVER_CERAMIC_URL
    });
    const did = await Issuer.connect();
    console.log('DID:', did);

    const claimedCredential = await Issuer.getCredential(claimedCredentialId);

    console.log(
      'Verifying discord with claimedCredential: ',
      claimedCredential
    );

    // Check self-signature
    console.log('checkCredential: ', Issuer.checkCredential(claimedCredential));

    // TODO: Check if the claim already has verifications by me?

    // If claim is digitalProperty "Discord"
    if (
      claimedCredential?.credentialSubject?.type === 'digitalProperty' &&
      claimedCredential?.credentialSubject?.value.includes('discord')
    ) {
      // Get evidence bearer token
      const claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('claim value: ', claimValue);

      // Connect to discord and get user ID from token
      const discord = await getDiscordUser({
        tokenType: claimValue.proofs.tokenType,
        accessToken: claimValue.proofs.accessToken
      });

      const expirationDate = new Date();
      const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
      expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
      console.log('expirationDate: ', expirationDate);

      const claim = {
        id: claimedCredentialId,
        ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
        did: `did:pkh:eip155:${krebit.schemas.krbToken[SERVER_NETWORK]?.domain?.chainId}:${claimedCredential.credentialSubject.ethereumAddress}`,
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

      // If discord userID == the VC userID
      if (discord.id === claimValue.id) {
        // Issue Verifiable credential
        console.log('Valid discord:', discord);

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong discord: ${discord}`);
      }
    }
  } catch (err) {
    next(err);
  }
};
