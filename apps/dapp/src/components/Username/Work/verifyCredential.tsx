import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { constants, checkCredentialsURLs } from 'utils';
import { GeneralContext } from 'context';
import { useGithubProvider } from 'hooks';

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
        </>
      )}
    />
  );
};
