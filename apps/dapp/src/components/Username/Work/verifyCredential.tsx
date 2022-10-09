import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { getIssuers, checkCredentialsURLs } from 'utils';
import { GeneralContext } from 'context';
import {
  useGithubFollowersProvider,
  useGithubRepoProvider,
  useGithubRepoCollaboratorProvider,
  useSpectCompletedProvider
} from 'hooks';

// types
import { ICredential } from 'utils/normalizeSchema';

interface IProps {
  currentWork: ICredential;
  onClose: () => void;
}

export const VerifyCredential = (props: IProps) => {
  const { currentWork, onClose } = props;
  const { walletInformation } = useContext(GeneralContext);
  const githubFollowersProvider = useGithubFollowersProvider();
  const githubRepoProvider = useGithubRepoProvider();
  const githubRepoCollaboratorProvider = useGithubRepoCollaboratorProvider();
  const spectCompletedProvider = useSpectCompletedProvider();

  const handleClose = () => {
    if (!window) return;

    // TODO: WE SHOULD USE onClose INSTEAD
    window.location.reload();
  };

  const handleCleanState = (credentialType: string) => {
    if (credentialType === 'GithubFollowersGT10') {
      githubFollowersProvider.handleCleanClaimValues();
    }

    if (credentialType === 'GithubRepoStarsGT10') {
      githubRepoProvider.handleCleanClaimValues();
    }

    if (credentialType === 'GithubRepoCollaborator') {
      githubRepoCollaboratorProvider.handleCleanClaimValues();
    }

    if (credentialType === 'SpectCompletedTasksGT10') {
      spectCompletedProvider.handleCleanClaimValues();
    }
  };

  return (
    <Verify
      initialList={getIssuers('WorkExperience')}
      onClose={handleClose}
      onClean={handleCleanState}
      verifyId={currentWork?.credential?.visualInformation?.credentialType}
      component={({ currentVerify }) => (
        <>
          {currentVerify?.credentialType === 'GithubFollowersGT10' && (
            <>
              <BoxStep
                title="Issuer Details:"
                description={currentVerify.description}
                did={currentVerify.did}
                icon={currentVerify.icon}
                verificationUrl={currentVerify.verificationUrl}
                price={currentVerify.price}
              />
              <BoxStep
                title="Step 1"
                description={
                  githubFollowersProvider.currentCredential ||
                  currentWork?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim that your github profile has more than 10 followers'
                }
                form={{
                  fields:
                    githubFollowersProvider.currentCredential ||
                    currentWork?.credential
                      ? undefined
                      : [
                          {
                            name: 'username',
                            placeholder: 'Enter you github username',
                            value: githubFollowersProvider.claimValues.username,
                            onChange: githubFollowersProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: githubFollowersProvider.claimValues
                              .private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: githubFollowersProvider.claimValues.private,
                            onChange: githubFollowersProvider.handleClaimValues
                          }
                        ],
                  button:
                    githubFollowersProvider.currentCredential ||
                    currentWork.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              githubFollowersProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !githubFollowersProvider.claimValues.username ||
                            githubFollowersProvider.claimValues.username === ''
                              ? undefined
                              : () =>
                                  githubFollowersProvider.handleFetchOAuth(
                                    currentVerify
                                  ),
                          isDisabled:
                            !githubFollowersProvider.claimValues.username ||
                            githubFollowersProvider.claimValues.username === ''
                        }
                }}
                isLoading={
                  githubFollowersProvider.status === 'credential_pending'
                }
                loadingMessage={githubFollowersProvider.statusMessage}
                isError={
                  githubFollowersProvider.status === 'credential_rejected'
                }
                errorMessage={githubFollowersProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  githubFollowersProvider.currentMint || currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    githubFollowersProvider.currentMint || currentWork?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              githubFollowersProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            githubFollowersProvider.handleMintCredential(
                              githubFollowersProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={githubFollowersProvider.status === 'mint_pending'}
                loadingMessage={githubFollowersProvider.statusMessage}
                isError={githubFollowersProvider.status === 'mint_rejected'}
                errorMessage={githubFollowersProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'GithubRepoStarsGT10' && (
            <>
              <BoxStep
                title="Issuer Details:"
                description={currentVerify.description}
                did={currentVerify.did}
                icon={currentVerify.icon}
                verificationUrl={currentVerify.verificationUrl}
                price={currentVerify.price}
              />
              <BoxStep
                title="Step 1"
                description={
                  githubRepoProvider.currentCredential ||
                  currentWork?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your github repo'
                }
                form={{
                  fields:
                    githubRepoProvider.currentCredential ||
                    currentWork?.credential
                      ? undefined
                      : [
                          {
                            name: 'username',
                            placeholder: 'Enter you github username',
                            value: githubRepoProvider.claimValues.username,
                            onChange: githubRepoProvider.handleClaimValues
                          },
                          {
                            name: 'repository',
                            placeholder: 'Enter the github repository',
                            value: githubRepoProvider.claimValues.repository,
                            onChange: githubRepoProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: githubRepoProvider.claimValues.private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: githubRepoProvider.claimValues.private,
                            onChange: githubRepoProvider.handleClaimValues
                          }
                        ],
                  button:
                    githubRepoProvider.currentCredential ||
                    currentWork.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              githubRepoProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !githubRepoProvider.claimValues.username ||
                            githubRepoProvider.claimValues.username === ''
                              ? undefined
                              : () =>
                                  githubRepoProvider.handleFetchOAuth(
                                    currentVerify
                                  ),
                          isDisabled:
                            !githubRepoProvider.claimValues.username ||
                            githubRepoProvider.claimValues.username === ''
                        }
                }}
                isLoading={githubRepoProvider.status === 'credential_pending'}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  githubRepoProvider.currentMint || currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    githubRepoProvider.currentMint || currentWork?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              githubRepoProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            githubRepoProvider.handleMintCredential(
                              githubRepoProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={githubRepoProvider.status === 'mint_pending'}
                loadingMessage={githubRepoProvider.statusMessage}
                isError={githubRepoProvider.status === 'mint_rejected'}
                errorMessage={githubRepoProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'GithubRepoCollaborator' && (
            <>
              <BoxStep
                title="Issuer Details:"
                description={currentVerify.description}
                did={currentVerify.did}
                icon={currentVerify.icon}
                verificationUrl={currentVerify.verificationUrl}
                price={currentVerify.price}
              />
              <BoxStep
                title="Step 1"
                description={
                  githubRepoCollaboratorProvider.currentCredential ||
                  currentWork?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim that you are a github repo collaborator'
                }
                form={{
                  fields:
                    githubRepoCollaboratorProvider.currentCredential ||
                    currentWork?.credential
                      ? undefined
                      : [
                          {
                            name: 'username',
                            placeholder: 'Enter you github username',
                            value:
                              githubRepoCollaboratorProvider.claimValues
                                .username,
                            onChange:
                              githubRepoCollaboratorProvider.handleClaimValues
                          },

                          {
                            name: 'owner',
                            placeholder: 'Enter the github repository owner',
                            value:
                              githubRepoCollaboratorProvider.claimValues.owner,
                            onChange:
                              githubRepoCollaboratorProvider.handleClaimValues
                          },
                          {
                            name: 'repository',
                            placeholder: 'Enter the github repository',
                            value:
                              githubRepoCollaboratorProvider.claimValues
                                .repository,
                            onChange:
                              githubRepoCollaboratorProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: githubRepoCollaboratorProvider
                              .claimValues.private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value:
                              githubRepoCollaboratorProvider.claimValues
                                .private,
                            onChange:
                              githubRepoCollaboratorProvider.handleClaimValues
                          }
                        ],
                  button:
                    githubRepoCollaboratorProvider.currentCredential ||
                    currentWork.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              githubRepoCollaboratorProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !githubRepoCollaboratorProvider.claimValues
                              .username ||
                            githubRepoCollaboratorProvider.claimValues
                              .username === ''
                              ? undefined
                              : () =>
                                  githubRepoCollaboratorProvider.handleFetchOAuth(
                                    currentVerify
                                  ),
                          isDisabled:
                            !githubRepoCollaboratorProvider.claimValues
                              .username ||
                            githubRepoCollaboratorProvider.claimValues
                              .username === ''
                        }
                }}
                isLoading={
                  githubRepoCollaboratorProvider.status === 'credential_pending'
                }
                loadingMessage={githubRepoCollaboratorProvider.statusMessage}
                isError={
                  githubRepoCollaboratorProvider.status ===
                  'credential_rejected'
                }
                errorMessage={githubRepoCollaboratorProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  githubRepoCollaboratorProvider.currentMint ||
                  currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    githubRepoCollaboratorProvider.currentMint ||
                    currentWork?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              githubRepoCollaboratorProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            githubRepoCollaboratorProvider.handleMintCredential(
                              githubRepoCollaboratorProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={
                  githubRepoCollaboratorProvider.status === 'mint_pending'
                }
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'SpectCompletedTasksGT10' && (
            <>
              <BoxStep
                title="Issuer Details:"
                description={currentVerify.description}
                did={currentVerify.did}
                icon={currentVerify.icon}
                verificationUrl={currentVerify.verificationUrl}
                price={currentVerify.price}
              />
              <BoxStep
                title="Step 1"
                description={
                  spectCompletedProvider.currentCredential ||
                  currentWork?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your github repo'
                }
                form={{
                  fields:
                    spectCompletedProvider.currentCredential ||
                    currentWork?.credential
                      ? undefined
                      : [
                          {
                            name: 'circle',
                            placeholder: 'Enter the spect circle',
                            value: spectCompletedProvider.claimValues.circle,
                            onChange: spectCompletedProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: spectCompletedProvider.claimValues
                              .private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: spectCompletedProvider.claimValues.private,
                            onChange: spectCompletedProvider.handleClaimValues
                          }
                        ],
                  button:
                    spectCompletedProvider.currentCredential ||
                    currentWork.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              spectCompletedProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !spectCompletedProvider.claimValues.circle ||
                            spectCompletedProvider.claimValues.circle === ''
                              ? undefined
                              : () =>
                                  spectCompletedProvider.handleGetCredential(
                                    currentVerify
                                  ),
                          isDisabled:
                            !spectCompletedProvider.claimValues.circle ||
                            spectCompletedProvider.claimValues.circle === ''
                        }
                }}
                isLoading={
                  spectCompletedProvider.status === 'credential_pending'
                }
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  spectCompletedProvider.currentMint || currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    spectCompletedProvider.currentMint || currentWork?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              spectCompletedProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            spectCompletedProvider.handleMintCredential(
                              spectCompletedProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={spectCompletedProvider.status === 'mint_pending'}
                loadingMessage={spectCompletedProvider.statusMessage}
                isError={spectCompletedProvider.status === 'mint_rejected'}
                errorMessage={spectCompletedProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
        </>
      )}
    />
  );
};
