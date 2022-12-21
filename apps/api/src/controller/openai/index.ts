import express from 'express';
import krebit from '@krebitdao/reputation-passport';

import { openAI } from '../../utils';

const { SERVER_CERAMIC_URL, SERVER_NETWORK } = process.env;

export const OpenAIController = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!request?.body) {
      throw new Error('Body not defined');
    }
    const skills = request?.body?.skills;
    const jobId = request?.body?.jobId;
    const profileDid = request?.body?.did;

    if (jobId && profileDid) {
      console.log('Getting match with jobId: ', jobId);
      console.log('Getting match with did: ', profileDid);
      /*
      const { wallet, ethProvider } = await connect();

      // Log in with wallet to Ceramic DID
      const Issuer = new krebit.core.Krebit({
        wallet,
        ethProvider,
        address: wallet.address,
        ceramicUrl: SERVER_CERAMIC_URL
      });
      const did = await Issuer.connect();

      const job = (await Issuer.getDocument(jobId)) as any;
*/
      const publicPassport = new krebit.core.Passport({
        network: SERVER_NETWORK as 'mumbai' | 'polygon',
        ceramicUrl: SERVER_CERAMIC_URL
      });
      await publicPassport.read(profileDid.toLowerCase());
      const profileSkills = await publicPassport.getSkills();

      const result = await openAI.getMatch(jobId, profileSkills);

      return response.json({ result });
    } else {
      console.log('Getting summary with skills: ', skills);
      const result = await openAI.getSkillSummary(skills);

      return response.json({ result });
    }
  } catch (err) {
    next(err);
  }
};
