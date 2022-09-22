import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { constants, checkCredentialsURLs } from 'utils';
import { GeneralContext } from 'context';
import {
  useDiscordProvider,
  useTwitterProvider,
  useTwitterFollowersProvider,
  useVeriffProvider,
  usePhoneProvider,
  useEmailProvider,
  usePersonaProvider
} from 'hooks';

// types
import { ICredential } from 'utils/normalizeSchema';

interface IProps {
  currentPersonhood?: ICredential;
  onClose: () => void;
}

export const VerifyCredential = (props: IProps) => {
  const { currentPersonhood, onClose } = props;
  const { walletInformation } = useContext(GeneralContext);
  const discordProvider = useDiscordProvider();
  const twitterProvider = useTwitterProvider();
  const twitterFollowersProvider = useTwitterFollowersProvider();
  const veriffProvider = useVeriffProvider();
  const phoneProvider = usePhoneProvider();
  const emailProvider = useEmailProvider();
  const personaProvider = usePersonaProvider();

  const handleClose = () => {
    if (!window) return;

    // TODO: WE SHOULD USE onClose INSTEAD
    window.location.reload();
  };

  return (
    <Verify
      initialList={constants.PERSONHOOD_CREDENTIALS}
      onClose={handleClose}
      verifyId={currentPersonhood?.credential?.visualInformation?.id}
      component={({ currentVerify }) => (
        <>
          {currentVerify?.id === 'discord' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  discordProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your Discord profile'
                }
                form={{
                  button:
                    discordProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              discordProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick: discordProvider.handleFetchOAuth
                        }
                }}
                isLoading={discordProvider.status === 'credential_pending'}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  discordProvider.currentStamp ||
                  currentPersonhood?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    discordProvider.currentStamp ||
                    currentPersonhood?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'stamp',
                              discordProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: discordProvider.handleStampCredential
                        }
                }}
                isLoading={discordProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.id === 'twitter' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  twitterProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your twitter profile'
                }
                form={{
                  inputs:
                    twitterProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? undefined
                      : [
                          {
                            name: 'username',
                            placeholder: 'Enter you twitter handle',
                            value: twitterProvider.claimValues.username,
                            onChange: twitterProvider.handleClaimValues
                          }
                        ],
                  button:
                    twitterProvider.currentCredential ||
                    currentPersonhood.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              twitterProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !twitterProvider.claimValues.username ||
                            twitterProvider.claimValues.username === ''
                              ? undefined
                              : () =>
                                  twitterProvider.handleFetchOAuth(
                                    walletInformation.address
                                  ),
                          isDisabled:
                            !twitterProvider.claimValues.username ||
                            twitterProvider.claimValues.username === ''
                        }
                }}
                isLoading={twitterProvider.status === 'credential_pending'}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  twitterProvider.currentStamp ||
                  currentPersonhood?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    twitterProvider.currentStamp ||
                    currentPersonhood?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'stamp',
                              twitterProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: twitterProvider.handleStampCredential
                        }
                }}
                isLoading={twitterProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.id === 'twitterFollowers' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  twitterFollowersProvider.currentCredential ||
                  currentPersonhood.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your twitter follower count ( i.e. more than 1,000 would be gt1000 )'
                }
                form={{
                  inputs:
                    twitterFollowersProvider.currentCredential ||
                    currentPersonhood.credential
                      ? undefined
                      : [
                          {
                            name: 'followers',
                            placeholder:
                              'gt100 | gt500 | gt1000 | gt5K | gt10K | gt50K | gt100K | gt1M',
                            value:
                              twitterFollowersProvider.claimValues.followers,
                            onChange: twitterFollowersProvider.handleClaimValues
                          }
                        ],
                  button:
                    twitterFollowersProvider.currentCredential ||
                    currentPersonhood.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              twitterFollowersProvider.currentCredential ||
                                currentPersonhood.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !twitterFollowersProvider.claimValues.followers ||
                            twitterFollowersProvider.claimValues.followers ===
                              ''
                              ? undefined
                              : () =>
                                  twitterFollowersProvider.handleFetchOAuth(
                                    walletInformation.address
                                  ),
                          isDisabled:
                            !twitterFollowersProvider.claimValues.followers ||
                            twitterFollowersProvider.claimValues.followers ===
                              ''
                        }
                }}
                isLoading={
                  twitterFollowersProvider.status === 'credential_pending'
                }
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  twitterFollowersProvider.currentStamp ||
                  currentPersonhood.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    twitterFollowersProvider.currentStamp ||
                    currentPersonhood.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'stamp',
                              twitterFollowersProvider.currentStamp ||
                                currentPersonhood.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick:
                            twitterFollowersProvider.handleStampCredential
                        }
                }}
                isLoading={twitterFollowersProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.id === 'veriff' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  veriffProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your full legal name'
                }
                form={{
                  inputs:
                    veriffProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? undefined
                      : [
                          {
                            name: 'firstName',
                            placeholder: 'Enter you first name',
                            value: veriffProvider.claimValues.firstName,
                            onChange: veriffProvider.handleClaimValues
                          },
                          {
                            name: 'lastName',
                            placeholder: 'Enter you last name',
                            value: veriffProvider.claimValues.lastName,
                            onChange: veriffProvider.handleClaimValues
                          }
                        ],
                  button:
                    veriffProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              veriffProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !veriffProvider.claimValues.firstName ||
                            !veriffProvider.claimValues.lastName
                              ? undefined
                              : () =>
                                  veriffProvider.handleFetchOAuth(
                                    walletInformation.address
                                  ),
                          isDisabled:
                            !veriffProvider.claimValues.firstName ||
                            !veriffProvider.claimValues.lastName
                        }
                }}
                isLoading={veriffProvider.status === 'credential_pending'}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  veriffProvider.currentStamp ||
                  currentPersonhood?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    veriffProvider.currentStamp ||
                    currentPersonhood?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'stamp',
                              veriffProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: veriffProvider.handleStampCredential
                        }
                }}
                isLoading={veriffProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.id === 'persona' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  personaProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your full legal name'
                }
                form={{
                  inputs:
                    personaProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? undefined
                      : [
                          {
                            name: 'firstName',
                            placeholder: 'Enter you first name',
                            value: personaProvider.claimValues.firstName,
                            onChange: personaProvider.handleClaimValues
                          },
                          {
                            name: 'lastName',
                            placeholder: 'Enter you last name',
                            value: personaProvider.claimValues.lastName,
                            onChange: personaProvider.handleClaimValues
                          }
                        ],
                  button:
                    personaProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              personaProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !personaProvider.claimValues.firstName ||
                            !personaProvider.claimValues.lastName
                              ? undefined
                              : () => personaProvider.handleFetchOAuth(),
                          isDisabled:
                            !personaProvider.claimValues.firstName ||
                            !personaProvider.claimValues.lastName
                        }
                }}
                isLoading={personaProvider.status === 'credential_pending'}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  personaProvider.currentStamp ||
                  currentPersonhood?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    personaProvider.currentStamp ||
                    currentPersonhood?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'stamp',
                              personaProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: personaProvider.handleStampCredential
                        }
                }}
                isLoading={personaProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.id === 'phone' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  phoneProvider.currentVerificationId ||
                  currentPersonhood?.credential
                    ? 'SMS code sent'
                    : 'Claim your phone number'
                }
                form={{
                  inputs:
                    phoneProvider.currentVerificationId ||
                    currentPersonhood?.credential
                      ? undefined
                      : [
                          {
                            type: 'number',
                            name: 'countryCode',
                            placeholder: '+',
                            pattern: '^+[0-9]*',
                            value: phoneProvider.claimValues.countryCode,
                            onChange: phoneProvider.handleClaimValues
                          },
                          {
                            type: 'password',
                            pattern: '[0-9]*',
                            name: 'number',
                            placeholder: 'Enter phone number',
                            value: phoneProvider.claimValues.number,
                            onChange: phoneProvider.handleClaimValues
                          }
                        ],
                  button:
                    phoneProvider.currentVerificationId ||
                    currentPersonhood?.credential
                      ? undefined
                      : {
                          text: 'Send SMS code',
                          onClick:
                            !phoneProvider.claimValues.countryCode ||
                            !phoneProvider.claimValues.number
                              ? undefined
                              : phoneProvider.handleStartVerification,
                          isDisabled:
                            !phoneProvider.claimValues.countryCode ||
                            !phoneProvider.claimValues.number
                        }
                }}
                isLoading={phoneProvider.status === 'verification_pending'}
              />
              <BoxStep
                title="Step 2"
                description={
                  phoneProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Get phone number credential via Twilio'
                }
                form={{
                  inputs:
                    phoneProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? undefined
                      : [
                          {
                            type: 'number',
                            name: 'code',
                            placeholder:
                              'Enter the SMS code sent to your phone',
                            value: phoneProvider.claimValues.code,
                            onChange: phoneProvider.handleClaimValues
                          }
                        ],
                  button:
                    phoneProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              phoneProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick: phoneProvider.handleGetCredential
                        }
                }}
                iconType="credential"
                isLoading={phoneProvider.status === 'credential_pending'}
              />
              <BoxStep
                title="Step 3"
                description={
                  phoneProvider.currentStamp ||
                  currentPersonhood?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    phoneProvider.currentStamp ||
                    currentPersonhood?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'stamp',
                              phoneProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: phoneProvider.handleStampCredential
                        }
                }}
                iconType="stamp"
                isLoading={phoneProvider.status === 'stamp_pending'}
              />
            </>
          )}
          {currentVerify?.id === 'email' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  emailProvider.currentVerificationId ||
                  currentPersonhood?.credential
                    ? 'Verification code sent to your email'
                    : 'Claim your email address'
                }
                form={{
                  inputs:
                    emailProvider.currentVerificationId ||
                    currentPersonhood?.credential
                      ? undefined
                      : [
                          {
                            type: 'email',
                            name: 'email',
                            placeholder: 'username@example.com',
                            value: emailProvider.claimValues.email,
                            onChange: emailProvider.handleClaimValues
                          }
                        ],
                  button:
                    emailProvider.currentVerificationId ||
                    currentPersonhood?.credential
                      ? undefined
                      : {
                          text: 'Send Verification Code',
                          onClick: !emailProvider.claimValues.email
                            ? undefined
                            : emailProvider.handleStartVerification,
                          isDisabled: !emailProvider.claimValues.email
                        }
                }}
                isLoading={emailProvider.status === 'verification_pending'}
              />
              <BoxStep
                title="Step 2"
                description={
                  emailProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Get email credential via Twilio'
                }
                form={{
                  inputs:
                    emailProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? undefined
                      : [
                          {
                            type: 'number',
                            name: 'code',
                            placeholder:
                              'Enter the verification code sent to your email',
                            value: emailProvider.claimValues.code,
                            onChange: emailProvider.handleClaimValues
                          }
                        ],
                  button:
                    emailProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              emailProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick: emailProvider.handleGetCredential
                        }
                }}
                iconType="credential"
                isLoading={emailProvider.status === 'credential_pending'}
              />
              <BoxStep
                title="Step 3"
                description={
                  emailProvider.currentStamp ||
                  currentPersonhood?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    emailProvider.currentStamp ||
                    currentPersonhood?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'stamp',
                              emailProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: emailProvider.handleStampCredential
                        }
                }}
                iconType="stamp"
                isLoading={emailProvider.status === 'stamp_pending'}
              />
            </>
          )}
        </>
      )}
    />
  );
};
