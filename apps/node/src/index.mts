import { ethers } from 'ethers';
import { CeramicClient } from '@ceramicnetwork/http-client';

import { ethereum, texttile, schemas, utils, ceramic } from 'lib';

const NETWORK = process.env.NEXT_PUBLIC_NETWORK;
const CERAMIC_URL = process.env.NEXT_PUBLIC_CERAMIC_URL;
const ETHEREUM_SEED = process.env.SERVER_ETHEREUM_SEED;

const ceramicClient = new CeramicClient(CERAMIC_URL);

const run = async () => {
  try {
    const ethProvider = (await ethereum.getProvider()) as utils.WalletProvider;
    const krbContract = new ethers.Contract(
      schemas.krbToken[NETWORK].address,
      schemas.krbToken.abi,
      ethProvider
    );

    // Create wallet from ethereum seed
    let wallet: ethers.Wallet;

    try {
      // Unlock/Decrypt local wallet
      console.log('Opening Wallet');
      const unlockedWallet = ethers.Wallet.fromMnemonic(ETHEREUM_SEED);

      // Connect wallet with provider for signing the transaction
      wallet = unlockedWallet.connect(ethProvider);
    } catch (error) {
      console.error('Failed to use local Wallet: ', error);
    }

    if (wallet && wallet.address) {
      console.log('address: ', wallet.address);

      try {
        ethProvider.setWallet(wallet);

        //Get Ethereum balance
        const ethBalance = await ethProvider.getBalance(wallet.address);
        console.log('ETH balance: ', ethers.utils.formatEther(ethBalance));

        //Get current KRB balance
        if (krbContract) {
          const krbBalance = await krbContract.balanceOf(wallet.address);
          console.log(
            'KRB balance: ',
            ethers.utils.formatUnits(krbBalance, 18)
          );
        }

        // Log in with wallet to Ceramic DID
        console.log('Authenticating with Self.Id...');
        const idx = await ceramic.authenticateServerDID(
          wallet.address,
          ethProvider,
          ceramicClient
        );

        console.log('Opening encrypted mailbox...');
        const ed25519 = await utils.getED25519(idx, ceramicClient);
        const userAPI = await texttile.getUser(ed25519);

        console.log('Current usage: ', await userAPI.getUsage());

        // Check threadDB Mailbox for last unread messages
        const last = await utils.getLastMessage(ed25519, userAPI, idx);

        for (let message of last) {
          // If message is a verification request
          if (message.subject === 'Verification Request') {
            if (message.attachedClaims.length > 0) {
              // Get attached VC
              for (let claim of message.attachedClaims) {
                // If claim is digitalProperty "Discord":
                if (
                  claim.credentialSubject.type === 'digitalProperty' &&
                  claim.credentialSubject.value.includes('discord')
                ) {
                  //TODO: Check if the claim already has verifications by me
                  //TODO: Check if the proofValue of the sent VC is OK

                  // Get evidence bearer token
                  const value = JSON.parse(claim.credentialSubject.value);
                  console.log('claim value: ', value);

                  const description = JSON.parse(value.description);
                  console.log('description: ', description);

                  // Connect to discord and get user ID from token
                  const discord = await utils.getDiscordUser(
                    description.evidence.tokenType,
                    description.evidence.accessToken
                  );

                  // If discord userID == the VC userID
                  if (discord.id === value.id) {
                    // Issue Verifiable credential
                    console.log('good discord:', discord);
                    const result = await utils.verifyClaim(
                      wallet,
                      idx,
                      message,
                      claim,
                      ed25519,
                      userAPI
                    );

                    // Delete message
                    if (result) {
                      await userAPI.deleteInboxMessage(message.id);
                      console.log('Message deleted: ', message.id);
                    }
                  } else {
                    await userAPI.deleteInboxMessage(message.id);

                    throw new Error(
                      `Wrong discord: ${discord}, message deleted: ${message.id}`
                    );
                  }
                }
              }
            } else {
              await userAPI.readInboxMessage(message.id);

              throw new Error(
                `No claims attached, message deleted: ${message.id}`
              );
            }
          } else {
            // Else mark message as Read
            await userAPI.readInboxMessage(message.id);

            throw new Error(`Message marked as read: ${message.id}`);
          }
        }
      } catch (error) {
        throw new Error(error);
      }
    }

    process.exit(0);
  } catch (error) {
    throw new Error(error);
  }
};

run().catch(console.error);
