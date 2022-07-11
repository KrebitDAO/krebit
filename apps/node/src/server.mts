import express from 'express';

import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';

import { ethereum, schemas, utils, ceramic } from '@krebitdao/lib';

const NETWORK = process.env.NEXT_PUBLIC_NETWORK;
const CERAMIC_URL = process.env.NEXT_PUBLIC_CERAMIC_URL;
const ETHEREUM_SEED = process.env.SERVER_ETHEREUM_SEED;

const TRUST = parseInt(process.env.SERVER_TRUST, 10);
const STAKE = parseInt(process.env.SERVER_STAKE, 10);
const PRICE = parseInt(process.env.SERVER_PRICE, 10);
const EXPIRES_YEARS = parseInt(process.env.SERVER_EXPIRES_YEARS, 10);

const ceramicClient = new CeramicClient(CERAMIC_URL);

const connect = async () => {
  try {
    const ethProvider = (await ethereum.getProvider()) as utils.WalletProvider;

    // Create wallet from ethereum seed
    let wallet: ethers.Wallet;

    try {
      // Unlock/Decrypt local wallet
      console.log('Opening Wallet...');
      const unlockedWallet = ethers.Wallet.fromMnemonic(ETHEREUM_SEED);

      // Connect wallet with provider for signing the transaction
      wallet = unlockedWallet.connect(ethProvider);
    } catch (error) {
      console.error('Failed to use local Wallet: ', error);
    }

    if (wallet && wallet.address) {
      console.log('address: ', wallet.address);
      ethProvider.setWallet(wallet);

      const krbContract = new ethers.Contract(
        schemas.krbToken[NETWORK].address,
        schemas.krbToken.abi,
        ethProvider
      );

      //Get current KRB balance
      // We need at least krbContract.minBalanceToIssue()
      if (krbContract) {
        const krbBalance = await krbContract.balanceOf(wallet.address);
        console.log('krbBalance: ', ethers.utils.formatUnits(krbBalance, 18));
        const minBalanceToIssue = await krbContract.minBalanceToIssue();
        console.log(
          'minBalanceToIssue: ',
          ethers.utils.formatUnits(minBalanceToIssue, 18)
        );
        if (krbBalance < minBalanceToIssue)
          throw new Error('Not enough KRB balance to Issue');
      }

      return { wallet, ethProvider };
    } else return null;
  } catch (error) {
    throw new Error(error);
  }
};

const app = express();
const port = 9000;

app.use(express.urlencoded({ extended: false }));

const { wallet, ethProvider } = await connect();
const address = await wallet.getAddress();

app.post('/questapp', async (req, res, next) => {
  try {
    if (!req.body || !req.body.address) {
      throw new Error(`No address in body`);
    }
    let userAddress = req.body.address;
    if (!req.body || !req.body.communityId) {
      throw new Error(`No communityId in body`);
    }
    let communityId = req.body.communityId;

    //TODO Validate if address deserves the badge
    console.log('Verifying questapp for address: ', userAddress);
    let badgeValue = {
      communityId,
      name: 'Community Badge Name',
      imageIPFS: 'ipfs://asdf',
      description: 'Badge for users that meet some criteria',
      skills: [{ skillId: 'participation', score: 100 }],
      xp: '1'
    };

    console.log('Valid quest found in community: ', communityId);

    let expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 3);
    console.log('expirationDate: ', EXPIRES_YEARS);
    let claim = {
      id: 'uri://badge-id',
      credentialSubject: {
        encrypted: 'false',
        ethereumAddress: userAddress,
        id: `did:pkh:eip155:1:${userAddress}`,
        type: 'questBadge',
        value: badgeValue,
        typeSchema: 'https://github.com/KrebitDAO/schemas/questBadge',
        trust: TRUST, // How much we trust the evidence to sign this?
        stake: STAKE, // In KRB
        price: PRICE * 10 ** 18 // charged to the user for claiming KRBs
      },
      expirationDate: new Date(expirationDate).toISOString()
    };
    console.log('claim: ', claim);

    // Log in with wallet to Ceramic DID
    console.log('Authenticating with Self.Id...');
    const idx = await ceramic.authenticateServerDID(
      wallet.address,
      ethProvider,
      ceramicClient
    );

    // Issue Verifiable credential
    const result = await utils.issueCredential(wallet, idx, claim);

    if (result) {
      res.json(result);
    }
  } catch (err) {
    next(err);
  }
});

app.post('/discord', async (req, res) => {
  let claimedCredential = req.body.claimedCredential;
  console.log('Verifying discord with claimedCredential: ', claimedCredential);

  // Todo check self-signature

  // If claim is digitalProperty "Discord":
  if (
    claimedCredential.credentialSubject.type === 'digitalProperty' &&
    claimedCredential.credentialSubject.value.includes('discord')
  ) {
    // Log in with wallet to Ceramic DID
    console.log('Authenticating with Self.Id...');
    const idx = await ceramic.authenticateServerDID(
      wallet.address,
      ethProvider,
      ceramicClient
    );
    //TODO: Check if the claim already has verifications by me
    //TODO: Check if the proofValue of the sent VC is OK

    // Get evidence bearer token
    const value = JSON.parse(claimedCredential.credentialSubject.value);
    console.log('claim value: ', value);

    const evidence = JSON.parse(value.evidence);
    console.log('evidence: ', evidence);

    // Connect to discord and get user ID from token
    const discord = await utils.getDiscordUser(
      evidence.tokenType,
      evidence.accessToken
    );

    let expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 3);

    let claim = {
      ...claimedCredential,
      expirationDate: new Date(expirationDate).toISOString()
    };
    claim.credentialSubject = {
      ...claimedCredential.credentialSubject,
      trust: TRUST, // How much we trust the evidence to sign this?
      stake: STAKE, // In KRB
      price: PRICE * 10 ** 18 // charged to the user for claiming KRBs
    };

    // If discord userID == the VC userID
    if (discord.id === value.id) {
      // Issue Verifiable credential
      console.log('Valid discord:', discord);
      const result = await utils.issueCredential(wallet, idx, claim);

      if (result) {
        res.json(result);
      }
    } else {
      throw new Error(`Wrong discord: ${discord}`);
    }
  }
});

app.post('/dework', async (req, res) => {
  if (!req.body || !req.body.address) {
    throw new Error(`No address in body`);
  }
  let deworkAddress = req.body.address;
  console.log('Verifying dework for address: ', deworkAddress);

  // Log in with wallet to Ceramic DID
  console.log('Authenticating with Self.Id...');
  const idx = await ceramic.authenticateServerDID(
    wallet.address,
    ethProvider,
    ceramicClient
  );

  // Connect to discord and get reputation from address
  const dework = await utils.getDeworkUser(deworkAddress);

  console.log('Importing from Dework:', dework.address);

  let expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + EXPIRES_YEARS);

  if (dework.tasks && dework.tasks.length > 0) {
    const result = await Promise.all(
      await dework.tasks.map(async task => {
        console.log('Importing task:', task);
        if (task.rewards && task.rewards.length > 0) {
          let claim = {
            id: task.permalink,
            credentialSubject: {
              encrypted: 'false',
              ethereumAddress: deworkAddress,
              id: `did:pkh:eip155:1:${deworkAddress}`,
              type: 'workExperience',
              value: {
                ...task,
                issuingEntity: 'Dework',
                startDate: 'null',
                endDate: task.date,
                evidence:
                  'https://api.deworkxyz.com/v1/reputation/' + deworkAddress
              },
              typeSchema: 'https://github.com/KrebitDAO/schemas/workExperience',
              trust: TRUST, // How much we trust the evidence to sign this?
              stake: STAKE, // In KRB
              price: PRICE * 10 ** 18 // charged to the user for claiming KRBs
            },
            expirationDate: new Date(expirationDate).toISOString()
          };
          let result = await utils.issueCredential(wallet, idx, claim);
          if (result) return result;
        }
      })
    );
    res.json(result);
  }
});
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
