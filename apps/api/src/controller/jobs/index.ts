import express from 'express';
import { ethers } from 'ethers';
import krebit from '@krebitdao/reputation-passport';

import { connect, jobs } from '../../utils';

const { SERVER_NFT_METADATA_IPFS, SERVER_CERAMIC_URL } = process.env;

const postSchemaCommit =
  'k1dpgaqe3i64kjuyet4w0zyaqwamf9wrp1jim19y27veqkppo34yghivt2pag4wxp0fv2yl4hedynpfuynp2wvd8s7ctabea6lx732xrr8b0cgqauwlh0vwg6';

const channel =
  'kjzl6cwe1jw145l8g0ojf3ku355i6ybovcpbiir8nam0385w8ajalywyd8un11b';

/** Force index a stream. This shouldn't be necessary because our indexer picks up all new streams automatically but at least we are 100% sure. */
export async function forceIndex(stream_id: string) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };
  let _result;
  try {
    _result = await fetch(
      'https://api.orbis.club/index-stream/mainnet/' + stream_id,
      requestOptions
    );
    console.log('Indexed ' + stream_id + ' with success.');
    return;
  } catch (e) {
    console.log('Error indexing new stream: ', e);
    return;
  }
}

export const JobsController = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!request?.query) {
      throw new Error('query not defined');
    }
    console.log(request?.query);

    if (!request?.query?.size) {
      throw new Error(`No size in query`);
    }
    const size = parseInt(request?.query?.size as string);

    if (!request?.query?.postedSince) {
      throw new Error(`No postedSince in query`);
    }
    const postedSince = request?.query?.postedSince;

    const { wallet, ethProvider } = await connect();

    // Log in with wallet to Ceramic DID
    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider,
      address: wallet.address,
      //ceramicUrl: SERVER_CERAMIC_URL
      ceramicUrl: 'https://node1.orbis.club'
    });
    const did = await Issuer.connect();
    console.log('DID:', did);

    const boardJobs = await jobs.getBoardJobs(size, postedSince as string);

    let results = [];
    for (var job of boardJobs) {
      console.log('job.companyLogos', job.companyLogos);
      const skills = job.skills?.map(s => s.id?.replace('resume:', ''));
      const tags = job.skills?.map(s => {
        return {
          slug: s.id?.replace('resume:', ''),
          title: s.id?.replace('resume:', '')
        };
      });
      const roles = job.jobTypes?.map(t => t.label);
      const industries = job.markets?.map(m => m.label);
      const size = job.stages?.filter(s => s.label?.includes('employees'))[0]
        ?.label;
      //console.log('skills', skills);
      const jobData = {
        type: 'job',
        entity: job.companyName,
        industries,
        size,
        title: job.title,
        description: job.description ? job.description : job.title,
        publishedDate: job.timeStamp,
        applyUrl: `${job.applyUrl}?&utm_source=krebit.id&lever-source%5B%5D=krebit.id&gh_src=krebit.id&ref=krebit.id&src=krebit.id&source=krebit.id`,
        roles,
        skills,
        salaryRange: 'N/A'
      };

      const jobDoc = {
        context: channel,
        title: jobData.title,

        /*media: [
          {
            url: jobData.imageUrl,
            gateway: 'https://orbis.mypinata.cloud/ipfs/'
          }
        ],*/
        // 'krebit-job'
        tags: [
          {
            slug: 'krebit-job',
            title: 'Krebit Job'
          },
          ...tags
        ],
        data: {
          ...jobData,
          imageUrl: job.companyLogos?.manual?.src
            ? job.companyLogos?.manual?.src
            : job.companyLogos?.linkedin?.src
        }
      };
      console.log('jobDoc:', jobDoc);

      let streamId = await Issuer.createDocument(
        jobDoc,
        ['orbis', 'post'],
        postSchemaCommit,
        'orbis'
      );

      await Issuer.updateDocument(
        {
          ...jobDoc,
          body: `Job offer: ${jobDoc?.data?.title}\nApply: https://krebit.id/posts?post_id=${streamId}`
        },
        streamId
      );

      // Force index document
      forceIndex(streamId);
      results.push(streamId);
    }

    return response.json(results);
  } catch (err) {
    next(err);
  }
};
