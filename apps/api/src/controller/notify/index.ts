import express from 'express';
import LitJsSdk from '@lit-protocol/sdk-nodejs';
import krebit from '@krebitdao/reputation-passport';

import { connect, hashmail } from '../../utils';

const { SERVER_NETWORK, SERVER_CERAMIC_URL } = process.env;

export const NotifyController = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!request?.body) {
      throw new Error('Body not defined');
    }

    if (!request?.body?.subject) {
      throw new Error(`No subject in body`);
    }

    if (!request?.body?.content) {
      throw new Error(`No content in body`);
    }

    if (!request?.body?.recipients) {
      throw new Error(`No recipients in body`);
    }

    const { subject } = request.body;
    const { content } = request.body;
    const { recipients } = request.body;

    console.log('recipients:', recipients);
    console.log('subject:', subject);

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

    const publicPassport = new krebit.core.Passport({
      network: SERVER_NETWORK as 'mumbai' | 'polygon',
      ceramicUrl: SERVER_CERAMIC_URL
    });

    for (const recipient of recipients) {
      let to = [];
      if (recipient.startsWith('0x')) {
        to = [`${recipient}@hashmail.dev`];
        await publicPassport.read(recipient.toLowerCase());
        const profileEmails = await publicPassport.getCredentials('Email');

        if (profileEmails?.length > 0) {
          console.log('Emails:', profileEmails.length);
          const emailvalue = await Issuer.decryptCredential(profileEmails[0]);
          console.log('Email value:', emailvalue);
          if (emailvalue?.email) to = to.concat(emailvalue.email);
        }
      } else if (recipient.includes('@')) {
        to = [recipient];
      }

      const sent = await hashmail.sendMessages({
        to,
        subject,
        content
      });
      console.log('sent: ', sent);

      if (sent) {
        return response.json(sent);
      } else {
        throw new Error(`Error sending to ${recipient}`);
      }
    }
  } catch (err) {
    console.log('err: ', err);
    next(err);
  }
};
