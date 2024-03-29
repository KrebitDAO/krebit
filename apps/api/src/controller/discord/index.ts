import express from 'express';
import LitJsSdk from '@lit-protocol/sdk-nodejs';
import krebit from '@krebitdao/reputation-passport';

import { connect, discord } from '../../utils';

const {
  SERVER_EXPIRES_YEARS,
  SERVER_TRUST,
  SERVER_STAKE,
  SERVER_PRICE,
  SERVER_CERAMIC_URL,
  SERVER_NETWORK
} = process.env;

export const DiscordController = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!request?.body) {
      throw new Error('Body not defined');
    }

    if (!request?.body?.claimedCredentialId) {
      throw new Error(`No claimedCredentialId in body`);
    }

    const { claimedCredentialId } = request.body;
    const { wallet, ethProvider } = await connect();

    // Log in with wallet to Ceramic DID
    const Issuer = new krebit.core.Krebit({
      wallet,
      ethProvider,
      address: wallet.address,
      litSdk: LitJsSdk,
      ceramicUrl: SERVER_CERAMIC_URL
    });
    const did = await Issuer.connect();
    console.log('DID:', did);

    const claimedCredential = await Issuer.getCredential(claimedCredentialId);

    console.log(
      'Verifying discord with claimedCredential: ',
      claimedCredential
    );

    // Check self-signature
    console.log('checkCredential: ', Issuer.checkCredential(claimedCredential));

    // get the claimValue
    let claimValue = null;
    //Decrypt
    if (claimedCredential.credentialSubject.encrypted === 'lit') {
      claimValue = await Issuer.decryptCredential(claimedCredential);
    } else {
      claimValue = JSON.parse(claimedCredential.credentialSubject.value);
      console.log('Claim value: ', claimValue);
    }
    const publicClaim: boolean =
      claimedCredential.credentialSubject.encrypted === 'none';

    // TODO: Check if the claim already has verifications by me?

    // If claim is digitalProperty "Discord"
    if (claimedCredential?.credentialSubject?.type === 'Discord') {
      // Connect to discord and get user ID from token
      const discordUser = await discord.getDiscordUser({
        tokenType: claimValue.proofs.tokenType,
        accessToken: claimValue.proofs.accessToken
      });

      // If discord userID == the VC userID
      if (discordUser.id === claimValue.id) {
        // Issue Verifiable credential
        console.log('Valid discord:', discordUser);

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        }
        console.log('claim: ', claim);

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong discord: ${discordUser}`);
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'DiscordGuildOwner'
    ) {
      // Connect to discord and get user ID from token
      const discordUser = await discord.getDiscordUser({
        tokenType: claimValue.proofs.tokenType,
        accessToken: claimValue.proofs.accessToken
      });
      console.log('discordUser: ', discordUser);
      const discordGuild = await discord.getDiscordGuild({
        tokenType: claimValue.proofs.tokenType,
        accessToken: claimValue.proofs.accessToken,
        guildId: claimValue.id
      });
      console.log('discordGuild: ', discordGuild);

      // If discord userID == the VC userID
      if (
        discordGuild.id === claimValue.id &&
        discordUser.id === claimValue.proofs.ownerId &&
        discordGuild.owner
      ) {
        // Issue Verifiable credential

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        } else {
          claim.value['username'] = discordGuild.name;
          claim.value['imageUrl'] = 'https://cdn.discordapp.com/icons/'
            ?.concat(discordGuild.id)
            ?.concat('/')
            ?.concat(discordGuild.icon)
            ?.concat('.png');
        }
        console.log('claim: ', claim);

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong discord: ${discordGuild}`);
      }
    } else if (
      claimedCredential?.credentialSubject?.type === 'DiscordGuildMember'
    ) {
      // Connect to discord and get user ID from token
      const discordUser = await discord.getDiscordUser({
        tokenType: claimValue.proofs.tokenType,
        accessToken: claimValue.proofs.accessToken
      });
      console.log('discordUser: ', discordUser);
      const discordGuild = await discord.getDiscordGuild({
        tokenType: claimValue.proofs.tokenType,
        accessToken: claimValue.proofs.accessToken,
        guildId: claimValue.proofs.guildId
      });
      console.log('discordGuild: ', discordGuild);
      const discordGuildMember = await discord.getDiscordGuildMember({
        tokenType: claimValue.proofs.tokenType,
        accessToken: claimValue.proofs.accessToken,
        guildId: claimValue.proofs.guildId
      });
      console.log('discordGuildMember: ', discordGuildMember);

      // If discord userID == the VC userID
      if (
        !discordGuildMember.pending &&
        discordGuildMember.user.id === claimValue.proofs.memberId
      ) {
        // Issue Verifiable credential

        const expirationDate = new Date();
        const expiresYears = parseInt(SERVER_EXPIRES_YEARS, 10);
        expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
        console.log('expirationDate: ', expirationDate);

        const claim = {
          id: claimedCredentialId,
          ethereumAddress: claimedCredential.credentialSubject.ethereumAddress,
          did: claimedCredential.credentialSubject.id,
          type: claimedCredential.credentialSubject.type,
          typeSchema: claimedCredential.credentialSubject.typeSchema,
          tags: claimedCredential.type.slice(2),
          value: claimValue,
          trust: parseInt(SERVER_TRUST, 10), // How much we trust the evidence to sign this?
          stake: parseInt(SERVER_STAKE, 10), // In KRB
          price: parseInt(SERVER_PRICE, 10) * 10 ** 18, // charged to the user for claiming KRBs
          expirationDate: new Date(expirationDate).toISOString()
        };
        if (!publicClaim) {
          claim['encrypt'] = 'hash' as 'hash';
        } else {
          claim.value['description'] = discordGuild.name;
          claim.value['username'] = discordGuildMember.nick
            ? discordGuildMember.nick
            : discordUser.username
                ?.concat('#')
                ?.concat(discordUser.discriminator);
          claim.value['role'] = discordGuild.owner ? 'owner' : 'member';
          claim.value['skills'] = discordGuildMember.roles.map(role => {
            return { skillId: role, score: 100 };
          });
          claim.value['startDate'] = discordGuildMember.joined_at;
          claim.value['imageUrl'] = 'https://cdn.discordapp.com/icons/'
            ?.concat(discordGuild.id)
            ?.concat('/')
            ?.concat(discordGuild.icon)
            ?.concat('.png');
        }
        console.log('claim: ', claim);

        const issuedCredential = await Issuer.issue(claim);
        console.log('issuedCredential: ', issuedCredential);

        if (issuedCredential) {
          return response.json(issuedCredential);
        }
      } else {
        throw new Error(`Wrong discord: ${discordGuild}`);
      }
    }
  } catch (err) {
    next(err);
  }
};
