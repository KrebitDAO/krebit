# reputation-passport

# <img src="../../krebit-icon.png" alt="Krebit" height="40px" align="left"> Krebit Reputation Passport SDK

[![Docs](https://img.shields.io/badge/docs-%F0%9F%93%84-blue)](https://docs.krebit.id)

This repository hosts the [Krebit] Reputation Passport sdk, based on [W3C Ethereum EIP712 Signature 2021 Draft].

[krebit]: http://krebit.id
[w3c ethereum eip712 signature 2021 draft]: https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec

It provides functions for creating off-chain [Verifiable-Credentials] in Ceramic that can be verified on-chain with [krebit-contracts].

[krebit-contracts]: https://github.com/KrebitDAO/krb-contracts
[verifiable-credentials]: https://github.com/ceramicstudio/datamodels/tree/main/models/verifiable-credentials

## Overview

### Installation

```console
$ npm install -s @krebitdao/reputation-passport
```

### Read-Only Passport

```javascript
import krebit from '@krebitdao/reputation-passport';

const passport = new krebit.core.Passport();
passport.read(address, `did:pkh:eip155:80001:${address}`);

const profile = await passport.getProfile();
console.log('profile: ', profile);

const credentials = await passport.getCredentials();
console.log('credentials: ', credentials);

const reputation = await passport.getReputation();
console.log('reputation: ', reputation);

const stamps = await passport.getStamps(10, 'digitalProperty');
console.log('stamps: ', stamps);
```

### Initialize Ethereum Provider

```javascript
import krebit from '@krebitdao/reputation-passport';

// Example on Browser:
const connectWeb3 = async () => {
  if (!window) return;
  const ethereum = (window as any).ethereum;

  if (!ethereum) return;

  const addresses = await ethereum.request({
    method: 'eth_requestAccounts'
  });
  const address = addresses[0];
  const ethProvider = await Krebit.lib.ethereum.getWeb3Provider();
  const wallet = ethProvider.getSigner();
  return { address, wallet, ethProvider };
};

// NODE JS Example:
export const connect = async () => {
  try {
    const ethProvider = Krebit.lib.ethereum.getProvider();

    let wallet: ethers.Wallet;

    try {
      // Create wallet from ethereum seed
      const unlockedWallet = ethers.Wallet.fromMnemonic(SERVER_ETHEREUM_SEED);
      // Connect wallet with provider for signing the transaction
      wallet = unlockedWallet.connect(ethProvider);
    } catch (error) {
      console.error('Failed to use local Wallet: ', error);
    }
    if (wallet && wallet.address) {
      console.log('address: ', wallet.address);
      ethProvider.setWallet(wallet);
      return { wallet, ethProvider };
    }
    return undefined;
  } catch (error) {
    throw new Error(error);
  }
};
```

### Initialize Issuer

```javascript
import krebit from '@krebitdao/reputation-passport';
const { wallet, ethProvider } = await connect();

const Issuer = new krebit.core.Krebit({
  wallet,
  ethProvider,
  network: 'mumbai',
  address: wallet.address
});
const did = await Issuer.connect();
```

### Issue Credential

```javascript
const getClaim = async (toAddress: string) => {
  const badgeValue = {
    communityId: 'My Community',
    name: 'Community Badge Name',
    imageUrl: 'ipfs://asdf',
    description: 'Badge for users that meet some criteria',
    skills: [{ skillId: 'participation', score: 100 }],
    xp: '1'
  };

  const expirationDate = new Date();
  const expiresYears = 3;
  expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
  console.log('expirationDate: ', expirationDate);

  const claim = {
    id: `quest-123`,
    ethereumAddress: toAddress,
    did: `did:pkh:eip155:1:${toAddress}`
    type: 'questBadge',
    value: badgeValue,
    tags: ['quest', 'badge', 'community'],
    typeSchema: 'https://github.com/KrebitDAO/schemas/questBadge',
    expirationDate: new Date(expirationDate).toISOString()
  };
};

const claim = await getClaim(toAddress);
const issuedCredential = await Issuer.issue(claim);
```

### Verify Credential

```javascript
console.log(
  'Verifying credential:',
  await Issuer.checkCredential(issuedCredential)
);
```

### Add Credential to My Passport

```javascript
import krebit from '@krebitdao/reputation-passport';
const { wallet, ethProvider } = await connectWeb3();

const passport = new krebit.core.Passport({
  ethProvider: ethProvider.provider,
  address
});
await passport.connect();

const addedCredentialId = await passport.addCredential(issuedCredential);
console.log('addedCredentialId: ', addedCredentialId);
```

### Issue Ecrypted Credential

With Lit protocol:

```javascript
import krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk'; // Added Lit

const { wallet, ethProvider } = await connectWeb3();

const Issuer = new krebit.core.Krebit({
        wallet,
        ethProvider: ethProvider.provider,
        address,
        litSdk: LitJsSdk // Added Lit
      });

const getEncryptedClaim = async (toAddress: string) => {
  const privateValue = {
    secretValue: 'My Secret',
  };

  const expirationDate = new Date();
  const expiresYears = 3;
  expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
  console.log('expirationDate: ', expirationDate);

  const claim = {
    id: `custom-123`,
    ethereumAddress: toAddress,
    type: 'custom',
    value: privateValue,
    tags: ['tag1', 'tag2'],
    typeSchema: '<type url>',
    expirationDate: new Date(expirationDate).toISOString()
    encrypt: 'lit' as 'lit' // Added Lit
  };
};

const claim = await getEncryptedClaim(toAddress);
const issuedCredential = await Issuer.issue(claim);
```

### Decrypt Credential

```javascript
const decrypted = await Issuer.decryptClaim(issuedCredential);
console.log('Decrypted:', decrypted);
```

## Learn More

The guides in the [docs site](http://docs.krebit.co) will teach about different concepts of the Krebit Protocol.

## Contribute

Krebit Protocol exists thanks to its contributors. There are many ways you can participate and help build public goods. Check out the [Krebit Gitcoin Grants](https://gitcoin.co/grants/3522/krebit)!

## License

Krebit Reputation Passport is released under the [ISC License](LICENSE).
