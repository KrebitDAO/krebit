import { useEffect, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';
import { debounce } from 'ts-debounce';

import {
  generateUID,
  getCredential,
  getDiscordUser,
  openOAuthUrl,
  sortByDate,
  getWalletInformation
} from 'utils';

const { NEXT_PUBLIC_DISCORD_NODE_URL } = process.env;
const { NEXT_PUBLIC_CERAMIC_URL } = process.env;

export const useDiscordProvider = () => {
  const [status, setStatus] = useState('idle');
  const [currentCredential, setCurrentCredential] = useState<
    Object | undefined
  >();
  const [currentStamp, setCurrentStamp] = useState<Object | undefined>();

  useEffect(() => {
    if (!window) return;

    const channel = new BroadcastChannel('discord_oauth_channel');

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

  const handleFetchOAuth = () => {
    const authUrl = `https://discord.com/api/oauth2/authorize?response_type=token&scope=identify&client_id=${
      process.env.NEXT_PUBLIC_PASSPORT_DISCORD_CLIENT_ID
    }&state=discord-${generateUID(10)}&redirect_uri=${
      process.env.NEXT_PUBLIC_PASSPORT_DISCORD_CALLBACK
    }`;

    openOAuthUrl({
      url: authUrl
    });
  };

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
      type: 'discord',
      typeSchema: 'krebit://schemas/digitalProperty',
      tags: ['digitalProperty', 'social', 'personhood'],
      value: claimValue,
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  // Listener to watch for oauth redirect response on other windows (on the same host)
  const listenForRedirect = async (e: {
    target: string;
    data: { accessToken: string; tokenType: string; state: string };
  }) => {
    setStatus('credential_pending');

    try {
      // when receiving discord oauth response from a spawned child run fetchVerifiableCredential
      if (e.target === 'discord') {
        console.log('Saving Stamp', { type: 'discord', proof: e.data });

        const session = window.localStorage.getItem('ceramic-session');
        const currentSession = JSON.parse(session);

        if (!currentSession) return;

        const currentType = localStorage.getItem('auth-type');
        const walletInformation = await getWalletInformation(currentType);

        // Step 1-A:  Get credential from Issuer based on claim:

        //Get discord user
        const discordUser = await getDiscordUser(e.data);

        //Issue self-signed credential claiming the discord
        const claim = await getClaim(
          walletInformation.address,
          discordUser,
          e.data
        );
        console.log('claim: ', claim);

        const Issuer = new Krebit.core.Krebit({
          ...walletInformation,
          litSdk: LitJsSdk,
          ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
        });
        await Issuer.connect(currentSession);

        const claimedCredential = await Issuer.issue(claim);
        console.log('claimedCredential: ', claimedCredential);

        const passport = new Krebit.core.Passport({
          ...walletInformation,
          ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
        });
        await passport.connect(currentSession);
        // Save claimedCredential
        if (claimedCredential) {
          const claimedCredentialId = await passport.addClaim(
            claimedCredential
          );
          console.log('claimedCredentialId: ', claimedCredentialId);
          // Step 1-B: Send self-signed credential to the Issuer for verification
          const issuedCredential = await getCredential({
            verifyUrl: NEXT_PUBLIC_DISCORD_NODE_URL,
            claimedCredentialId
          });

          console.log('issuedCredential: ', issuedCredential);

          // Step 1-C: Get the verifiable credential, and save it to the passport
          if (issuedCredential) {
            const addedCredentialId = await passport.addCredential(
              issuedCredential
            );
            console.log('addedCredentialId: ', addedCredentialId);

            setCurrentCredential({
              ...issuedCredential,
              vcId: addedCredentialId
            });
            setStatus('credential_resolved');
          }
        }
      }
    } catch (error) {
      setStatus('credential_rejected');
    }
  };

  const handleStampCredential = async () => {
    try {
      setStatus('stamp_pending');

      const session = window.localStorage.getItem('ceramic-session');
      const currentSession = JSON.parse(session);

      const currentType = localStorage.getItem('auth-type');
      const walletInformation = await getWalletInformation(currentType);

      const passport = new Krebit.core.Passport({
        ethProvider: walletInformation.ethProvider,
        address: walletInformation.address,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      passport.read(
        walletInformation.address,
        `did:pkh:eip155:${
          Krebit.schemas.krbToken[process.env.NEXT_PUBLIC_NETWORK]?.domain
            ?.chainId
        }:${walletInformation.address}`
      );

      const credentials = await passport.getCredentials('discord');
      const getLatestDiscordCredential = credentials
        .filter(credential => credential.type.includes('discord'))
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
        .at(-1);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await Issuer.connect(currentSession);

      const stampTx = await Issuer.stampCredential(getLatestDiscordCredential);
      console.log('stampTx: ', stampTx);

      setCurrentStamp({ transaction: stampTx });
      setStatus('stamp_resolved');
    } catch (error) {
      setStatus('stamp_rejected');
    }
  };

  return {
    listenForRedirect,
    handleFetchOAuth,
    handleStampCredential,
    status,
    currentCredential,
    currentStamp
  };
};
