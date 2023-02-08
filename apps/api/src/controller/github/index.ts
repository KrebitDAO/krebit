import express from 'express';
import LitJsSdk from '@lit-protocol/sdk-nodejs';
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
    const { wallet, ethProvider, pkpWallet } = await connect();

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

    // If claim is digitalProperty "github"
    if (claimedCredential?.credentialSubject?.type === 'Github') {
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
        console.log('Valid github ID:', githubUser);

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        } else {
          claim.value['id'] = githubUser.id.toString();
        }
        console.log('claim: ', claim);

        // Issue Verifiable credential (githubUsername)

        const issuedCredential = await Issuer.issue(claim, pkpWallet as any);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong github ID: ${githubUser}`);
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'GithubFollowersGT10'
    ) {
      // Connect to github and get user ID from code
      const accessToken = await github.requestAccessToken(
        claimValue.proofs.code
      );
      const githubUser = await github.getGithubUser(accessToken);
      const followers = githubUser.followers;
      console.log('githubFollowersCount: ', followers);

      // If valid follower count
      if (
        claimValue.host === 'github.com' &&
        githubUser &&
        githubUser.login.toLowerCase() === claimValue.username.toLowerCase() &&
        followers > 10
      ) {
        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        }
        console.log('claim: ', claim);

        // Issue Verifiable credential (githubUsername)

        const issuedCredential = await Issuer.issue(claim, pkpWallet as any);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong github ID: ${followers}`);
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'GithubRepoStarsGT10'
    ) {
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
        !githubRepo.fork &&
        githubRepo.stargazers_count > 10
      ) {
        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        let tags = claimedCredential.type.slice(1);
        if (githubRepo.topics && githubRepo.topics.length > 0)
          tags = tags?.concat(githubRepo.topics);
        if (githubRepo.language) tags.push(githubRepo.language);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: githubRepo.language
            ? githubRepo.language.concat(
                claimedCredential.credentialSubject.type
              )
            : claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: tags,
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        } else {
          claim.value['description'] = githubRepo.description
            ? githubRepo.description
            : '';
          claim.value['startDate'] = githubRepo.created_at;
          claim.value['endDate'] = githubRepo.pushed_at;
          claim.value['imageUrl'] = githubRepo.owner.avatar_url;
          claim.value['skills'] = githubRepo.languages;
        }
        console.log('claim: ', claim);

        // Issue Verifiable credential

        const issuedCredential = await Issuer.issue(claim, pkpWallet as any);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong github ID: ${githubUser}`);
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'GithubRepoCollaborator'
    ) {
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
      const isCollaborator = await github.isGithubRepoCollaborator(
        accessToken,
        claimValue.entity,
        claimValue.title,
        claimValue.proofs.username
      );
      console.log('isCollaborator: ', isCollaborator);

      // If valid github repo
      if (
        githubUser &&
        githubUser.login.toLowerCase() ===
          claimValue.proofs.username.toLowerCase() &&
        githubRepo &&
        githubRepo.owner.login.toLowerCase() ===
          claimValue.entity.toLowerCase() &&
        githubRepo.name.toLowerCase() === claimValue.title.toLowerCase() &&
        !githubRepo.fork &&
        isCollaborator
      ) {
        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        let tags = claimedCredential.type.slice(1);
        if (githubRepo.topics && githubRepo.topics.length > 0)
          tags = tags?.concat(githubRepo.topics);
        if (githubRepo.language) tags.push(githubRepo.language);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: githubRepo.language
            ? githubRepo.language.concat(
                claimedCredential.credentialSubject.type
              )
            : claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: tags,
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        } else {
          claim.value['description'] = githubRepo.description
            ? githubRepo.description
            : '';
          claim.value['startDate'] = githubRepo.created_at;
          claim.value['endDate'] = githubRepo.pushed_at;
          claim.value['imageUrl'] = githubRepo.owner.avatar_url;
          claim.value['skills'] = githubRepo.languages;
        }
        console.log('claim: ', claim);

        // Issue Verifiable credential

        const issuedCredential = await Issuer.issue(claim, pkpWallet as any);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong github ID: ${githubUser}`);
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'GithubOrgMember'
    ) {
      // Connect to github and get user ID from code
      const accessToken = await github.requestAccessToken(
        claimValue.proofs.code
      );
      const githubUser = await github.getGithubUser(accessToken);
      console.log('githubUser: ', githubUser);
      const githubOrg = await github.getGithubOrgMember(
        accessToken,
        claimValue.entity,
        claimValue.username
      );
      console.log('githubOrg: ', githubOrg);

      // If valid github org
      if (
        githubUser &&
        githubUser.login.toLowerCase() === claimValue.username.toLowerCase() &&
        githubOrg &&
        githubOrg.user.login.toLowerCase() ===
          claimValue.username.toLowerCase() &&
        githubOrg.organization.login.toLowerCase() ===
          claimValue.entity.toLowerCase() &&
        githubOrg.state === 'active'
      ) {
        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: {
            entity: claimValue.entity,
            username: claimValue.username,
            name: claimValue.name
          },
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        } else {
          claim.value['role'] = githubOrg.role;
          claim.value['description'] = githubOrg.organization.description
            ? githubOrg.organization.description
            : '';
          claim.value['imageUrl'] = githubOrg.organization.avatar_url;
        }
        console.log('claim: ', claim);

        // Issue Verifiable credential

        const issuedCredential = await Issuer.issue(claim, pkpWallet as any);
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
