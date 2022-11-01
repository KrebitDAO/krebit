import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { getIssuers, checkCredentialsURLs } from 'utils';
import {
  useGithubFollowersProvider,
  useGithubRepoProvider,
  useGithubRepoCollaboratorProvider,
  useSpectCompletedProvider,
  useDeworkCompletedProvider,
  useStackReputationProvider
} from 'hooks';

// types
import { ICredential } from 'utils/normalizeSchema';

interface IProps {
  currentWork: ICredential;
  getInformation: () => Promise<void>;
  onClose: () => void;
}

export const VerifyCredential = (props: IProps) => {
  const { currentWork, getInformation, onClose } = props;
  const githubFollowersProvider = useGithubFollowersProvider();
  const githubRepoProvider = useGithubRepoProvider();
  const githubRepoCollaboratorProvider = useGithubRepoCollaboratorProvider();
  const spectCompletedProvider = useSpectCompletedProvider();
  const deworkCompletedProvider = useDeworkCompletedProvider();
  const stackReputationProvider = useStackReputationProvider();

  const handleClose = async (credentialType: string) => {
    let isStatusResolved = false;

    if (credentialType === 'GithubFollowersGT10') {
      isStatusResolved =
        githubFollowersProvider.status === 'credential_resolved' ||
        githubFollowersProvider.status === 'mint_resolved';
    }

    if (credentialType === 'GithubRepoStarsGT10') {
      isStatusResolved =
        githubRepoProvider.status === 'credential_resolved' ||
        githubRepoProvider.status === 'mint_resolved';
    }

    if (credentialType === 'GithubRepoCollaborator') {
      isStatusResolved =
        githubRepoCollaboratorProvider.status === 'credential_resolved' ||
        githubRepoCollaboratorProvider.status === 'mint_resolved';
    }

    if (credentialType === 'SpectCompletedTasksGT10') {
      isStatusResolved =
        spectCompletedProvider.status === 'credential_resolved' ||
        spectCompletedProvider.status === 'mint_resolved';
    }

    if (credentialType === 'DeworkCompletedTasksGT10') {
      isStatusResolved =
        deworkCompletedProvider.status === 'credential_resolved' ||
        deworkCompletedProvider.status === 'mint_resolved';
    }

    if (credentialType === 'StackOverflowReputationGT1K') {
      isStatusResolved =
        stackReputationProvider.status === 'credential_resolved' ||
        stackReputationProvider.status === 'mint_resolved';
    }

    if (isStatusResolved) {
      await getInformation();
    }

    onClose();
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

    if (credentialType === 'DeworkCompletedTasksGT10') {
      deworkCompletedProvider.handleCleanClaimValues();
    }

    if (credentialType === 'StackOverflowReputationGT1K') {
      stackReputationProvider.handleCleanClaimValues();
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
                    : 'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
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
                loadingMessage={githubRepoProvider.statusMessage}
                isError={githubRepoProvider.status === 'credential_rejected'}
                errorMessage={githubRepoProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  githubRepoProvider.currentMint || currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
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
                    : 'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
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
                loadingMessage={githubRepoCollaboratorProvider.statusMessage}
                isError={
                  githubRepoCollaboratorProvider.status === 'mint_rejected'
                }
                errorMessage={githubRepoCollaboratorProvider.errorMessage}
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
                    : 'Claim your Spect completed tasks'
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
                loadingMessage={spectCompletedProvider.statusMessage}
                isError={
                  spectCompletedProvider.status === 'credential_rejected'
                }
                errorMessage={spectCompletedProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  spectCompletedProvider.currentMint || currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
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
          {currentVerify?.credentialType === 'DeworkCompletedTasksGT10' && (
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
                  deworkCompletedProvider.currentCredential ||
                  currentWork?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your Dework completed tasks'
                }
                form={{
                  fields:
                    deworkCompletedProvider.currentCredential ||
                    currentWork?.credential
                      ? undefined
                      : [
                          {
                            name: 'organization',
                            placeholder: 'Enter the Dework organization',
                            value:
                              deworkCompletedProvider.claimValues.organization,
                            onChange: deworkCompletedProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: deworkCompletedProvider.claimValues
                              .private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: deworkCompletedProvider.claimValues.private,
                            onChange: deworkCompletedProvider.handleClaimValues
                          }
                        ],
                  button:
                    deworkCompletedProvider.currentCredential ||
                    currentWork.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              deworkCompletedProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !deworkCompletedProvider.claimValues.organization ||
                            deworkCompletedProvider.claimValues.organization ===
                              ''
                              ? undefined
                              : () =>
                                  deworkCompletedProvider.handleGetCredential(
                                    currentVerify
                                  ),
                          isDisabled:
                            !deworkCompletedProvider.claimValues.organization ||
                            deworkCompletedProvider.claimValues.organization ===
                              ''
                        }
                }}
                isLoading={
                  deworkCompletedProvider.status === 'credential_pending'
                }
                loadingMessage={deworkCompletedProvider.statusMessage}
                isError={
                  deworkCompletedProvider.status === 'credential_rejected'
                }
                errorMessage={deworkCompletedProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  deworkCompletedProvider.currentMint || currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
                }
                form={{
                  button:
                    deworkCompletedProvider.currentMint || currentWork?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              deworkCompletedProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            deworkCompletedProvider.handleMintCredential(
                              deworkCompletedProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={deworkCompletedProvider.status === 'mint_pending'}
                loadingMessage={deworkCompletedProvider.statusMessage}
                isError={deworkCompletedProvider.status === 'mint_rejected'}
                errorMessage={deworkCompletedProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'StackOverflowReputationGT1K' && (
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
                  stackReputationProvider.currentCredential ||
                  currentWork?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim that your StackOverflow profile has more than 1K of reputation'
                }
                form={{
                  fields:
                    stackReputationProvider.currentCredential ||
                    currentWork?.credential
                      ? undefined
                      : [
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: stackReputationProvider.claimValues
                              .private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: stackReputationProvider.claimValues.private,
                            onChange: stackReputationProvider.handleClaimValues
                          }
                        ],
                  button:
                    stackReputationProvider.currentCredential ||
                    currentWork.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              stackReputationProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick: () =>
                            stackReputationProvider.handleFetchOAuth(
                              currentVerify
                            )
                        }
                }}
                isLoading={
                  stackReputationProvider.status === 'credential_pending'
                }
                loadingMessage={stackReputationProvider.statusMessage}
                isError={
                  stackReputationProvider.status === 'credential_rejected'
                }
                errorMessage={stackReputationProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  stackReputationProvider.currentMint || currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
                }
                form={{
                  button:
                    stackReputationProvider.currentMint || currentWork?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              stackReputationProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            stackReputationProvider.handleMintCredential(
                              stackReputationProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={stackReputationProvider.status === 'mint_pending'}
                loadingMessage={stackReputationProvider.statusMessage}
                isError={stackReputationProvider.status === 'mint_rejected'}
                errorMessage={stackReputationProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
        </>
      )}
    />
  );
};
