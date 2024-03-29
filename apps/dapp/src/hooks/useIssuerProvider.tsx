import { ChangeEvent, useState, useEffect, useContext } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from '@lit-protocol/sdk-browser';

import { getCredential, generateUID, constants, sendNotification } from 'utils';
import { GeneralContext, IWalletInformation } from 'context';

// types
import { IIssuerParams } from 'utils/getIssuers';

interface IClaimValues {
  email: string;
  entity: string;
  description: string;
  credentialType: string;
  credentialSchema: string;
  imageUrl: string;
  verificationUrl: string;
  did: string;
  ethereumAddress: string;
  expirationMonths: number;
  price: number;
}

interface IProps {
  walletInformation: IWalletInformation;
}

const { NEXT_PUBLIC_CERAMIC_URL } = process.env;
const { NEXT_PUBLIC_ISSUER_NODE_URL } = process.env;

const initialState = {
  email: '',
  entity: '',
  description: '',
  credentialType: '',
  credentialSchema: '',
  imageUrl: '',
  verificationUrl: '',
  did: '',
  ethereumAddress: '',
  expirationMonths: 12,
  price: 0.0
};

export const useIssuerProvider = (props: IProps) => {
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
  const {
    auth,
    walletInformation: { orbis },
    profileInformation: { profile }
  } = useContext(GeneralContext);

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
    typeSchemaUrl: string
  ) => {
    const expirationDate = new Date();
    const expiresYears = 1;
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    return {
      id: `issuer-${generateUID(10)}`,
      did,
      ethereumAddress: address,
      type: 'Issuer',
      typeSchema: typeSchemaUrl,
      tags: [claimValues.credentialType],
      value: claimValues,
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  const handleGetCredential = async () => {
    if (!walletInformation) return;

    setStatus('credential_pending');
    setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

    try {
      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      // Step 1-A:  Get credential from Master Issuer based on claim:
      // Issue self-signed credential to become an Issuer

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await Issuer.connect(currentSession);

      let typeSchemaUrl = await Issuer.getTypeSchema('Issuer');
      if (!typeSchemaUrl) {
        const issuerSchema = Krebit.schemas.claims.issuer;
        typeSchemaUrl = await Issuer.setTypeSchema('Issuer', issuerSchema);
      }

      const claim = await getClaim(
        walletInformation.address,
        Issuer.did,
        typeSchemaUrl
      );
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
          await Issuer.removeAllEncryptedCredentialShares(claimedCredentialId);

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

  const handleClaimCredential = async delegatedCredential => {
    if (!walletInformation) return;

    // If the wallet owner is equal to credentialSubject?.ethereumAddress
    // It means that the only one who can claim this credential is the owner
    if (
      delegatedCredential?.value?.issueTo?.length === 1 &&
      walletInformation?.address?.toLowerCase() ===
        delegatedCredential?.credentialSubject?.ethereumAddress
    ) {
      await handleAddCredential(delegatedCredential);
      return;
    }

    setStatus('credential_pending');
    setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

    await sendNotification({
      orbis,
      authenticatedDID: auth.did,
      body: {
        subject: `${profile?.name} has claimed a credential`,
        content: `${profile?.name} has claimed a credential of type ${delegatedCredential?.visualInformation?.credentialType} from you! The credential is ${delegatedCredential?.visualInformation?.metadata?.title}`,
        recipients: [delegatedCredential?.issuer?.ethereumAddress]
      }
    });

    delete delegatedCredential.credential;
    delete delegatedCredential.value;
    delete delegatedCredential.visualInformation;
    console.log('delegatedCredential', delegatedCredential);

    try {
      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      const passport = new Krebit.core.Passport({
        ...walletInformation,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await passport.connect(currentSession);
      // Save claimedCredential
      if (delegatedCredential) {
        setStatusMessage(
          constants.DEFAULT_MESSAGES_FOR_PROVIDERS.SAVING_CLAIMED_CREDENTIAL
        );

        // Step 1-B: Send self-signed credential to the Issuer for verification
        const issuedCredential = await getCredential({
          verifyUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
          claimedCredential: delegatedCredential,
          credentialSubjectAddress: walletInformation.address,
          credentialSubjectAddressDID: passport.did,
          credentialSubjectEmail: claimValues.email
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

  const handleAddCredential = async receivedCredential => {
    if (!walletInformation) return;

    const isValid = Boolean(
      walletInformation.address.toLowerCase() ==
        receivedCredential?.credentialSubject?.ethereumAddress
    );

    if (!isValid) return;

    setStatus('credential_pending');
    setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

    await sendNotification({
      orbis,
      authenticatedDID: auth.did,
      body: {
        subject: `${profile?.name} has claimed a credential`,
        content: `${profile?.name} has claimed a credential of type ${receivedCredential?.visualInformation?.credentialType} from you! The credential is ${receivedCredential?.visualInformation?.metadata?.title}`,
        recipients: [receivedCredential?.issuer?.ethereumAddress]
      }
    });

    delete receivedCredential.credential;
    delete receivedCredential.value;
    delete receivedCredential.visualInformation;
    console.log('receivedCredential', receivedCredential);

    try {
      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      const passport = new Krebit.core.Passport({
        ...walletInformation,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await passport.connect(currentSession);
      // Save claimedCredential
      if (receivedCredential) {
        setStatusMessage(
          constants.DEFAULT_MESSAGES_FOR_PROVIDERS.SAVING_CLAIMED_CREDENTIAL
        );

        setStatusMessage(
          constants.DEFAULT_MESSAGES_FOR_PROVIDERS.ADDING_CREDENTIAL
        );
        const addedCredentialId = await passport.addCredential(
          receivedCredential
        );
        console.log('addedCredentialId: ', addedCredentialId);

        setCurrentCredential({
          ...receivedCredential,
          vcId: addedCredentialId
        });
        setStatus('credential_resolved');
      }
    } catch (error) {
      console.log('Error handleAddCredential: ', error);
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
      console.error('Error handleMintCredential: ', error);
      setStatus('mint_rejected');
      setStatusMessage(undefined);
      setErrorMessage(
        constants.DEFAULT_ERROR_MESSAGE_FOR_PROVIDERS.ERROR_MINT.concat(
          ' Error:' + error.message
        )
      );
    }
  };

  const handleClaimValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setClaimValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleCleanClaimValues = () => {
    // setClaimValues(initialState);
    setStatus('idle');
    setStatusMessage(undefined);
    setErrorMessage(undefined);
  };

  return {
    handleGetCredential,
    handleClaimCredential,
    handleClaimValues,
    handleMintCredential,
    handleCleanClaimValues,
    handleAddCredential,
    claimValues,
    status,
    statusMessage,
    errorMessage,
    currentCredential,
    currentStamp,
    currentMint
  };
};
