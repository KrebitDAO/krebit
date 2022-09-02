import { ChangeEvent, useEffect, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

import {
  getCredential,
  openOAuthUrl,
  getVeriffSession,
  sortByDate,
  getWalletInformation
} from 'utils';
import { debounce } from 'ts-debounce';

interface IClaimValues {
  firstName: string;
  lastName: string;
}

const DEFAULT_VERIFF_NODE = 'http://localhost:4000/veriff';

export const useVeriffProvider = () => {
  const [veriffSession, setVeriffSession] = useState({});
  const [claimValues, setClaimValues] = useState<IClaimValues>({
    firstName: '',
    lastName: ''
  });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!window) return;

    const channel = new BroadcastChannel('veriff_oauth_channel');

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

  const handleFetchOAuth = async (address: string) => {
    const veriff = await getVeriffSession({
      verification: {
        person: {
          ...claimValues
        },
        vendorData: address,
        timestamp: new Date().toISOString()
      }
    });

    setVeriffSession(veriff);
    openOAuthUrl({
      url: veriff.url
    });
  };

  const getClaim = async (address: string, payload: any, proofs: any) => {
    const expirationDate = new Date();
    const expiresSeconds = 300;
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresSeconds);
    console.log('expirationDate: ', expirationDate);

    return {
      id: payload.id,
      ethereumAddress: address,
      type: 'legalName',
      typeSchema: 'ceramic://...',
      tags: ['veriff', 'fullName', 'kyc', 'personhood'],
      value: {
        person: {
          ...claimValues
        },
        proofs: veriffSession
      },
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  // Listener to watch for oauth redirect response on other windows (on the same host)
  const listenForRedirect = async (e: {
    target: string;
    data: { state: string };
  }) => {
    setStatus('pending');

    try {
      // when receiving vseriff oauth response from a spawned child run fetchVerifiableCredential
      if (e.target === 'veriff') {
        console.log('Saving Stamp', { type: 'veriff', proof: e.data });

        const session = window.localStorage.getItem('ceramic-session');
        const currentSession = JSON.parse(session);

        if (!currentSession) return;

        const currentType = localStorage.getItem('auth-type');
        const walletInformation = await getWalletInformation(currentType);

        // Step 1-A:  Get credential from Issuer based on claim:

        // Issue self-signed credential claiming the veriff
        const claim = await getClaim(
          walletInformation.address,
          veriffSession,
          e.data
        );
        console.log('claim: ', claim);

        const Issuer = new Krebit.core.Krebit({
          ...walletInformation,
          litSdk: LitJsSdk
        });
        await Issuer.connect(currentSession);

        // TODO: in this case, we can encrypt for the issuer too
        const claimedCredential = await Issuer.issue(claim);
        console.log('claimedCredential: ', claimedCredential);
        // Optional: save claimedCredential (ask the user if they want to)
        // await passport.addClaimed(claimedCredential)

        // Step 1-B: Send self-signed credential to the Issuer for verification

        const issuedCredential = await getCredential({
          verifyUrl: DEFAULT_VERIFF_NODE,
          claimedCredential
        });

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
      const getLatestVeriffCredential = credentials
        .filter(credential => credential.type.includes('veriff'))
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
        .at(-1);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk
      });
      await Issuer.connect(currentSession);

      const stampTx = await Issuer.stampCredential(getLatestVeriffCredential);
      console.log('stampTx: ', stampTx);

      setStatus('resolved');
    } catch (error) {
      setStatus('rejected');
    }
  };

  const handleClaimValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setClaimValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  return {
    listenForRedirect,
    handleFetchOAuth,
    handleStampCredential,
    handleClaimValues,
    claimValues,
    status
  };
};
