import { useContext } from 'react';
import krbToken from '@krebitdao/reputation-passport/dist/schemas/krbToken.json';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { constants } from 'utils';
import { GeneralContext } from 'context';
import {
  useDiscordProvider,
  useTwitterProvider,
  useVeriffProvider,
  usePhoneProvider
} from 'hooks';

interface IProps {
  currentPersonhood: {
    discord: {
      credential: Object;
      stamp: Object;
    };
    twitter: {
      credential: Object;
      stamp: Object;
    };
    veriff: {
      credential: Object;
      stamp: Object;
    };
    phone: {
      credential: Object;
      stamp: Object;
    };
  };
  onClose: () => void;
  verifyId?: string;
}

export const VerifyPersonhoodCredential = (props: IProps) => {
  const { currentPersonhood, onClose, verifyId } = props;
  const { walletInformation } = useContext(GeneralContext);
  const discordProvider = useDiscordProvider();
  const twitterProvider = useTwitterProvider();
  const veriffProvider = useVeriffProvider();
  const phoneProvider = usePhoneProvider();

  const handleCheckURL = (type: string, valuesType: string, values: any) => {
    let currentUrl: string;
    let value: string;

    if (valuesType === 'credential') {
      value = values?.vcId.replace('ceramic://', '');
    }

    if (valuesType === 'stamp') {
      value = values?.transaction;
    }

    if (type === 'ceramic') {
      currentUrl = `https://cerscan.com/testnet-clay/stream/${value}`;
    }

    if (type === 'polygon') {
      let url = krbToken[process.env.NEXT_PUBLIC_NETWORK]?.txUrl;

      currentUrl = `${url}${value}`;
    }

    window.open(currentUrl, '_blank');
  };

  return (
    <Verify
      initialList={constants.PERSONHOOD_CREDENTIALS}
      onClose={onClose}
      verifyId={verifyId}
      component={({ currentVerify }) => (
        <>
          {currentVerify?.id === 'discord' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  discordProvider.currentCredential ||
                  currentPersonhood.discord.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Step 1 for Discord verification'
                }
                form={{
                  button:
                    discordProvider.currentCredential ||
                    currentPersonhood.discord.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'ceramic',
                              'credential',
                              discordProvider.currentCredential ||
                                currentPersonhood.discord.credential
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
                  currentPersonhood.discord.stamp
                    ? 'Step completed, you can now check your stamp'
                    : 'Step 2 for Discord verification'
                }
                form={{
                  button:
                    discordProvider.currentStamp ||
                    currentPersonhood.discord.stamp
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'polygon',
                              'stamp',
                              discordProvider.currentStamp ||
                                currentPersonhood.discord.stamp
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
                  currentPersonhood.twitter.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Step 1 for Twitter verification'
                }
                form={{
                  button:
                    twitterProvider.currentCredential ||
                    currentPersonhood.twitter.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'ceramic',
                              'credential',
                              twitterProvider.currentCredential ||
                                currentPersonhood.twitter.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick: () =>
                            twitterProvider.handleFetchOAuth(
                              walletInformation.address
                            )
                        }
                }}
                isLoading={twitterProvider.status === 'credential_pending'}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  twitterProvider.currentStamp ||
                  currentPersonhood.twitter.stamp
                    ? 'Step completed, you can now check your stamp'
                    : 'Step 2 for Twitter verification'
                }
                form={{
                  button:
                    twitterProvider.currentStamp ||
                    currentPersonhood.twitter.stamp
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'polygon',
                              'stamp',
                              twitterProvider.currentStamp ||
                                currentPersonhood.twitter.stamp
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
          {currentVerify?.id === 'veriff' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  veriffProvider.currentCredential ||
                  currentPersonhood.veriff.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Enter your information'
                }
                form={{
                  inputs:
                    veriffProvider.currentCredential ||
                    currentPersonhood.veriff.credential
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
                    currentPersonhood.veriff.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'ceramic',
                              'credential',
                              veriffProvider.currentCredential ||
                                currentPersonhood.veriff.credential
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
                  veriffProvider.currentStamp || currentPersonhood.veriff.stamp
                    ? 'Step completed, you can now check your stamp'
                    : 'Step 2 to stamp verification'
                }
                form={{
                  button:
                    veriffProvider.currentStamp ||
                    currentPersonhood.veriff.stamp
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'polygon',
                              'stamp',
                              veriffProvider.currentStamp ||
                                currentPersonhood.veriff.stamp
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
          {currentVerify?.id === 'phone' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  phoneProvider.currentVerificationId
                    ? 'SMS code sent'
                    : 'Enter your information'
                }
                form={{
                  inputs:
                    phoneProvider.currentVerificationId ||
                    currentPersonhood.phone.credential
                      ? undefined
                      : [
                          {
                            type: 'number',
                            name: 'countryCode',
                            placeholder: '+',
                            value: phoneProvider.claimValues.countryCode,
                            onChange: phoneProvider.handleClaimValues
                          },
                          {
                            type: 'tel',
                            name: 'number',
                            placeholder: 'Enter phone number',
                            value: phoneProvider.claimValues.number,
                            onChange: phoneProvider.handleClaimValues
                          }
                        ],
                  button:
                    phoneProvider.currentVerificationId ||
                    currentPersonhood.phone.credential
                      ? {
                          text: 'Re-send SMS code',
                          onClick: () => {},
                          isDisabled: true
                        }
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
                  currentPersonhood.phone.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Get phone number credential via Twilio'
                }
                form={{
                  inputs:
                    phoneProvider.currentCredential ||
                    currentPersonhood.phone.credential
                      ? undefined
                      : [
                          {
                            type: 'SMS code',
                            name: 'code',
                            placeholder:
                              'Enter the SMS code sent to your phone',
                            value: phoneProvider.claimValues.code,
                            onChange: phoneProvider.handleClaimValues
                          }
                        ],
                  button:
                    phoneProvider.currentCredential ||
                    currentPersonhood.phone.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'ceramic',
                              'credential',
                              phoneProvider.currentCredential ||
                                currentPersonhood.phone.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick: phoneProvider.handleGetCredential
                        }
                }}
                iconType="credential"
              />
              <BoxStep
                title="Step 3"
                description={
                  phoneProvider.currentStamp || currentPersonhood.phone.stamp
                    ? 'Step completed, you can now check your stamp'
                    : 'Stamp verification on-chain'
                }
                form={{
                  button:
                    phoneProvider.currentStamp || currentPersonhood.phone.stamp
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'polygon',
                              'stamp',
                              phoneProvider.currentStamp ||
                                currentPersonhood.phone.stamp
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: veriffProvider.handleStampCredential
                        }
                }}
                iconType="stamp"
              />
            </>
          )}
        </>
      )}
    />
  );
};
