import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { getIssuers, checkCredentialsURLs } from 'utils';
import { GeneralContext } from 'context';
import {
  useGithubFollowersProvider,
  useGithubRepoProvider,
  useGithubRepoCollaboratorProvider
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

  const handleClose = () => {
    if (!window) return;

    // TODO: WE SHOULD USE onClose INSTEAD
    window.location.reload();
  };

  return (
    <Verify
      initialList={getIssuers('WorkExperience')}
      onClose={handleClose}
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
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  githubFollowersProvider.currentStamp ||
                  currentWork.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    githubFollowersProvider.currentStamp ||
                    currentWork.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              githubFollowersProvider.currentStamp ||
                                currentWork.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            githubFollowersProvider.handleStampCredential(
                              githubFollowersProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={githubFollowersProvider.status === 'stamp_pending'}
                iconType="stamp"
              />{' '}
              <BoxStep
                title="Step 3"
                description={
                  githubFollowersProvider.currentMint || currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
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
                          text: 'Mint NFT',
                          onClick: () =>
                            githubFollowersProvider.handleMintCredential(
                              githubFollowersProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={githubFollowersProvider.status === 'mint_pending'}
                iconType="nft"
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
                  githubRepoProvider.currentStamp ||
                  currentWork?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    githubRepoProvider.currentStamp ||
                    currentWork?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              githubRepoProvider.currentStamp ||
                                currentWork?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            githubRepoProvider.handleStampCredential(
                              githubRepoProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={githubRepoProvider.status === 'stamp_pending'}
                iconType="stamp"
              />{' '}
              <BoxStep
                title="Step 3"
                description={
                  githubRepoProvider.currentMint || currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
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
                          text: 'Mint NFT',
                          onClick: () =>
                            githubRepoProvider.handleMintCredential(
                              githubRepoProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={githubRepoProvider.status === 'mint_pending'}
                iconType="nft"
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
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  githubRepoCollaboratorProvider.currentStamp ||
                  currentWork?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    githubRepoCollaboratorProvider.currentStamp ||
                    currentWork?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              githubRepoCollaboratorProvider.currentStamp ||
                                currentWork?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            githubRepoCollaboratorProvider.handleStampCredential(
                              githubRepoProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                }}
                isLoading={
                  githubRepoCollaboratorProvider.status === 'stamp_pending'
                }
                iconType="stamp"
              />{' '}
              <BoxStep
                title="Step 3"
                description={
                  githubRepoCollaboratorProvider.currentMint ||
                  currentWork?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
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
                          text: 'Mint NFT',
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
                iconType="nft"
              />
            </>
          )}
        </>
      )}
    />
  );
};
