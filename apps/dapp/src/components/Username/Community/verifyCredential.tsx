import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { getIssuers } from 'utils';
import { GeneralContext } from 'context';
import {
  useIssuerProvider,
  useGithubOrgMemberProvider,
  useDiscordGuildOwnerProvider,
  useDiscordGuildMemberProvider,
  useTwitterFollowersProvider,
  useGuildXyzMemberProvider,
  useGuildXyzAdminProvider,
  useGuildXyzRoleProvider
} from 'hooks';

// types
import { ICredential } from 'utils/normalizeSchema';

interface IProps {
  isAuthenticated: boolean;
  credential: ICredential;
  getInformation: () => Promise<void>;
  updateCredential: (vcId: string) => Promise<void>;
  onClose: () => void;
  formatCredentialName: (value: any) => string;
  formatLitValue: (type: string, credential: any) => Promise<void>;
  readOnly?: boolean;
}

export const VerifyCredential = (props: IProps) => {
  const {
    isAuthenticated,
    credential,
    getInformation,
    updateCredential,
    onClose,
    formatCredentialName,
    formatLitValue,
    readOnly = false
  } = props;
  const { walletInformation } = useContext(GeneralContext);
  const issuerProvider = useIssuerProvider({ walletInformation });
  const githubOrgMemberProvider = useGithubOrgMemberProvider({
    walletInformation
  });
  const discordGuildOwnerProvider = useDiscordGuildOwnerProvider({
    walletInformation
  });
  const discordGuildMemberProvider = useDiscordGuildMemberProvider({
    walletInformation
  });
  const twitterFollowersProvider = useTwitterFollowersProvider({
    walletInformation
  });
  const guildXyzMemberProvider = useGuildXyzMemberProvider({
    walletInformation
  });
  const guildXyzAdminProvider = useGuildXyzAdminProvider({ walletInformation });
  const guildXyzRoleProvider = useGuildXyzRoleProvider({ walletInformation });

  const getProvider = (credentialType: string) => {
    if (credentialType === 'Issuer') {
      return issuerProvider;
    }

    if (credentialType === 'GithubOrgMember') {
      return githubOrgMemberProvider;
    }

    if (credentialType === 'GuildXyzMember') {
      return guildXyzMemberProvider;
    }

    if (credentialType === 'GuildXyzAdmin') {
      return guildXyzAdminProvider;
    }

    if (credentialType === 'GuildXyzRole') {
      return guildXyzRoleProvider;
    }

    if (credentialType === 'DiscordGuildOwner') {
      return discordGuildOwnerProvider;
    }

    if (credentialType === 'DiscordGuildMember') {
      return discordGuildMemberProvider;
    }

    if (
      credentialType === 'TwitterFollowersGT1K' ||
      credentialType === 'TwitterFollowersGT10K'
    ) {
      return twitterFollowersProvider;
    }

    return null;
  };

  const handleClose = async () => {
    await getInformation();

    onClose();
  };

  const handleCleanState = (credentialType: string) => {
    const provider = getProvider(credentialType);

    provider.handleCleanClaimValues();
  };

  return (
    <Verify
      initialList={getIssuers('Community')}
      onClose={handleClose}
      onClean={handleCleanState}
      verifyId={credential?.credential?.visualInformation?.credentialType}
      credential={credential}
      getProvider={getProvider}
      isAuthenticated={isAuthenticated}
      formatCredentialName={formatCredentialName}
      formatLitValue={formatLitValue}
      updateCredential={updateCredential}
      walletInformation={walletInformation}
      readOnly={readOnly}
    />
  );
};
