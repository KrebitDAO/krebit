import { useEffect } from 'react';

import krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

import { connectWeb3, generateUID, getCredential } from '../utils';

import { debounce } from 'ts-debounce';
import { BroadcastChannel } from 'broadcast-channel';
import { ethers } from 'ethers';

// Twitter Oauth2
import { Client, auth } from 'twitter-api-sdk';

const authClient = new auth.OAuth2User({
  client_id: process.env.NEXT_PUBLIC_PASSPORT_TWITTER_CLIENT_ID as string,
  callback: process.env.NEXT_PUBLIC_PASSPORT_TWITTER_CALLBACK as string,
  scopes: ['tweet.read', 'users.read']
});

const IndexPage = () => {
  if (typeof window !== 'undefined') {
    // pull any search params
    const queryString = new URLSearchParams(window?.location?.search);
    // Twitter oauth will attach code & state in oauth procedure
    console.log('queryString: ', queryString);
    const [queryError, queryState, queryCode] = [
      queryString.get('error'),
      queryString.get('state'),
      queryString.get('code')
    ];

    // if Twitter oauth then submit message to other windows and close self
    if (
      (queryError || queryCode) &&
      queryState &&
      /^twitter-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel('twitter_oauth_channel');
      // only continue with the process if a code is returned
      if (queryCode) {
        channel.postMessage({
          target: 'twitter',
          data: { code: queryCode, state: queryState }
        });
      }
      // always close the redirected window
      window.close();

      return <div></div>;
    }
  }

  // Fetch Twitter OAuth2 url from the IAM procedure
  async function handleFetchTwitterOAuth(): Promise<void> {
    // open new window for authUrl

    //connect Ethereum wallet
    const { address, wallet, ethProvider } = await connectWeb3();

    const authUrl = authClient.generateAuthURL({
      state: `twitter-${generateUID(10)}`,
      code_challenge: address,
      code_challenge_method: 'plain'
    });
    openOAuthUrl(authUrl);
  }

  // Open Twitter authUrl in centered window
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

  const getClaim = async (address: string, proofs: any) => {
    const claimValue = {
      protocol: 'https',
      host: 'twitter.com',
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
      typeSchema: 'ceramic://...',
      tags: ['twitter', 'social', 'personhood'],
      value: claimValue,
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  // Listener to watch for oauth redirect response on other windows (on the same host)
  async function listenForRedirect(e: {
    target: string;
    data: { code: string; state: string };
  }) {
    // when receiving Twitter oauth response from a spawned child run fetchVerifiableCredential
    if (e.target === 'twitter') {
      console.log('Saving Stamp', { type: 'twitter', proof: e.data });

      // Step 1-A:  Get credential from Issuer based on claim:

      //connect Ethereum wallet
      const { address, wallet, ethProvider } = await connectWeb3();

      //Issue self-signed credential claiming the Twitter
      const claim = await getClaim(address, e.data);
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
        verifyUrl: 'http://localhost:4000/twitter',
        claimedCredential
      });

      // TODO: Array of credentials
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

        // Step 2: Register credential on-chain (stamp) - optional
        const stampTx = await Issuer.stampCredential(issuedCredential);
        console.log('stampTx: ', stampTx);
      }
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

    const stamps = await passport.getStamps(10, 'digitalProperty', null);
    console.log('stamps: ', stamps);
  }

  // attach and destroy a BroadcastChannel to handle the message
  useEffect(() => {
    // open the channel
    const channel = new BroadcastChannel('twitter_oauth_channel');
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
      <h1 onClick={() => handleFetchTwitterOAuth()} style={{ color: 'white' }}>
        Claim Twitter
      </h1>{' '}
      <br />
      <h1 onClick={() => getStamps()} style={{ color: 'white' }}>
        Get Stamps
      </h1>
    </>
  );
};

export default IndexPage;
