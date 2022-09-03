import {
  ChangeEvent,
  FunctionComponent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import { debounce } from 'ts-debounce';
import { BroadcastChannel } from 'broadcast-channel';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

import { getCredential, generateUID, sortByDate } from 'utils';
import { IWalletInformation } from 'context';

interface IClaimValues {
  countryCode: string;
  number: string;
}

interface IStepsCompleted {
  step3: boolean;
  step4: boolean;
}

interface IComponentProps {
  handleStartVerification: () => void;
  handleGetCredential: () => void;
  handleStampCredential: () => void;
  handleClaimValues: (event: ChangeEvent<HTMLInputElement>) => void;
  claimValues: IClaimValues;
  currentStepsCompleted: IStepsCompleted;
  status?: string;
}

interface IProps extends IWalletInformation {
  component: (props: IComponentProps) => ReactElement;
  stepsCompleted?: IStepsCompleted;
}

const DEFAULT_PHONE_NODE = 'http://localhost:4000/phone';

export const PhoneProvider: FunctionComponent<IProps> = props => {
  const { ethProvider, address, wallet, component, stepsCompleted } = props;
  const [verificationId, setVerificationId] = useState('');
  const [claimValues, setClaimValues] = useState<IClaimValues>({
    countryCode: '',
    number: ''
  });
  const [status, setStatus] = useState('idle');
  const [currentStepsCompleted, setCurrentStepsCompleted] = useState(
    stepsCompleted || {
      step3: false,
      step4: false
    }
  );

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
          verificationId: verificationId
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

      const session = window.localStorage.getItem(
        'krebit.reputation-passport.session'
      );
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      // Step 1-A:  Get credential from Issuer based on claim:
      const issuerAddres = '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860';
      // Issue self-signed credential claiming the phone
      const claim = await getClaim(address, issuerAddres);
      console.log('claim: ', claim);

      const Issuer = new Krebit.core.Krebit({
        wallet,
        ethProvider,
        address,
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
        setCurrentStepsCompleted(prevState => ({
          ...prevState,
          step1: true
        }));
      }
    } catch (error) {
      setStatus('rejected');
    }
  };

  const handleGetCredential = async () => {
    setStatus('pending');

    try {
      const session = window.localStorage.getItem(
        'krebit.reputation-passport.session'
      );
      const currentSession = JSON.parse(session);

      if (!currentSession) return;

      // Step 1-A:  Get credential from Issuer based on claim:
      const issuerAddres = '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860';
      // Issue self-signed credential claiming the phone
      const claim = await getClaim(address, issuerAddres);
      console.log('claim: ', claim);

      const Issuer = new Krebit.core.Krebit({
        wallet,
        ethProvider,
        address,
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
        verifyUrl: DEFAULT_PHONE_NODE,
        claimedCredential
      });

      console.log('issuedCredential: ', issuedCredential);

      // Step 1-C: Get the verifiable credential, and save it to the passport
      if (issuedCredential) {
        const passport = new Krebit.core.Passport({
          ethProvider,
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
    } catch (error) {
      setStatus('rejected');
    }
  };

  const handleStampCredential = async () => {
    try {
      setStatus('pending');

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
      const getLatestVeriffCredential = credentials
        .filter(credential => credential.type.includes('phoneNumber'))
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
        .at(-1);

      const Issuer = new Krebit.core.Krebit({
        wallet,
        ethProvider,
        address,
        litSdk: LitJsSdk
      });
      await Issuer.connect(currentSession);

      const stampTx = await Issuer.stampCredential(getLatestVeriffCredential);
      console.log('stampTx: ', stampTx);

      setStatus('resolved');
      setCurrentStepsCompleted(prevState => ({ ...prevState, step2: true }));
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

  return component({
    handleStartVerification,
    handleGetCredential,
    handleStampCredential,
    handleClaimValues,
    claimValues,
    currentStepsCompleted,
    status
  });
};
