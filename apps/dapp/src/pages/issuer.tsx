import { useEffect, useState } from 'react';

import krebit from '@krebitdao/reputation-passport';

import { connectWeb3, generateUID, getCredential } from '../utils';

const IndexPage = () => {
  const getClaim = async (claimValue: any) => {
    const expirationDate = new Date();
    const expiresYears = 1;
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    return {
      id: `issuer-${generateUID(10)}`,
      ethereumAddress: claimValue.ethereumAddress,
      type: 'issuer',
      typeSchema: 'ceramic://...',
      tags: [claimValue.credentialType],
      value: claimValue,
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  async function handleDelegateIssuer() {
    console.log('Requesting Delegated Issuer stamp', { type: 'issuer' });

    // Step 1-A: Self-sign delegation credential

    //connect Ethereum wallet
    const { address, wallet, ethProvider } = await connectWeb3();

    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider: ethProvider.provider,
      address
    });

    const did = await Issuer.connect();
    console.log(did);

    const badgeSchema = krebit.schemas.claims.badge;
    const badgeSchemaUrl = await Issuer.setTypeSchema(
      'questBadge',
      badgeSchema
    );

    const claimValue = {
      did: 'did:pkh:eip155:80001:0x661f52d8d111eccf62872bddb2e70c12d8b4b860',
      ethereumAddress: '0x661f52d8d111eccf62872bddb2e70c12d8b4b860',
      entity: 'Krebit',
      description: 'Delegating Quest node for badge Credentials',
      verificationUrl: 'http://localhost:4000/quest',
      credentialType: 'questBadge',
      credentialSchema: badgeSchemaUrl
    };

    //Issue self-signed credential claiming the veriff
    const claim = await getClaim(claimValue);
    console.log('claim: ', claim);
    const delegationCredential = await Issuer.issue(claim);
    console.log('delegationCredential: ', delegationCredential);

    //Optional: save claimedCredential (ask the user if they want to)
    //await passport.addClaimed(claimedCredential)

    // Step 1-B: Send self-signed credential to the Issuer for verification

    const issuedCredential = await getCredential({
      verifyUrl: 'http://localhost:4000/questapp',
      claimedCredential: delegationCredential
    });

    console.log('issuedCredential: ', issuedCredential);

    // Step 1-C: Get the verifiable credential, and save it to the passport
    if (issuedCredential) {
      const passport = new krebit.core.Passport({
        ethProvider: ethProvider.provider,
        address
      });
      await passport.connect();
      const addedCredentialId = await passport.addCredential(issuedCredential);
      console.log('addedCredentialId: ', addedCredentialId);

      // Step 2: Register credential on chaim (stamp)

      const stampTx = await Issuer.stampCredential(issuedCredential);
      console.log('stampTx: ', stampTx);
    }
  }

  async function handleBecomeIssuer() {
    console.log('Requesting Issuer stamp', { type: 'issuer' });

    // Step 1-A:  Get credential from Issuer based on claim:

    //connect Ethereum wallet
    const { address, wallet, ethProvider } = await connectWeb3();

    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider: ethProvider.provider,
      address
    });

    const did = await Issuer.connect();
    console.log(did);

    const claimValue = {
      did: did,
      ethereumAddress: address,
      entity: 'Krebit',
      description: 'Krebit verification node for Twitter Credentials',
      imageIpfs: 'ipfs://twitter-logo.png',
      verificationUrl: 'http://127.0.0.1:3000/twitter',
      credentialType: 'twitter',
      credentialSchema: 'ceramic://twitter',
      price: 0.01, // Native token
      expirationPolicy: '1 year',
      proofs: {}
    };

    //Issue self-signed credential claiming the veriff
    const claim = await getClaim(claimValue);
    console.log('claim: ', claim);
    const claimedCredential = await Issuer.issue(claim);
    console.log('claimedCredential: ', claimedCredential);
    //Optional: save claimedCredential (ask the user if they want to)
    //await passport.addClaimed(claimedCredential)

    // Step 1-B: Send self-signed credential to the Issuer for verification

    const issuedCredential = await getCredential({
      verifyUrl: 'http://localhost:4000/issuer',
      claimedCredential
    });

    console.log('issuedCredential: ', issuedCredential);

    // Step 1-C: Get the verifiable credential, and save it to the passport
    if (issuedCredential) {
      const passport = new krebit.core.Passport({
        ethProvider: ethProvider.provider,
        address
      });
      await passport.connect();
      const addedCredentialId = await passport.addCredential(issuedCredential);
      console.log('addedCredentialId: ', addedCredentialId);

      // Step 2: Register credential on chaim (stamp)

      const stampTx = await Issuer.stampCredential(issuedCredential);
      console.log('stampTx: ', stampTx);
    }
  }

  async function getStamps(): Promise<void> {
    //connect Ethereum wallet
    const { address, wallet, ethProvider } = await connectWeb3();
    const passport = new krebit.core.Passport();
    passport.read(address, `did:pkh:eip155:80001:${address}`);
    const profile = await passport.getProfile();
    console.log('profile: ', profile);
    const credentials = await passport.getCredentials();
    console.log('credentials: ', credentials);
    const reputation = await passport.getReputation();
    console.log('reputation: ', reputation);

    const stamps = await passport.getStamps({ first: 10, type: 'issuer' });
    console.log('stamps: ', stamps);
  }

  async function getIssuers(): Promise<void> {
    //connect Ethereum wallet
    const { address, wallet, ethProvider } = await connectWeb3();

    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider: ethProvider.provider,
      address
    });

    //const did = await Issuer.connect();
    const issuers = await Issuer.getIssuers({ first: 10, type: 'twitter' });
    console.log('issuers: ', issuers);
  }

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 onClick={() => getIssuers()} style={{ color: 'white' }}>
        Get Issuers
      </h1>
      <br />
      <h1 onClick={() => handleBecomeIssuer()} style={{ color: 'white' }}>
        Become an Issuer
      </h1>{' '}
      <br />
      <h1 onClick={() => handleDelegateIssuer()} style={{ color: 'white' }}>
        Delegate another Issuer
      </h1>{' '}
      <br />
      <h1 onClick={() => getStamps()} style={{ color: 'white' }}>
        Get Stamps
      </h1>
    </>
  );
};

export default IndexPage;
