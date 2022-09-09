import { ChangeEvent, useEffect, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

import {
  getCredential,
  openOAuthUrl,
  getVeriffSession,
  sortByDate,
  getWalletInformation,
  generateUID
} from 'utils';
import { debounce } from 'ts-debounce';

interface IClaimValues {
  firstName: string;
  lastName: string;
}

const { NEXT_PUBLIC_VERIFF_NODE_URL } = process.env;
const { NEXT_PUBLIC_VERIFF_NODE_ADDRESS } = process.env;
const { NEXT_PUBLIC_CERAMIC_URL } = process.env;

export const useVeriffProvider = () => {
  const [veriffSession, setVeriffSession] = useState({});
  const [claimValues, setClaimValues] = useState<IClaimValues>({
    firstName: '',
    lastName: ''
  });
  const [status, setStatus] = useState('idle');
  const [currentCredential, setCurrentCredential] = useState<
    Object | undefined
  >();
  const [currentStamp, setCurrentStamp] = useState<Object | undefined>();

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
    const expiresYears = 1;
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
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
        proofs: {
          ...veriffSession,
          nonce: `${generateUID(10)}`
        }
      },
      expirationDate: new Date(expirationDate).toISOString(),
      encrypt: 'lit' as 'lit',
      shareEncryptedWith: NEXT_PUBLIC_VERIFF_NODE_ADDRESS
    };
  };

  // Listener to watch for oauth redirect response on other windows (on the same host)
  const listenForRedirect = async (e: {
    target: string;
    data: { state: string };
  }) => {
    setStatus('credential_pending');

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
          litSdk: LitJsSdk,
          ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
        });
        await Issuer.connect(currentSession);

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
          const claimedCredentialId = await passport.addClaim(
            claimedCredential
          );
          console.log('claimedCredentialId: ', claimedCredentialId);

          // Step 1-B: Send self-signed credential to the Issuer for verification

          const issuedCredential = await getCredential({
            verifyUrl: NEXT_PUBLIC_VERIFF_NODE_URL,
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
        ...walletInformation,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      passport.read(
        walletInformation.address,
        `did:pkh:eip155:${
          Krebit.schemas.krbToken[process.env.NEXT_PUBLIC_NETWORK]?.domain
            ?.chainId
        }:${walletInformation.address}`
      );

      const credentials = await passport.getCredentials();
      const getLatestVeriffCredential = credentials
        .filter(credential => credential.type.includes('veriff'))
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
        .at(-1);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await Issuer.connect(currentSession);

      const stampTx = await Issuer.stampCredential(getLatestVeriffCredential);
      console.log('stampTx: ', stampTx);

      setCurrentStamp({ transaction: stampTx });
      setStatus('stamp_resolved');
    } catch (error) {
      setStatus('stamp_rejected');
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
    status,
    currentCredential,
    currentStamp
  };
};
