import { ChangeEvent, useEffect, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';
import { debounce } from 'ts-debounce';

import {
  generateUID,
  getCredential,
  getWalletInformation,
  openOAuthUrl,
  sortByDate
} from 'utils';

const { NEXT_PUBLIC_GITHUB_NODE_URL } = process.env;
const { NEXT_PUBLIC_CERAMIC_URL } = process.env;
interface IClaimValues {
  username: string;
  repository: string;
}

export const useGithubRepoProvider = () => {
  const [claimValues, setClaimValues] = useState<IClaimValues>({
    username: '',
    repository: ''
  });
  const [status, setStatus] = useState('idle');
  const [currentCredential, setCurrentCredential] = useState<
    Object | undefined
  >();
  const [currentStamp, setCurrentStamp] = useState<Object | undefined>();
  const channel = new BroadcastChannel('github_oauth_channel');

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

  const handleFetchOAuth = () => {
    const state = 'githubRepoOwner-' + generateUID(10);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_PASSPORT_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_PASSPORT_GITHUB_CALLBACK}&state=${state}`;

    openOAuthUrl({
      url: authUrl
    });
  };

  const getClaim = async (address: string, proofs: any) => {
    const claimValue = {
      title: claimValues.repository,
      entity: claimValues.username,
      proofs: proofs
    };

    const expirationDate = new Date();
    const expiresSeconds = 300;
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresSeconds);
    console.log('expirationDate: ', expirationDate);

    return {
      id: proofs.state,
      ethereumAddress: address,
      type: 'GithubRepoStarsGT10',
      typeSchema: 'krebit://schemas/workExperience',
      tags: [
        'digitalProperty',
        'code',
        'programing',
        'development',
        'workExperience'
      ],
      value: claimValue,
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  // Listener to watch for oauth redirect response on other windows (on the same host)
  const listenForRedirect = async (e: {
    target: string;
    data: { code: string; state: string };
  }) => {
    setStatus('credential_pending');

    try {
      // when receiving Github oauth response from a spawned child run fetchVerifiableCredential
      if (e.target === 'GithubRepoStarsGT10') {
        console.log('Saving Stamp', {
          type: 'GithubRepoStarsGT10',
          proof: e.data
        });

        const session = window.localStorage.getItem('did-session');
        const currentSession = JSON.parse(session);

        if (!currentSession) return;

        const currentType = localStorage.getItem('auth-type');
        const walletInformation = await getWalletInformation(currentType);

        // Step 1-A:  Get credential from Issuer based on claim:

        //Issue self-signed credential claiming the Github
        const claim = await getClaim(walletInformation.address, e.data);
        console.log('claim: ', claim);

        const Issuer = new Krebit.core.Krebit({
          ...walletInformation,
          litSdk: LitJsSdk,
          ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
        });

        await Issuer.connect(currentSession);

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
            verifyUrl: NEXT_PUBLIC_GITHUB_NODE_URL,
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

      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);

      const currentType = localStorage.getItem('auth-type');
      const walletInformation = await getWalletInformation(currentType);

      const passport = new Krebit.core.Passport({
        ...walletInformation,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await passport.read(walletInformation.address);

      const credentials = await passport.getCredentials('GithubRepoStarsGT10');
      const getLatestGithubCredential = credentials
        .filter(credential => credential.type.includes('GithubRepoStarsGT10'))
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
        .at(-1);

      const Issuer = new Krebit.core.Krebit({
        ...walletInformation,
        litSdk: LitJsSdk,
        ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
      });
      await Issuer.connect(currentSession);

      const stampTx = await Issuer.stampCredential(getLatestGithubCredential);
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
