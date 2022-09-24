import express from 'express';
import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import krebit from '@krebitdao/reputation-passport';

import { connect, github } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL,
  SERVER_NETWORK
} = process.env;

export const GithubController = async (
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

    console.log('Verifying github with claimedCredential: ', claimedCredential);

    // Check self-signature
    console.log('checkCredential: ', Issuer.checkCredential(claimedCredential));

    // If claim is digitalProperty "github"
    if (
      claimedCredential?.credentialSubject?.type === 'github' &&
      claimedCredential?.credentialSubject?.typeSchema.includes(
        'digitalProperty'
      )
    ) {
      // Get evidence bearer token
      const claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('claim value: ', claimValue);

      // Connect to github and get user ID from code
      const accessToken = await github.requestAccessToken(
        claimValue.proofs.code
      );
      const githubUser = await github.getGithubUser(accessToken);
      console.log('githubUser: ', githubUser);

      // If valid githubID
      if (
        claimValue.host === 'github.com' &&
        githubUser &&
        githubUser.login.toLowerCase() === claimValue.username.toLowerCase()
      ) {
        delete claimValue.proofs;

        console.log('Valid github ID:', githubUser);

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
          value: {
            ...claimValue,
            id: githubUser.id.toString()
          },
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString(),
          encrypt: 'hash' as 'hash'
        };
        console.log('claim: ', claim);

        // Issue Verifiable credential (githubUsername)

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong github ID: ${githubUser}`);
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'githubFollowers' &&
      claimedCredential?.credentialSubject?.typeSchema.includes(
        'digitalProperty'
      )
    ) {
      // Get evidence bearer token
      const claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('claim value: ', claimValue);

      // Connect to github and get user ID from code
      const accessToken = await github.requestAccessToken(
        claimValue.proofs.code
      );
      const githubUser = await github.getGithubUser(accessToken);
      const followers = githubUser.followers;
      console.log('githubFollowersCount: ', followers);

      let valid = false;
      switch (claimValue.followers) {
        case 'gt100':
          valid = followers > 100;
          break;
        case 'gt500':
          valid = followers > 500;
          break;
        case 'gt1000':
          valid = followers > 1000;
          break;
        case 'gt5K':
          valid = followers > 5000;
          break;
        case 'gt10K':
          valid = followers > 10000;
          break;
        case 'gt50K':
          valid = followers > 50000;
          break;
        case 'gt100K':
          valid = followers > 100000;
          break;
        case 'gt1M':
          valid = followers > 1000000;
          break;
        default:
          valid =
            !claimValue.followers.startsWith('gt') &&
            parseInt(claimValue.followers) > 0;
      }

      // If valid follower count
      if (claimValue.host === 'github.com' && valid) {
        delete claimValue.proofs;

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
          value: {
            host: claimValue.host,
            protocol: claimValue.protocol,
            followers: claimValue.followers
          },
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        console.log('claim: ', claim);

        // Issue Verifiable credential (githubUsername)

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong github ID: ${followers}`);
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'githubRepoOwner' &&
      claimedCredential?.credentialSubject?.typeSchema.includes(
        'workExperience'
      )
    ) {
      // Get evidence bearer token
      const claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('claim value: ', claimValue);

      // Connect to github and get user ID from code
      const accessToken = await github.requestAccessToken(
        claimValue.proofs.code
      );
      const githubUser = await github.getGithubUser(accessToken);
      console.log('githubUser: ', githubUser);
      const githubRepo = await github.getGithubRepo(
        accessToken,
        claimValue.entity,
        claimValue.title
      );
      console.log('githubRepo: ', githubRepo);

      // If valid github repo
      if (
        githubUser &&
        githubUser.login.toLowerCase() === claimValue.entity.toLowerCase() &&
        githubRepo &&
        githubRepo.owner.login.toLowerCase() ===
          claimValue.entity.toLowerCase() &&
        githubRepo.name.toLowerCase() === claimValue.title.toLowerCase() &&
        !githubRepo.fork
      ) {
        delete claimValue.proofs;

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        let tags = claimedCredential.type.slice(2);
        if (githubRepo.topics && githubRepo.topics.length > 0)
          tags = tags.concat(githubRepo.topics);
        if (githubRepo.language) tags.push(githubRepo.language);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: `did:pkh:eip155:${krebit.schemas.krbToken[SERVER_NETWORK]?.domain?.chainId}:${claimedCredential.credentialSubject.ethereumAddress}`,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: tags,
          value: {
            title: claimValue.title,
            entity: claimValue.entity,
            description: githubRepo.description,
            startDate: githubRepo.created_at,
            endDate: githubRepo.updated_at,
            skills: githubRepo.languages
          },
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        console.log('claim: ', claim);

        // Issue Verifiable credential

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong github ID: ${githubUser}`);
      }
    }
  } catch (err) {
    next(err);
  }
};
