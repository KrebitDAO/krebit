import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { getIssuers } from 'utils';
import { GeneralContext } from 'context';
import {
  useDiscordProvider,
  useTwitterProvider,
  useVeriffLegalNameProvider,
  useVeriffAgeProvider,
  useVeriffGovernmentIdProvider,
  usePhoneProvider,
  useEmailProvider,
  usePersonaProvider,
  useGithubProvider
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
}

export const VerifyCredential = (props: IProps) => {
  const {
    isAuthenticated,
    credential,
    getInformation,
    updateCredential,
    onClose,
    formatCredentialName,
    formatLitValue
  } = props;
  const { walletInformation } = useContext(GeneralContext);
  const discordProvider = useDiscordProvider({ walletInformation });
  const twitterProvider = useTwitterProvider({ walletInformation });
  const veriffLegalNameProvider = useVeriffLegalNameProvider({
    walletInformation
  });
  const veriffAgeProvider = useVeriffAgeProvider({ walletInformation });
  const veriffGovernmentIdProvider = useVeriffGovernmentIdProvider({
    walletInformation
  });
  const phoneProvider = usePhoneProvider({ walletInformation });
  const emailProvider = useEmailProvider({ walletInformation });
  const personaProvider = usePersonaProvider({ walletInformation });
  const githubProvider = useGithubProvider({ walletInformation });

  const getProvider = (credentialType: string) => {
    if (credentialType === 'Discord') {
      return discordProvider;
    }

    if (credentialType === 'Twitter' || credentialType === 'TwitterVerified') {
      return twitterProvider;
    }

    if (credentialType === 'VeriffAgeGT18') {
      return veriffAgeProvider;
    }

    if (credentialType === 'VeriffLegalName') {
      return veriffLegalNameProvider;
    }

    if (credentialType === 'VeriffGovernmentId') {
      return veriffGovernmentIdProvider;
    }

    if (credentialType === 'PhoneNumber') {
      return phoneProvider;
    }

    if (credentialType === 'Email') {
      return emailProvider;
    }

    if (credentialType === 'PersonaLegalName') {
      return personaProvider;
    }

    if (credentialType === 'Github') {
      return githubProvider;
    }

    return null;
  };

  const handleClose = async () => {
    await getInformation().then(() => {
      onClose();
    });
  };

  const handleCleanState = (credentialType: string) => {
    const provider = getProvider(credentialType);

    provider.handleCleanClaimValues();
  };

  return (
    <Verify
      initialList={getIssuers('Personhood')}
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
    />
  );
};
