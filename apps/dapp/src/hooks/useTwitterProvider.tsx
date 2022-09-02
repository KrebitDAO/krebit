import { useEffect, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';
import { auth } from 'twitter-api-sdk';
import { debounce } from 'ts-debounce';

import {
  generateUID,
  getCredential,
  getWalletInformation,
  openOAuthUrl,
  sortByDate
} from 'utils';

const DEFAULT_TWITTER_NODE = 'http://localhost:4000/twitter';
const authClient = new auth.OAuth2User({
  client_id: process.env.NEXT_PUBLIC_PASSPORT_TWITTER_CLIENT_ID as string,
  callback: process.env.NEXT_PUBLIC_PASSPORT_TWITTER_CALLBACK as string,
  scopes: ['tweet.read', 'users.read']
});

export const useTwitterProvider = () => {
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!window) return;

    const channel = new BroadcastChannel('twitter_oauth_channel');

    const handler = async (msg: MessageEvent) => {
      const asyncFunction = async () =>
        await listenForRedirect(msg?.data?.data);
      const process = debounce(asyncFunction, 300);

      return await process();
    };

    channel.addEventListener('message', handler);

    return () => {
      channel.removeEventListener('message', handler);
      channel.close();
    };
  }, []);

  const handleFetchOAuth = (address: string) => {
    const authUrl = authClient.generateAuthURL({
      state: `twitter-${generateUID(10)}`,
      code_challenge: address,
      code_challenge_method: 'plain'
    });

    openOAuthUrl({
      url: authUrl
    });
  };

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
  const listenForRedirect = async (e: {
    target: string;
    data: { code: string; state: string };
  }) => {
    setStatus('pending');

    try {
      // when receiving Twitter oauth response from a spawned child run fetchVerifiableCredential
      if (e.target === 'twitter') {
        console.log('Saving Stamp', { type: 'twitter', proof: e.data });

        const session = window.localStorage.getItem('ceramic-session');
        const currentSession = JSON.parse(session);

        if (!currentSession) return;

        const currentType = localStorage.getItem('auth-type');
        const walletInformation = await getWalletInformation(currentType);

        // Step 1-A:  Get credential from Issuer based on claim:

        //Issue self-signed credential claiming the Twitter
        const claim = await getClaim(walletInformation.address, e.data);
        console.log('claim: ', claim);

        const Issuer = new Krebit.core.Krebit({
          ...walletInformation,
          litSdk: LitJsSdk
        });

        await Issuer.connect(currentSession);

        const claimedCredential = await Issuer.issue(claim);
        console.log('claimedCredential: ', claimedCredential);
        // Optional: save claimedCredential (ask the user if they want to)
        // await passport.addClaimed(claimedCredential)

        // Step 1-B: Send self-signed credential to the Issuer for verification

        const issuedCredential = await getCredential({
          verifyUrl: DEFAULT_TWITTER_NODE,
          claimedCredential
        });

        // TODO: Array of credentials
        console.log('issuedCredential: ', issuedCredential);

        // Step 1-C: Get the verifiable credential, and save it to the passport
        if (issuedCredential) {
          const passport = new Krebit.core.Passport({
            ...walletInformation
          });
          await passport.connect(currentSession);
          const addedCredentialId = await passport.addCredential(
            issuedCredential
          );
          console.log('addedCredentialId: ', addedCredentialId);

          setStatus('resolved');
        }
      }
    } catch (error) {
      setStatus('rejected');
    }
  };

  const handleStampCredential = async () => {
    try {
      setStatus('pending');

      const session = window.localStorage.getItem('ceramic-session');
      const currentSession = JSON.parse(session);

      const currentType = localStorage.getItem('auth-type');
      const walletInformation = await getWalletInformation(currentType);

      const passport = new Krebit.core.Passport({
        ...walletInformation
      });
      passport.read(
        walletInformation.address,
        `did:pkh:eip155:${
          Krebit.schemas.krbToken[process.env.NEXT_PUBLIC_NETWORK].domain
            .chainId
        }:${walletInformation.address}`
      );

      const credentials = await passport.getCredentials();
      const getLatestTwitterCredential = credentials
        .filter(credential => credential.type.includes('twitter'))
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
        .at(-1);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk
      });
      await Issuer.connect(currentSession);

      const stampTx = await Issuer.stampCredential(getLatestTwitterCredential);
      console.log('stampTx: ', stampTx);

      setStatus('resolved');
    } catch (error) {
      setStatus('rejected');
    }
  };

  return {
    listenForRedirect,
    handleFetchOAuth,
    handleStampCredential,
    status
  };
};
