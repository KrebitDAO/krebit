import { ChangeEvent, useState, useEffect } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from '@lit-protocol/sdk-browser';

import { getCredential, constants, guildXyz } from 'utils';

// types
import { IIssuerParams } from 'utils/getIssuers';
import { IWalletInformation } from 'context';

interface IClaimValues {
  guildId: string;
  roleId: string;
  private: boolean;
}

interface IItems {
  text: string;
  value: string;
}

interface IProps {
  walletInformation: IWalletInformation;
}

const { NEXT_PUBLIC_CERAMIC_URL } = process.env;

const initialState = {
  guildId: '',
  roleId: '',
  private: true
};

const camelSentence = (str: string) => {
  return (' ' + str)
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, function (match, chr) {
      return chr.toUpperCase();
    });
};

export const useGuildXyzRoleProvider = (props: IProps) => {
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
  const [guildNames, setGuildNames] = useState<IItems[]>([]);
  const [roleNames, setRoleNames] = useState<IItems[]>([]);

  useEffect(() => {
    if (walletInformation) return;

    const loadGuilds = async () => {
      const guilds = await guildXyz.getAddressGuilds(walletInformation.address);
      setGuildNames(guilds);
    };

    loadGuilds();
  }, [walletInformation]);

  useEffect(() => {
    if (walletInformation) return;

    const loadRoles = async () => {
      let roles = [];

      if (claimValues?.guildId) {
        roles = await guildXyz.getAddressRoles(
          claimValues.guildId,
          walletInformation.address
        );
      }

      setRoleNames(roles);
    };

    loadRoles();
  }, [walletInformation, claimValues]);

  const getClaim = async (
    address: string,
    payload: any,
    did: string,
    issuer: IIssuerParams
  ) => {
    const claimValue = {
      entity: payload.guildInfo.name,
      name: `${payload.roleInfo.name} Guild.xyz Role`,
      imageUrl: payload.roleInfo.imageUrl
        ? `https://guild.xyz/${payload.roleInfo.imageUrl}`
        : '',
      description: payload.roleInfo.description
        ? payload.roleInfo.description
        : '',
      role: payload.roleInfo.name,
      proofs: {
        guildId: claimValues.guildId,
        roleId: claimValues.roleId
      }
    };

    const expirationDate = new Date();
    const expiresSeconds = 300;
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresSeconds);
    console.log('expirationDate: ', expirationDate);

    return {
      id: `guildXyzRole-${claimValues.roleId}`,
      did,
      ethereumAddress: address,
      type: issuer.credentialType,
      typeSchema: 'krebit://schemas/badge',
      tags: [
        payload.guildInfo.name,
        camelSentence(payload.roleInfo.name),
        'Role',
        'Community',
        'Membership'
      ],
      value: claimValue,
      expirationDate: new Date(expirationDate).toISOString()
    };
  };

  const handleGetCredential = async (issuer: IIssuerParams) => {
    if (!walletInformation) return;

    setCurrentIssuer(issuer);
    setStatus('credential_pending');
    setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

    try {
      console.log('Saving Stamp', { type: 'GuildXyzRole' });

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
      const guildInfo = await guildXyz.getGuild(claimValues.guildId);
      const roleInfo = await guildXyz.getRole(claimValues.roleId);
      //Issue self-signed credential claiming
      const claim = await getClaim(
        walletInformation.address,
        { guildInfo, roleInfo },
        Issuer.did,
        issuer
      );
      if (claimValues.private) {
        claim['encrypt'] = 'lit' as 'lit';
        claim['shareEncryptedWith'] = issuer.address;
      }
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

        setStatusMessage(
          constants.DEFAULT_MESSAGES_FOR_PROVIDERS.ISSUING_CREDENTIAL
        );

        // Step 1-B: Send self-signed credential to the Issuer for verification
        const issuedCredential = await getCredential({
          verifyUrl: issuer.verificationUrl,
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
          setStatusMessage(undefined);
          setErrorMessage(undefined);
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
    handleGetCredential,
    handleClaimValues,
    handleMintCredential,
    handleCleanClaimValues,
    claimValues,
    status,
    statusMessage,
    errorMessage,
    currentCredential,
    currentStamp,
    currentMint,
    guildNames,
    roleNames
  };
};
