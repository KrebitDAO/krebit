import { ChangeEvent, useEffect, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

import {
  getCredential,
  generateUID,
  sortByDate,
  getWalletInformation
} from 'utils';
import { debounce } from 'ts-debounce';

interface IClaimValues {
  countryCode: string;
  number: string;
}

const DEFAULT_PHONE_NODE = 'http://localhost:4000/phone';
const issuerAddres = '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860';

export const usePhoneProvider = () => {
  const [verificationId, setVerificationId] = useState('');
  const [claimValues, setClaimValues] = useState<IClaimValues>({
    countryCode: '',
    number: ''
  });
  const [status, setStatus] = useState('idle');

  const getClaim = async (address: string, issuerAddres: string) => {
    const expirationDate = new Date();
    const expiresSeconds = 300;
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresSeconds);
    console.log('expirationDate: ', expirationDate);

    return {
      id: `phone-${generateUID(10)}`,
      ethereumAddress: address,
      type: 'phoneNumber',
      typeSchema: 'ceramic://...',
      tags: ['phone', 'contact', 'personhood'],
      value: {
        ...claimValues,
        proofs: {
          verificationId: verificationId,
          nonce: `${generateUID(10)}`
        }
      },
      expirationDate: new Date(expirationDate).toISOString(),
      encrypt: 'lit' as 'lit',
      shareEncryptedWith: issuerAddres
    };
  };

  const handleStartVerification = async () => {
    setStatus('pending');

    try {
      // when receiving vseriff oauth response from a spawned child run fetchVerifiableCredential

      console.log('Saving Stamp', { type: 'phoneNumber' });

      const session = window.localStorage.getItem('ceramic-session');
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      const currentType = localStorage.getItem('auth-type');
      const walletInformation = await getWalletInformation(currentType);

      // Step 1-A:  Get credential from Issuer based on claim:
      // Issue self-signed credential claiming the phone
      const claim = await getClaim(walletInformation.address, issuerAddres);
      console.log('claim: ', claim);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk
      });
      await Issuer.connect(currentSession);

      // TODO: in this case, we can encrypt for the issuer too
      const claimedCredential = await Issuer.issue(claim);
      console.log('claimedCredential: ', claimedCredential);

      // Step 1-B: Send self-signed credential to the Issuer for verification

      const result = await getCredential({
        verifyUrl: DEFAULT_PHONE_NODE,
        claimedCredential
      });
      console.log('verificationId: ', result);

      // Step 1-C: Get the verifiable credential, and save it to the passport
      if (result) {
        setVerificationId(result.verificationId);
        setStatus('resolved');
      }
    } catch (error) {
      setStatus('rejected');
    }
  };

  const handleGetCredential = async () => {
    setStatus('pending');

    try {
      const session = window.localStorage.getItem('ceramic-session');
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      const currentType = localStorage.getItem('auth-type');
      const walletInformation = await getWalletInformation(currentType);

      // Step 1-A:  Get credential from Issuer based on claim:
      // Issue self-signed credential claiming the phone
      const claim = await getClaim(walletInformation.address, issuerAddres);
      console.log('claim: ', claim);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk
      });
      await Issuer.connect(currentSession);

      // TODO: in this case, we can encrypt for the issuer too
      const claimedCredential = await Issuer.issue(claim);
      console.log('claimedCredential: ', claimedCredential);

      const passport = new Krebit.core.Passport({
        ...walletInformation
      });
      await passport.connect(currentSession);
      // Save claimedCredential
      if (claimedCredential) {
        const claimedCredentialId = await passport.addClaim(claimedCredential);
        console.log('claimedCredentialId: ', claimedCredentialId);
      }

      // Step 1-B: Send self-signed credential to the Issuer for verification
      const issuedCredential = await getCredential({
        verifyUrl: DEFAULT_PHONE_NODE,
        claimedCredential
      });

      console.log('issuedCredential: ', issuedCredential);

      // Step 1-C: Get the verifiable credential, and save it to the passport
      if (issuedCredential) {
        const addedCredentialId = await passport.addCredential(
          issuedCredential
        );
        console.log('addedCredentialId: ', addedCredentialId);
        setStatus('resolved');
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
      const getLatestPhoneCredential = credentials
        .filter(credential => credential.type.includes('phoneNumber'))
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
        .at(-1);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk
      });
      await Issuer.connect(currentSession);

      const stampTx = await Issuer.stampCredential(getLatestPhoneCredential);
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
    handleStartVerification,
    handleGetCredential,
    handleStampCredential,
    handleClaimValues,
    claimValues,
    status
  };
};
