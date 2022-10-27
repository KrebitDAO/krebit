import { ChangeEvent, useEffect, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from '@lit-protocol/sdk-browser';
import { debounce } from 'ts-debounce';

import {
  getCredential,
  openOAuthUrl,
  getVeriffSession,
  getWalletInformation,
  generateUID,
  IIsuerParams,
  constants
} from 'utils';
import { format } from 'date-fns';

interface IClaimValues {
  date: string | number;
  private: boolean;
}

const { NEXT_PUBLIC_CERAMIC_URL } = process.env;

const initialState = {
  date: '01/12/2009',
  private: true
};

export const useVeriffAgeProvider = () => {
  const [veriffSession, setVeriffSession] = useState({});
  const [claimValues, setClaimValues] = useState<IClaimValues>(initialState);
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [currentCredential, setCurrentCredential] = useState<
    Object | undefined
  >();
  const [currentStamp, setCurrentStamp] = useState<Object | undefined>();
  const [currentMint, setCurrentMint] = useState<Object | undefined>();
  const [currentIssuer, setCurrentIssuer] = useState<IIsuerParams>();
  const channel = new BroadcastChannel('veriff_oauth_channel');

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

  const handleFetchOAuth = async (address: string, issuer: IIsuerParams) => {
    setCurrentIssuer(issuer);
    const veriff = await getVeriffSession({
      verification: {
        callback: `${
          process.env.NEXT_PUBLIC_VERIFF_CALLBACK
        }?status=veriffAgeGT18-${generateUID(10)}`,
        timestamp: new Date().toISOString()
      }
    });

    setVeriffSession(veriff);
    openOAuthUrl({
      url: veriff.url
    });
  };

  const getClaim = async (address: string, did: string, proofs: any) => {
    const expirationDate = new Date();
    const expiresYears = 1;
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    return {
      id: proofs.state,
      did,
      ethereumAddress: address,
      type: 'AgeGT18',
      typeSchema: 'krebit://schemas/birthDate',
      tags: ['VeriffAgeGT18', 'KYC', 'Adulthood', 'Age', 'Personhood'],
      value: {
        date: format(new Date(claimValues.date), 'yyyy-MM-dd'),
        proofs: {
          ...veriffSession,
          nonce: `${generateUID(10)}`
        }
      },
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  // Listener to watch for oauth redirect response on other windows (on the same host)
  const listenForRedirect = async (e: {
    target: string;
    data: { state: string };
  }) => {
    setStatus('credential_pending');
    setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

    try {
      // when receiving vseriff oauth response from a spawned child run fetchVerifiableCredential
      if (e.target === 'VeriffAgeGT18') {
        console.log('Saving Stamp', { type: 'AgeGT18', proof: e.data });

        const session = window.localStorage.getItem('did-session');
        const currentSession = JSON.parse(session);

        if (!currentSession) return;

        const currentType = localStorage.getItem('auth-type');
        const walletInformation = await getWalletInformation(currentType);

        const Issuer = new Krebit.core.Krebit({
          ...walletInformation,
          litSdk: LitJsSdk,
          ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
        });
        await Issuer.connect(currentSession);

        // Step 1-A:  Get credential from Issuer based on claim:

        // Issue self-signed credential claiming the veriff
        const claim = await getClaim(
          walletInformation.address,
          Issuer.did,
          e.data
        );
        if (claimValues.private) {
          claim['encrypt'] = 'lit' as 'lit';
          claim['shareEncryptedWith'] = currentIssuer.address;
        }
        console.log('claim: ', claim);

        // TODO: in this case, we can encrypt for the issuer too
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
      setStatus('mint_pending');
      setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      const currentType = localStorage.getItem('auth-type');
      const walletInformation = await getWalletInformation(currentType);

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
