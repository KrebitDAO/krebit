import { ChangeEvent, useEffect, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

import {
  getCredential,
  openOAuthUrl,
  getVeriffSession,
  sortByDate,
  getWalletInformation,
  generateUID,
  IIsuerParams
} from 'utils';
import { debounce } from 'ts-debounce';

interface IClaimValues {
  firstName: string;
  lastName: string;
  private: boolean;
}

const { NEXT_PUBLIC_CERAMIC_URL } = process.env;

const initialState = {
  firstName: '',
  lastName: '',
  private: true
};

export const useVeriffProvider = () => {
  const [veriffSession, setVeriffSession] = useState({});
  const [claimValues, setClaimValues] = useState<IClaimValues>(initialState);
  const [status, setStatus] = useState('idle');
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

  const getClaim = async (address: string, proofs: any) => {
    const expirationDate = new Date();
    const expiresYears = 1;
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    return {
      id: proofs.state,
      ethereumAddress: address,
      type: 'LegalName',
      typeSchema: 'krebit://schemas/legalName',
      tags: ['Veriff', 'KYC', 'Personhood'],
      value: {
        firstName: claimValues.firstName,
        lastName: claimValues.lastName,
        fullName: claimValues.firstName
          .concat(' ')
          .concat(claimValues.lastName),
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

    try {
      // when receiving vseriff oauth response from a spawned child run fetchVerifiableCredential
      if (e.target === 'veriff') {
        console.log('Saving Stamp', { type: 'LegalName', proof: e.data });

        const session = window.localStorage.getItem('did-session');
        const currentSession = JSON.parse(session);

        if (!currentSession) return;

        const currentType = localStorage.getItem('auth-type');
        const walletInformation = await getWalletInformation(currentType);

        // Step 1-A:  Get credential from Issuer based on claim:

        // Issue self-signed credential claiming the veriff
        const claim = await getClaim(walletInformation.address, e.data);
        if (claimValues.private) {
          claim['encrypt'] = 'lit' as 'lit';
          claim['shareEncryptedWith'] = currentIssuer.address;
        }
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
            verifyUrl: currentIssuer.verificationUrl,
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

  const handleStampCredential = async credential => {
    try {
      setStatus('stamp_pending');

      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      const currentType = localStorage.getItem('auth-type');
      const walletInformation = await getWalletInformation(currentType);

      const passport = new Krebit.core.Passport({
        ethProvider: walletInformation.ethProvider,
        address: walletInformation.address,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await passport.read(walletInformation.address);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await Issuer.connect(currentSession);

      const stampTx = await Issuer.stampCredential(credential);
      console.log('stampTx: ', stampTx);

      setCurrentStamp({ transaction: stampTx });
      setStatus('stamp_resolved');
    } catch (error) {
      setStatus('stamp_rejected');
    }
  };

  const handleMintCredential = async credential => {
    try {
      setStatus('mint_pending');

      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      const currentType = localStorage.getItem('auth-type');
      const walletInformation = await getWalletInformation(currentType);

      const passport = new Krebit.core.Passport({
        ...walletInformation,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await passport.read(walletInformation.address);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await Issuer.connect(currentSession);

      const mintTx = await Issuer.mintNFT(credential);
      console.log('mintTx: ', mintTx);

      setCurrentMint({ transaction: mintTx });
      setStatus('mint_resolved');
    } catch (error) {
      setStatus('mint_rejected');
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
  };

  return {
    listenForRedirect,
    handleFetchOAuth,
    handleStampCredential,
    handleMintCredential,
    handleClaimValues,
    handleCleanClaimValues,
    claimValues,
    status,
    currentCredential,
    currentStamp,
    currentMint
  };
};
