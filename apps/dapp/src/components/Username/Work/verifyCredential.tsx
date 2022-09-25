import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { getIssuers, checkCredentialsURLs } from 'utils';
import { GeneralContext } from 'context';
import {
  useGithubProvider,
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
  const githubProvider = useGithubProvider();
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
      initialList={getIssuers('workExperience')}
      onClose={handleClose}
      verifyId={currentWork?.credential?.visualInformation?.credentialType}
      component={({ currentVerify }) => (
        <>
          {currentVerify?.credentialType === 'github' && (
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
                  githubProvider.currentCredential || currentWork?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your github profile'
                }
                form={{
                  inputs:
                    githubProvider.currentCredential || currentWork?.credential
                      ? undefined
                      : [
                          {
                            name: 'username',
                            placeholder: 'Enter you github username',
                            value: githubProvider.claimValues.username,
                            onChange: githubProvider.handleClaimValues
                          }
                        ],
                  button:
                    githubProvider.currentCredential || currentWork.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              githubProvider.currentCredential ||
                                currentWork?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !githubProvider.claimValues.username ||
                            githubProvider.claimValues.username === ''
                              ? undefined
                              : () => githubProvider.handleFetchOAuth(),
                          isDisabled:
                            !githubProvider.claimValues.username ||
                            githubProvider.claimValues.username === ''
                        }
                }}
                isLoading={githubProvider.status === 'credential_pending'}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  githubProvider.currentStamp ||
                  currentWork?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    githubProvider.currentStamp ||
                    currentWork?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'stamp',
                              githubProvider.currentStamp ||
                                currentWork?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: githubProvider.handleStampCredential
                        }
                }}
                isLoading={githubProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'githubFollowers' && (
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
                  currentWork.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your github follower count ( i.e. more than 1,000 would be gt1000 )'
                }
                form={{
                  inputs:
                    githubFollowersProvider.currentCredential ||
                    currentWork.credential
                      ? undefined
                      : [
                          {
                            name: 'followers',
                            placeholder:
                              'gt100 | gt500 | gt1000 | gt5K | gt10K | gt50K | gt100K | gt1M',
                            value:
                              githubFollowersProvider.claimValues.followers,
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
                                currentWork.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !githubFollowersProvider.claimValues.followers ||
                            githubFollowersProvider.claimValues.followers === ''
                              ? undefined
                              : () =>
                                  githubFollowersProvider.handleFetchOAuth(),
                          isDisabled:
                            !githubFollowersProvider.claimValues.followers ||
                            githubFollowersProvider.claimValues.followers === ''
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
                              'stamp',
                              githubFollowersProvider.currentStamp ||
                                currentWork.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: githubFollowersProvider.handleStampCredential
                        }
                }}
                isLoading={githubFollowersProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'githubRepoOwner' && (
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
                  inputs:
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
                              : () => githubRepoProvider.handleFetchOAuth(),
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
                              'stamp',
                              githubRepoProvider.currentStamp ||
                                currentWork?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: githubRepoProvider.handleStampCredential
                        }
                }}
                isLoading={githubRepoProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'githubRepoCollaborator' && (
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
                  inputs:
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
                                  githubRepoCollaboratorProvider.handleFetchOAuth(),
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
                              'stamp',
                              githubRepoCollaboratorProvider.currentStamp ||
                                currentWork?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick:
                            githubRepoCollaboratorProvider.handleStampCredential
                        }
                }}
                isLoading={
                  githubRepoCollaboratorProvider.status === 'stamp_pending'
                }
                iconType="stamp"
              />
            </>
          )}
        </>
      )}
    />
  );
};
