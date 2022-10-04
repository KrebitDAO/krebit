import { ChangeEvent, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

import {
  getCredential,
  generateUID,
  getIssuers,
  IIsuerParams,
  getWalletInformation
} from 'utils';

interface IClaimValues {
  email: string;
  code: string;
  private: boolean;
}

const { NEXT_PUBLIC_CERAMIC_URL } = process.env;

export const useEmailProvider = () => {
  const [claimValues, setClaimValues] = useState<IClaimValues>({
    email: '',
    code: '',
    private: true
  });
  const [status, setStatus] = useState('idle');
  const [currentVerificationId, setCurrentVerificationId] = useState('');
  const [currentCredential, setCurrentCredential] = useState<
    Object | undefined
  >();
  const [currentStamp, setCurrentStamp] = useState<Object | undefined>();
  const [currentMint, setCurrentMint] = useState<Object | undefined>();
  const [currentIssuer, setCurrentIssuer] = useState<IIsuerParams>();

  const getClaim = async (address: string) => {
    const expirationDate = new Date();
    const expiresYears = 1;
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    return {
      id: `email-${generateUID(10)}`,
      ethereumAddress: address,
      type: currentIssuer.credentialType,
      typeSchema: 'krebit://schemas/digitalProperty',
      tags: ['DigitalProperty', 'Contact', 'Personhood'],
      value: {
        protocol: 'Email',
        host: claimValues.email.split('@')[1],
        username: claimValues.email.split('@')[0],
        proofs: {
          verificationId: currentVerificationId,
          nonce: claimValues.code
        }
      },
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  const handleStartVerification = async (issuer: IIsuerParams) => {
    setCurrentIssuer(issuer);
    setStatus('verification_pending');

    try {
      // when receiving vseriff oauth response from a spawned child run fetchVerifiableCredential
      console.log('Saving Stamp', { type: 'Email' });

      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      const currentType = localStorage.getItem('auth-type');
      const walletInformation = await getWalletInformation(currentType);

      // Step 1-A:  Get credential from Issuer based on claim:
      // Issue self-signed credential claiming the email
      const claim = await getClaim(walletInformation.address);
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

      // Step 1-B: Send self-signed credential to the Issuer for verification

      const result = await getCredential({
        verifyUrl: currentIssuer.verificationUrl,
        claimedCredential
      });
      console.log('verificationId: ', result);

      // Step 1-C: Get the verifiable credential, and save it to the passport
      if (result) {
        setCurrentVerificationId(result.verificationId);
        setStatus('verification_resolved');
      }
    } catch (error) {
      setStatus('verification_rejected');
    }
  };

  const handleGetCredential = async () => {
    setStatus('credential_pending');

    try {
      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      const currentType = localStorage.getItem('auth-type');
      const walletInformation = await getWalletInformation(currentType);

      // Step 1-A:  Get credential from Issuer based on claim:
      // Issue self-signed credential claiming the email
      const claim = await getClaim(walletInformation.address);
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
        const claimedCredentialId = await passport.addClaim(claimedCredential);
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
          /*
          //TODO: Restrict access to my claim again
          await Issuer.removeAllEncryptedCredentialShares(claimedCredentialId);
          console.log(
            'EncryptedCredentialConditions: ',
            await Issuer.getEncryptedCredentialConditions(claimedCredentialId)
          );*/

          setCurrentCredential({
            ...issuedCredential,
            vcId: addedCredentialId
          });
          setStatus('credential_resolved');
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

  return {
    handleStartVerification,
    handleGetCredential,
    handleStampCredential,
    handleClaimValues,
    handleMintCredential,
    claimValues,
    status,
    currentVerificationId,
    currentCredential,
    currentStamp,
    currentMint
  };
};
