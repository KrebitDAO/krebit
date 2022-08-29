import { useEffect } from 'react';

import krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

import {
  connectWeb3,
  generateUID,
  getDiscordUser,
  getCredential
} from '../utils';

import { debounce } from 'ts-debounce';
import { BroadcastChannel } from 'broadcast-channel';
import { ethers } from 'ethers';

const IndexPage = () => {
  if (typeof window !== 'undefined') {
    // pull any search params
    const queryString = new URLSearchParams(window?.location?.hash);
    // Twitter oauth will attach code & state in oauth procedure
    //console.log('queryString: ', queryString);
    const [queryError, queryState, accessToken, tokenType] = [
      queryString.get('error'),
      queryString.get('state'),
      queryString.get('access_token'),
      queryString.get('#token_type')
    ];

    // if Discord oauth then submit message to other windows and close self
    if (
      (queryError || accessToken) &&
      queryState &&
      /^discord-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel('discord_oauth_channel');
      // only continue with the process if a code is returned
      if (accessToken) {
        channel.postMessage({
          target: 'discord',
          data: { accessToken, tokenType, state: queryState }
        });
      }
      // always close the redirected window
      window.close();

      return <div></div>;
    }
  }

  // Fetch Discord OAuth2 url from the IAM procedure
  async function handleFetchDiscordOAuth(): Promise<void> {
    // open new window for authUrl
    const authUrl = `https://discord.com/api/oauth2/authorize?response_type=token&scope=identify&client_id=${
      process.env.NEXT_PUBLIC_PASSPORT_DISCORD_CLIENT_ID
    }&state=discord-${generateUID(10)}&redirect_uri=${
      process.env.NEXT_PUBLIC_PASSPORT_DISCORD_CALLBACK
    }`;
    openOAuthUrl(authUrl);
  }

  // Open Discord authUrl in centered window
  function openOAuthUrl(url: string): void {
    const width = 600;
    const height = 800;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    // Pass data to the page via props
    window.open(
      url,
      '_blank',
      'toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left
    );
  }

  const getClaim = async (address: string, payload: any, proofs: any) => {
    const claimValue = {
      protocol: 'https',
      host: 'discord.com',
      id: payload.id,
      proofs
    };

    const expirationDate = new Date();
    const expiresSeconds = 300;
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresSeconds);
    console.log('expirationDate: ', expirationDate);

    return {
      id: proofs.state,
      ethereumAddress: address,
      type: 'digitalProperty',
      typeSchema: 'digitalProperty',
      tags: ['discord', 'social', 'personhood'],
      value: claimValue,
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  // Listener to watch for oauth redirect response on other windows (on the same host)
  async function listenForRedirect(e: {
    target: string;
    data: { accessToken: string; tokenType: string; state: string };
  }) {
    // when receiving discord oauth response from a spawned child run fetchVerifiableCredential
    if (e.target === 'discord') {
      console.log('Saving Stamp', { type: 'discord', proof: e.data });

      // Step 1-A:  Get credential from Issuer based on claim:

      //Get discord user
      const discordUser = await getDiscordUser(e.data);

      //connect Ethereum wallet
      const { address, wallet, ethProvider } = await connectWeb3();

      //Issue self-signed credential claiming the discord
      const claim = await getClaim(address, discordUser, e.data);
      console.log('claim: ', claim);

      const Issuer = new krebit.core.Krebit({
        wallet,
        ethProvider: ethProvider.provider,
        address,
        litSdk: LitJsSdk
      });

      const did = await Issuer.connect();
      console.log(did);

      const claimedCredential = await Issuer.issue(claim);
      console.log('claimedCredential: ', claimedCredential);
      //Optional: save claimedCredential (ask the user if they want to)
      //await passport.addClaimed(claimedCredential)

      // Step 1-B: Send self-signed credential to the Issuer for verification

      const issuedCredential = await getCredential({
        verifyUrl: 'http://localhost:4000/discord',
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
        const addedCredentialId = await passport.addCredential(
          issuedCredential
        );
        console.log('addedCredentialId: ', addedCredentialId);

        // Step 2: Register credential on chaim (stamp)

        const stampTx = await Issuer.stampCredential(issuedCredential);
        console.log('stampTx: ', stampTx);
      }
    }
  }

  // THIS IS WHAT WE NEED TO getData() in Username:
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

    const stamps = await passport.getStamps({
      first: 10,
      type: 'digitalProperty'
    });
    console.log('stamps: ', stamps);
  }

  // attach and destroy a BroadcastChannel to handle the message
  useEffect(() => {
    // open the channel
    const channel = new BroadcastChannel('discord_oauth_channel');
    // event handler will listen for messages from the child (debounced to avoid multiple submissions)
    channel.onmessage = debounce(listenForRedirect, 300);

    return () => {
      channel.close();
    };
  });

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
      <h1 onClick={() => handleFetchDiscordOAuth()} style={{ color: 'white' }}>
        Claim Discord
      </h1>{' '}
      <br />
      <h1 onClick={() => getStamps()} style={{ color: 'white' }}>
        Get Stamps
      </h1>
    </>
  );
};

export default IndexPage;
