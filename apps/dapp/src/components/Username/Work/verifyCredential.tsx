import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { constants, checkCredentialsURLs } from 'utils';
import { GeneralContext } from 'context';
import { useGithubProvider, useGithubFollowersProvider } from 'hooks';

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

  const handleClose = () => {
    if (!window) return;

    // TODO: WE SHOULD USE onClose INSTEAD
    window.location.reload();
  };

  return (
    <Verify
      initialList={constants.WORK_CREDENTIALS}
      onClose={handleClose}
      verifyId={currentWork?.credential?.visualInformation?.id}
      component={({ currentVerify }) => (
        <>
          {currentVerify?.id === 'github' && (
            <>
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
                              : () =>
                                  githubProvider.handleFetchOAuth(
                                    walletInformation.address
                                  ),
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
          {currentVerify?.id === 'githubFollowers' && (
            <>
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
                                  githubFollowersProvider.handleFetchOAuth(
                                    walletInformation.address
                                  ),
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
        </>
      )}
    />
  );
};
