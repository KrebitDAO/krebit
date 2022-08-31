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

import {
  getCredential,
  openOAuthUrl,
  getVeriffSession,
  sortByDate
} from 'utils';
import { IWalletInformation } from 'context';

interface IClaimValues {
  firstName: string;
  lastName: string;
}

interface IStepsCompleted {
  step1: boolean;
  step2: boolean;
}

interface IComponentProps {
  handleFetchOAuth: () => void;
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

const DEFAULT_VERIFF_NODE = 'http://localhost:4000/veriff';

export const VeriffProvider: FunctionComponent<IProps> = props => {
  const { ethProvider, address, wallet, component, stepsCompleted } = props;
  const [veriffSession, setVeriffSession] = useState({});
  const [claimValues, setClaimValues] = useState<IClaimValues>({
    firstName: '',
    lastName: ''
  });
  const [status, setStatus] = useState('idle');
  const [currentStepsCompleted, setCurrentStepsCompleted] = useState(
    stepsCompleted || {
      step1: false,
      step2: false
    }
  );

  useEffect(() => {
    if (!window) return;

    const queryString = new URLSearchParams(window?.location?.search);
    const queryState = queryString.get('status');

    // if Veriff oauth then submit message to other windows and close self
    if (queryState && queryState == 'submitted') {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel('veriff_oauth_channel');
      // only continue with the process if a code is returned

      channel.postMessage({
        target: 'veriff',
        data: { state: queryState }
      });

      // always close the redirected window
      window.close();
    }
  }, []);

  // attach and destroy a BroadcastChannel to handle the message
  useEffect(() => {
    // open the channel
    const channel = new BroadcastChannel('veriff_oauth_channel');
    // event handler will listen for messages from the child (debounced to avoid multiple submissions)
    channel.onmessage = debounce(listenForRedirect, 300);

    return () => {
      channel.close();
    };
  }, []);

  const handleFetchOAuth = async () => {
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

        const session = window.localStorage.getItem(
          'krebit.reputation-passport.session'
        );
        const currentSession = JSON.parse(session);

        if (!currentSession) return;

        // Step 1-A:  Get credential from Issuer based on claim:

        // Issue self-signed credential claiming the veriff
        const claim = await getClaim(address, veriffSession, e.data);
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
          verifyUrl: DEFAULT_VERIFF_NODE,
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
        .filter(credential => credential.type.includes('veriff'))
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
    handleFetchOAuth,
    handleStampCredential,
    handleClaimValues,
    claimValues,
    currentStepsCompleted,
    status
  });
};
