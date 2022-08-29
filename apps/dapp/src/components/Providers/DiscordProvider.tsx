import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { debounce } from 'ts-debounce';
import { BroadcastChannel } from 'broadcast-channel';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

import {
  generateUID,
  getCredential,
  getDiscordUser,
  openOAuthUrl,
  sortByDate
} from 'utils';
import { IWalletInformation } from 'context';

interface IStepsCompleted {
  step1: boolean;
  step2: boolean;
}

interface IComponentProps {
  handleFetchOAuth: () => void;
  handleStampCredential: () => void;
  currentStepsCompleted: IStepsCompleted;
  status?: string;
}

interface IProps extends IWalletInformation {
  component: (props: IComponentProps) => ReactElement;
  stepsCompleted?: IStepsCompleted;
}

const DEFAULT_DISCORD_NODE = 'http://localhost:4000/discord';

export const DiscordProvider: FunctionComponent<IProps> = props => {
  const { ethProvider, address, wallet, component, stepsCompleted } = props;
  const [status, setStatus] = useState('idle');
  const [currentStepsCompleted, setCurrentStepsCompleted] = useState(
    stepsCompleted || {
      step1: false,
      step2: false
    }
  );

  useEffect(() => {
    if (!window) return;

    const queryString = new URLSearchParams(window?.location?.hash);

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
    }
  }, []);

  // attach and destroy a BroadcastChannel to handle the message
  useEffect(() => {
    if (!window) return;

    // open the channel
    const channel = new BroadcastChannel('discord_oauth_channel');
    // event handler will listen for messages from the child (debounced to avoid multiple submissions)
    channel.onmessage = debounce(listenForRedirect, 300);

    return () => {
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
      type: 'digitalProperty',
      typeSchema: 'digitalProperty',
      tags: ['discord', 'social', 'personhood'],
      value: claimValue,
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  // Listener to watch for oauth redirect response on other windows (on the same host)
  const listenForRedirect = async (e: {
    target: string;
    data: { accessToken: string; tokenType: string; state: string };
  }) => {
    setStatus('pending');

    try {
      // when receiving discord oauth response from a spawned child run fetchVerifiableCredential
      if (e.target === 'discord') {
        console.log('Saving Stamp', { type: 'discord', proof: e.data });

        const session = window.localStorage.getItem(
          'krebit.reputation-passport.session'
        );
        const currentSession = session ? JSON.parse(session) : null;

        // Step 1-A:  Get credential from Issuer based on claim:

        //Get discord user
        const discordUser = await getDiscordUser(e.data);

        //Issue self-signed credential claiming the discord
        const claim = await getClaim(address, discordUser, e.data);
        console.log('claim: ', claim);

        const Issuer = new Krebit.core.Krebit({
          wallet,
          ethProvider,
          address,
          litSdk: LitJsSdk
        });
        await Issuer.connect(currentSession);

        const claimedCredential = await Issuer.issue(claim);
        console.log('claimedCredential: ', claimedCredential);
        // Optional: save claimedCredential (ask the user if they want to)
        // await passport.addClaimed(claimedCredential)

        // Step 1-B: Send self-signed credential to the Issuer for verification

        const issuedCredential = await getCredential({
          verifyUrl: DEFAULT_DISCORD_NODE,
          claimedCredential
        });

        console.log('issuedCredential: ', issuedCredential);

        // Step 1-C: Get the verifiable credential, and save it to the passport
        if (issuedCredential) {
          const passport = new Krebit.core.Passport({
            ethProvider: ethProvider,
            address
          });
          await passport.connect(currentSession);
          const addedCredentialId = await passport.addCredential(
            issuedCredential
          );
          console.log('addedCredentialId: ', addedCredentialId);

          setStatus('resolved');
          setCurrentStepsCompleted(prevState => ({
            ...prevState,
            step1: true
          }));
        }
      }
    } catch (error) {
      setStatus('rejected');
    }
  };

  const handleStampCredential = async () => {
    try {
      const session = window.localStorage.getItem(
        'krebit.reputation-passport.session'
      );
      const currentSession = JSON.parse(session);

      const passport = new Krebit.core.Passport({
        ethProvider: ethProvider,
        address
      });
      passport.read(address, `did:pkh:eip155:80001:${address}`);

      const credentials = await passport.getCredentials();
      const getLatestDiscordCredential = credentials
        .filter(credential => credential.type.includes('discord'))
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
        .at(-1);

      const Issuer = new Krebit.core.Krebit({
        wallet,
        ethProvider,
        address,
        litSdk: LitJsSdk
      });
      await Issuer.connect(currentSession);

      const stampTx = await Issuer.stampCredential(getLatestDiscordCredential);
      console.log('stampTx: ', stampTx);

      setStatus('resolved');
      setCurrentStepsCompleted(prevState => ({ ...prevState, step2: true }));
    } catch (error) {
      setStatus('rejected');
    }
  };

  return component({
    handleFetchOAuth,
    handleStampCredential,
    currentStepsCompleted,
    status
  });
};
