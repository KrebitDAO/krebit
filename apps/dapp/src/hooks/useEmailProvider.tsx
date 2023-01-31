import { ChangeEvent, useState, useEffect } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from '@lit-protocol/sdk-browser';

import { getCredential, generateUID, constants } from 'utils';

// types
import { IIssuerParams } from 'utils/getIssuers';
import { IWalletInformation } from 'context';

interface IClaimValues {
  email: string;
  code: string;
  private: boolean;
}

interface IProps {
  walletInformation: IWalletInformation;
}

const { NEXT_PUBLIC_CERAMIC_URL } = process.env;

const initialState = {
  email: '',
  code: '',
  private: true
};

export const useEmailProvider = (props: IProps) => {
  const { walletInformation } = props;
  const [claimValues, setClaimValues] = useState<IClaimValues>(initialState);
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [currentVerificationId, setCurrentVerificationId] = useState('');
  const [currentCredential, setCurrentCredential] = useState<
    Object | undefined
  >();
  const [currentStamp, setCurrentStamp] = useState<Object | undefined>();
  const [currentMint, setCurrentMint] = useState<Object | undefined>();
  const [currentIssuer, setCurrentIssuer] = useState<IIssuerParams>();

  useEffect(() => {
    if (!window) return;

    const web3auth = window
      ? window?.localStorage.getItem('openlogin_store')
      : null;
    const web3authSession = web3auth ? JSON.parse(web3auth) : null;

    setClaimValues({
      ...claimValues,
      email: web3authSession?.email ? web3authSession?.email : ''
    });
  }, []);

  const getClaim = async (
    address: string,
    did: string,
    issuer: IIssuerParams
  ) => {
    const expirationDate = new Date();
    const expiresYears = 1;
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    return {
      id: `email-${generateUID(10)}`,
      did,
      ethereumAddress: address,
      type: issuer.credentialType,
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

  const handleStartVerification = async (issuer: IIssuerParams) => {
    if (!walletInformation) return;

    setCurrentIssuer(issuer);
    setStatus('verification_pending');
    setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

    try {
      // when receiving vseriff oauth response from a spawned child run fetchVerifiableCredential
      console.log('Saving Stamp', { type: 'Email' });

      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await Issuer.connect(currentSession);

      // Step 1-A:  Get credential from Issuer based on claim:
      // Issue self-signed credential claiming the email
      const claim = await getClaim(
        walletInformation.address,
        Issuer.did,
        issuer
      );
      if (claimValues.private) {
        claim['encrypt'] = 'lit' as 'lit';
        claim['shareEncryptedWith'] = issuer.address;
      }
      console.log('claim: ', claim);

      // TODO: in this case, we can encrypt for the issuer too
      const claimedCredential = await Issuer.issue(claim);
      console.log('claimedCredential: ', claimedCredential);

      // Step 1-B: Send self-signed credential to the Issuer for verification
      setStatusMessage(
        constants.DEFAULT_MESSAGES_FOR_PROVIDERS.ISSUER_CONNECTION
      );
      const result = await getCredential({
        verifyUrl: issuer.verificationUrl,
        claimedCredential
      });
      console.log('verificationId: ', result);

      // Step 1-C: Get the verifiable credential, and save it to the passport
      if (result) {
        setCurrentVerificationId(result.verificationId);
        setStatus('verification_resolved');

        setStatusMessage(undefined);
        setErrorMessage(undefined);
      }
    } catch (error) {
      setStatus('verification_rejected');
      setStatusMessage(undefined);
      setErrorMessage(
        constants.DEFAULT_ERROR_MESSAGE_FOR_PROVIDERS.ERROR_CREDENTIAL
      );
    }
  };

  const handleGetCredential = async () => {
    if (!walletInformation) return;

    setStatus('credential_pending');
    setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

    try {
      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await Issuer.connect(currentSession);

      // Step 1-A:  Get credential from Issuer based on claim:
      // Issue self-signed credential claiming the email
      const claim = await getClaim(
        walletInformation.address,
        Issuer.did,
        currentIssuer
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
          setStatusMessage(
            constants.DEFAULT_MESSAGES_FOR_PROVIDERS.ADDING_CREDENTIAL
          );

          const addedCredentialId = await passport.addCredential(
            issuedCredential
          );
          console.log('addedCredentialId: ', addedCredentialId);

          //Restrict access to my claim again
          //TODO: Opt-in
          //await Issuer.removeAllEncryptedCredentialShares(claimedCredentialId);

          setCurrentCredential({
            ...issuedCredential,
            vcId: addedCredentialId
          });
          setStatus('credential_resolved');
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
    handleStartVerification,
    handleGetCredential,
    handleClaimValues,
    handleMintCredential,
    handleCleanClaimValues,
    claimValues,
    status,
    statusMessage,
    errorMessage,
    currentVerificationId,
    currentCredential,
    currentStamp,
    currentMint
  };
};
