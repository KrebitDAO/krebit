import { useEffect, useState } from 'react';

import krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

import { connectWeb3, getCredential, getVeriffSession } from '../utils';

import { debounce } from 'ts-debounce';
import { BroadcastChannel } from 'broadcast-channel';

function generateUID(length: number) {
  return window
    .btoa(
      Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2)))
        .map(b => String.fromCharCode(b))
        .join('')
    )
    .replace(/[+/]/g, '')
    .substring(0, length);
}

const claimValue = {
  person: {
    firstName: 'Fulano',
    lastName: 'De Tal [EXAMPLE]'
  }
};

const IndexPage = () => {
  const [veriffSession, setVeriffSession] = useState({});

  if (typeof window !== 'undefined') {
    // pull any search params
    const queryString = new URLSearchParams(window?.location?.search);
    console.log('queryString: ', queryString);
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

      return <div></div>;
    }
  }

  // Fetch Veriff OAuth2 url from the IAM procedure
  async function handleFetchVeriffOAuth(): Promise<void> {
    // open new window for authUrl
    const { address, wallet, ethProvider } = await connectWeb3();
    const veriff = await getVeriffSession({
      verification: {
        ...claimValue,
        vendorData: address,
        timestamp: new Date().toISOString()
      }
    });
    setVeriffSession(veriff);
    openOAuthUrl(veriff.url);
  }

  // Open Veriff authUrl in centered window
  function openOAuthUrl(url: string): void {
    const width = 600;
    const height = 800;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    // Pass data to the page via props
    window.open(
      url,
      '_blank',
      'toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left
    );
  }

  const getClaim = async (address: string, payload: any, proofs: any) => {
    const expirationDate = new Date();
    const expiresSeconds = 300;
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresSeconds);
    console.log('expirationDate: ', expirationDate);

    return {
      id: payload.id,
      credentialSubject: {
        ethereumAddress: address,
        id: `did:pkh:eip155:80001:${address}`,
        type: 'legalName',
        value: {
          ...claimValue,
          proofs: veriffSession
        },
        typeSchema: 'did:pkh:eip155:80001:krebit.eth/typeSchemas/legalName',
        trust: 1, // How much we trust the evidence to sign this?
        stake: 0, // In KRB
        price: 0 // charged to the user for claiming KRBs
      },
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  // Listener to watch for oauth redirect response on other windows (on the same host)
  async function listenForRedirect(e: {
    target: string;
    data: { state: string };
  }) {
    // when receiving vseriff oauth response from a spawned child run fetchVerifiableCredential
    if (e.target === 'veriff') {
      console.log('Saving Stamp', { type: 'veriff', proof: e.data });

      // Step 1-A:  Get credential from Issuer based on claim:

      //Get veriff user

      //connect Ethereum wallet
      const { address, wallet, ethProvider } = await connectWeb3();

      //Issue self-signed credential claiming the veriff
      const claim = await getClaim(address, veriffSession, e.data);
      console.log('claim: ', claim);

      const Issuer = new krebit.core.Krebit({
        wallet,
        ethProvider: ethProvider.provider,
        address,
        litSdk: LitJsSdk
      });

      const did = await Issuer.connect();
      console.log(did);

      //TODO: in this case, we can encrypt for the issuer too
      const claimedCredential = await Issuer.issue(claim, 'legalName', 'plain');
      console.log('claimedCredential: ', claimedCredential);

      // Step 1-B: Send self-signed credential to the Issuer for verification

      const issuedCredential = await getCredential({
        verifyUrl: 'http://localhost:4000/veriff',
        claimedCredential
      });

      console.log('issuedCredential: ', issuedCredential);

      // Step 1-C: Get the verifiable credential, and save it to the passport
      if (issuedCredential) {
        /*
        const passport = new krebit.core.Passport({
          ethProvider: ethProvider.provider,
          address
        });
        await passport.connect();
        const addedCredentialId = await passport.addVerifiableCredential(
          issuedCredential
        );
        console.log('addedCredentialId: ', addedCredentialId);
        console.log(
          'addCredential:',
          await passport.addCredential(addedCredentialId)
        );
*/

        // Step 2: Register credential on chaim (stamp)

        const stampTx = await Issuer.stampCredential(issuedCredential);
        console.log('stampTx: ', stampTx);
      }
    }
  }

  async function getStamps(): Promise<void> {
    //connect Ethereum wallet
    const { address, wallet, ethProvider } = await connectWeb3();
    const passport = new krebit.core.Passport();
    passport.read(address, `did:pkh:eip155:80001:${address}`);
    const profile = await passport.getProfile();
    console.log('profile: ', profile);
    const credentials = await passport.getCredentials();
    console.log('credentials: ', credentials);
    const reputation = await passport.getReputation();
    console.log('reputation: ', reputation);

    const stamps = await passport.getStamps(10, 'digitalProperty', null);
    console.log('stamps: ', stamps);
  }

  // attach and destroy a BroadcastChannel to handle the message
  useEffect(() => {
    // open the channel
    const channel = new BroadcastChannel('veriff_oauth_channel');
    // event handler will listen for messages from the child (debounced to avoid multiple submissions)
    channel.onmessage = debounce(listenForRedirect, 300);

    return () => {
      channel.close();
    };
  });

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 onClick={() => handleFetchVeriffOAuth()} style={{ color: 'white' }}>
        Claim fullName on Veriff
      </h1>{' '}
      <br />
      <h1 onClick={() => getStamps()} style={{ color: 'white' }}>
        Get Stamps
      </h1>
    </>
  );
};

export default IndexPage;
