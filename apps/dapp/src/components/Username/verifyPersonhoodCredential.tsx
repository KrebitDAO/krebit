import { useContext } from 'react';
import krbToken from '@krebitdao/reputation-passport/dist/schemas/krbToken.json';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { constants } from 'utils';
import { GeneralContext } from 'context';
import {
  useDiscordProvider,
  useTwitterProvider,
  useTwitterFollowersProvider,
  useVeriffProvider,
  usePhoneProvider,
  useIssuerProvider
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
    twitterFollowers: {
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
    issuer: {
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
  const twitterFollowersProvider = useTwitterFollowersProvider();
  const veriffProvider = useVeriffProvider();
  const phoneProvider = usePhoneProvider();
  const issuerProvider = useIssuerProvider();

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
                  inputs:
                    twitterProvider.currentCredential ||
                    currentPersonhood.twitter.credential
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
          ,
          {currentVerify?.id === 'twitterFollowers' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  twitterFollowersProvider.currentCredential ||
                  currentPersonhood.twitterFollowers.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Enter your twitter follower count ( i.e. more than 1,000 would be gt1000 )'
                }
                form={{
                  inputs:
                    twitterFollowersProvider.currentCredential ||
                    currentPersonhood.twitterFollowers.credential
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
                    currentPersonhood.twitter.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'ceramic',
                              'credential',
                              twitterFollowersProvider.currentCredential ||
                                currentPersonhood.twitter.credential
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
                  currentPersonhood.twitterFollowers.stamp
                    ? 'Step completed, you can now check your stamp'
                    : 'Step 2 for Twitter verification'
                }
                form={{
                  button:
                    twitterFollowersProvider.currentStamp ||
                    currentPersonhood.twitterFollowers.stamp
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'polygon',
                              'stamp',
                              twitterFollowersProvider.currentStamp ||
                                currentPersonhood.twitterFollowers.stamp
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
                          onClick: phoneProvider.handleStampCredential
                        }
                }}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.id === 'issuer' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  issuerProvider.currentCredential ||
                  currentPersonhood.issuer.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Become an Issuer'
                }
                form={{
                  inputs:
                    issuerProvider.currentCredential ||
                    currentPersonhood.issuer.credential
                      ? undefined
                      : [
                          {
                            name: 'entity',
                            placeholder: 'Enter the Issuing Entity name',
                            value: issuerProvider.claimValues.entity,
                            onChange: issuerProvider.handleClaimValues
                          },
                          {
                            name: 'description',
                            placeholder: 'Enter the Issuing Entity description',
                            value: issuerProvider.claimValues.description,
                            onChange: issuerProvider.handleClaimValues
                          },
                          {
                            name: 'credentialType',
                            placeholder: 'Enter the credential type nme',
                            value: issuerProvider.claimValues.credentialType,
                            onChange: issuerProvider.handleClaimValues
                          },
                          {
                            name: 'credentialSchema',
                            placeholder:
                              'Enter the credential type JSON schema',
                            value: issuerProvider.claimValues.credentialSchema,
                            onChange: issuerProvider.handleClaimValues
                          },
                          {
                            name: 'imageUrl',
                            placeholder: 'Enter the Issuing Entity logo Url',
                            value: issuerProvider.claimValues.imageUrl,
                            onChange: issuerProvider.handleClaimValues
                          },
                          {
                            name: 'verificationUrl',
                            placeholder: 'Enter the Verification Url',
                            value: issuerProvider.claimValues.verificationUrl,
                            onChange: issuerProvider.handleClaimValues
                          },
                          {
                            name: 'did',
                            placeholder: 'Enter the issuer DID',
                            value: issuerProvider.claimValues.did,
                            onChange: issuerProvider.handleClaimValues
                          },
                          {
                            name: 'ethereumAddress',
                            placeholder: 'Enter the issuer Address',
                            value: issuerProvider.claimValues.ethereumAddress,
                            onChange: issuerProvider.handleClaimValues
                          },
                          {
                            type: 'number',
                            name: 'expirationMonths',
                            placeholder:
                              'Enter the number of expiration months for credentials',
                            value: issuerProvider.claimValues.expirationMonths,
                            onChange: issuerProvider.handleClaimValues
                          },
                          ,
                          {
                            type: 'number',
                            name: 'price',
                            placeholder:
                              'Enter the native token price for issuing this credential',
                            value: issuerProvider.claimValues.price,
                            onChange: issuerProvider.handleClaimValues
                          }
                        ],
                  button:
                    issuerProvider.currentCredential ||
                    currentPersonhood.issuer.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'ceramic',
                              'credential',
                              issuerProvider.currentCredential ||
                                currentPersonhood.issuer.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick: issuerProvider.handleGetCredential
                        }
                }}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  issuerProvider.currentStamp || currentPersonhood.issuer.stamp
                    ? 'Step completed, you can now check your stamp'
                    : 'Stamp verification on-chain'
                }
                form={{
                  button:
                    issuerProvider.currentStamp ||
                    currentPersonhood.issuer.stamp
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            handleCheckURL(
                              'polygon',
                              'stamp',
                              issuerProvider.currentStamp ||
                                currentPersonhood.issuer.stamp
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: issuerProvider.handleStampCredential
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
