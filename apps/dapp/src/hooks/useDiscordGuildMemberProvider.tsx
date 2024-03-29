import { ChangeEvent, useEffect, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from '@lit-protocol/sdk-browser';
import { debounce } from 'ts-debounce';

import {
  generateUID,
  getCredential,
  openOAuthUrl,
  getDiscordUser,
  constants
} from 'utils';

// types
import { IIssuerParams } from 'utils/getIssuers';
import { IWalletInformation } from 'context';

interface IClaimValues {
  guildId: string;
  private: boolean;
}

interface IProps {
  walletInformation: IWalletInformation;
}

const { NEXT_PUBLIC_CERAMIC_URL } = process.env;

const initialState = {
  guildId: '',
  private: true
};

export const useDiscordGuildMemberProvider = (props: IProps) => {
  const { walletInformation } = props;
  const [claimValues, setClaimValues] = useState<IClaimValues>(initialState);
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [currentCredential, setCurrentCredential] = useState<
    Object | undefined
  >();
  const [currentStamp, setCurrentStamp] = useState<Object | undefined>();
  const [currentMint, setCurrentMint] = useState<Object | undefined>();
  const [currentIssuer, setCurrentIssuer] = useState<IIssuerParams>();
  const channel = new BroadcastChannel('discord_oauth_channel');

  useEffect(() => {
    if (!window) return;

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
  }, [channel]);

  const handleFetchOAuth = (issuer: IIssuerParams) => {
    setCurrentIssuer(issuer);
    const state = `discordGuildMember-${generateUID(10)}`;

    const authUrl = `https://discord.com/api/oauth2/authorize?response_type=token&scope=identify%20guilds%20guilds.members.read&client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&state=${state}&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_CALLBACK}`;

    openOAuthUrl({
      url: authUrl
    });
  };

  const getClaim = (
    address: string,
    did: string,
    payload: any,
    proofs: any
  ) => {
    const claimValue = {
      name: 'Discord Guild Member', //TODO take this from getIssuers()
      entity: claimValues.guildId,
      proofs: {
        ...proofs,
        memberId: payload.id,
        guildId: claimValues.guildId
      }
    };

    const expirationDate = new Date();
    const expiresSeconds = 300;
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresSeconds);
    console.log('expirationDate: ', expirationDate);

    return {
      id: proofs.state,
      did,
      ethereumAddress: address,
      type: currentIssuer.credentialType,
      typeSchema: 'krebit://schemas/badge',
      tags: ['Community', 'Membership'],
      value: claimValue,
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  // Listener to watch for oauth redirect response on other windows (on the same host)
  const listenForRedirect = async (e: {
    target: string;
    data: { accessToken: string; tokenType: string; state: string };
  }) => {
    if (!walletInformation) return;

    setStatus('credential_pending');
    setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

    try {
      // when receiving Twitter oauth response from a spawned child run fetchVerifiableCredential
      if (e.target === 'DiscordGuildMember') {
        console.log('Saving Stamp', {
          type: 'DiscordGuildMember',
          proof: e.data
        });

        const session = window.localStorage.getItem('did-session');
        const currentSession = JSON.parse(session);

        if (!currentSession) return;

        // Step 1-A:  Get credential from Issuer based on claim:

        //Get discord user
        const discordUser = await getDiscordUser(e.data);

        const Issuer = new Krebit.core.Krebit({
          ...walletInformation,
          litSdk: LitJsSdk,
          ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
        });
        await Issuer.connect(currentSession);

        //Issue self-signed credential claiming the discord guild
        const claim = getClaim(
          walletInformation.address,
          Issuer.did,
          discordUser,
          e.data
        );
        if (claimValues.private) {
          claim['encrypt'] = 'lit' as 'lit';
          claim['shareEncryptedWith'] = currentIssuer.address;
        }
        console.log('claim: ', claim);

        const claimedCredential = await Issuer.issue(claim);
        console.log('claimedCredential: ', claimedCredential);

        const passport = new Krebit.core.Passport({
          ...walletInformation,
          ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
        });
        await passport.connect(currentSession);

        // Save claimedCredential
        if (claimedCredential) {
          setStatusMessage(
            constants.DEFAULT_MESSAGES_FOR_PROVIDERS.SAVING_CLAIMED_CREDENTIAL
          );

          const claimedCredentialId = await passport.addClaim(
            claimedCredential
          );
          console.log('claimedCredentialId: ', claimedCredentialId);

          setStatusMessage(
            constants.DEFAULT_MESSAGES_FOR_PROVIDERS.ISSUING_CREDENTIAL
          );

          // Step 1-B: Send self-signed credential to the Issuer for verification
          const issuedCredential = await getCredential({
            verifyUrl: currentIssuer.verificationUrl,
            claimedCredentialId
          });
          console.log('issuedCredential: ', issuedCredential);

          // Step 1-C: Get the verifiable credential, and save it to the passport
          if (issuedCredential) {
            setStatusMessage(
              constants.DEFAULT_MESSAGES_FOR_PROVIDERS.ADDING_CREDENTIAL
            );

            const addedCredentialId = await passport.addCredential(
              issuedCredential
            );
            console.log('addedCredentialId: ', addedCredentialId);

            //Restrict access to my claim again
            await Issuer.removeAllEncryptedCredentialShares(
              claimedCredentialId
            );

            setCurrentCredential({
              ...issuedCredential,
              vcId: addedCredentialId
            });
            setStatus('credential_resolved');
            setStatusMessage(undefined);
            setErrorMessage(undefined);
          }
        }
      }
    } catch (error) {
      setStatus('credential_rejected');
      setStatusMessage(undefined);
      setErrorMessage(
        constants.DEFAULT_ERROR_MESSAGE_FOR_PROVIDERS.ERROR_CREDENTIAL
      );
    }
  };

  const handleMintCredential = async credential => {
    try {
      if (!walletInformation) return;

      setStatus('mint_pending');
      setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await Issuer.connect(currentSession);

      setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.MINTING_NFT);

      const mintTx = await Issuer.mintCredentialNFT(credential);
      console.log('mintTx: ', mintTx);

      setCurrentMint({ transaction: mintTx });
      setStatus('mint_resolved');
      setStatusMessage(undefined);
      setErrorMessage(undefined);
    } catch (error) {
      setStatus('mint_rejected');
      setStatusMessage(undefined);
      setErrorMessage(
        constants.DEFAULT_ERROR_MESSAGE_FOR_PROVIDERS.ERROR_CREDENTIAL
      );
    }
  };

  const handleClaimValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setClaimValues(prevValues => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCleanClaimValues = () => {
    setClaimValues(initialState);
    setStatus('idle');
    setStatusMessage(undefined);
    setErrorMessage(undefined);
  };

  return {
    listenForRedirect,
    handleFetchOAuth,
    handleClaimValues,
    handleMintCredential,
    handleCleanClaimValues,
    claimValues,
    status,
    statusMessage,
    errorMessage,
    currentCredential,
    currentStamp,
    currentMint
  };
};
