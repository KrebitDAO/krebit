import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { getIssuers } from 'utils';
import { GeneralContext } from 'context';
import {
  useGithubFollowersProvider,
  useGithubRepoProvider,
  useGithubRepoCollaboratorProvider,
  useSpectCompletedProvider,
  useDeworkCompletedProvider,
  useStackReputationProvider,
  useStackScoreProvider
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
  const githubFollowersProvider = useGithubFollowersProvider({
    walletInformation
  });
  const githubRepoProvider = useGithubRepoProvider({ walletInformation });
  const githubRepoCollaboratorProvider = useGithubRepoCollaboratorProvider({
    walletInformation
  });
  const spectCompletedProvider = useSpectCompletedProvider({
    walletInformation
  });
  const deworkCompletedProvider = useDeworkCompletedProvider({
    walletInformation
  });
  const stackReputationProvider = useStackReputationProvider({
    walletInformation
  });
  const stackScoreProvider = useStackScoreProvider({ walletInformation });

  const getProvider = (credentialType: string) => {
    if (credentialType === 'GithubFollowersGT10') {
      return githubFollowersProvider;
    }

    if (credentialType === 'GithubRepoStarsGT10') {
      return githubRepoProvider;
    }

    if (credentialType === 'GithubRepoCollaborator') {
      return githubRepoCollaboratorProvider;
    }

    if (credentialType === 'SpectCompletedTasksGT10') {
      return spectCompletedProvider;
    }

    if (credentialType === 'DeworkCompletedTasksGT10') {
      return deworkCompletedProvider;
    }

    if (credentialType === 'StackOverflowReputationGT1K') {
      return stackReputationProvider;
    }

    if (credentialType === 'StackOverflowScoreGT10') {
      return stackScoreProvider;
    }
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
      initialList={getIssuers('WorkExperience')}
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
