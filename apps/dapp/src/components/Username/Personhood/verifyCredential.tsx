import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { getIssuers, checkCredentialsURLs } from 'utils';
import { GeneralContext } from 'context';
import {
  useDiscordProvider,
  useTwitterProvider,
  useVeriffProvider,
  usePhoneProvider,
  useEmailProvider,
  usePersonaProvider,
  useGithubProvider
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
  const veriffProvider = useVeriffProvider();
  const phoneProvider = usePhoneProvider();
  const emailProvider = useEmailProvider();
  const personaProvider = usePersonaProvider();
  const githubProvider = useGithubProvider();

  const handleClose = () => {
    if (!window) return;

    // TODO: WE SHOULD USE onClose INSTEAD
    window.location.reload();
  };

  const handleCleanState = (credentialType: string) => {
    if (credentialType === 'Discord') {
      discordProvider.handleCleanClaimValues();
    }

    if (credentialType === 'Twitter') {
      twitterProvider.handleCleanClaimValues();
    }

    if (credentialType === 'Veriff') {
      veriffProvider.handleCleanClaimValues();
    }

    if (credentialType === 'Phone') {
      phoneProvider.handleCleanClaimValues();
    }

    if (credentialType === 'Email') {
      emailProvider.handleCleanClaimValues();
    }

    if (credentialType === 'Persona') {
      personaProvider.handleCleanClaimValues();
    }

    if (credentialType === 'Github') {
      githubProvider.handleCleanClaimValues();
    }
  };

  return (
    <Verify
      initialList={getIssuers('Personhood')}
      onClose={handleClose}
      onClean={handleCleanState}
      verifyId={
        currentPersonhood?.credential?.visualInformation?.credentialType
      }
      component={({ currentVerify }) => (
        <>
          {currentVerify?.credentialType === 'Discord' && (
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
                  discordProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your Discord profile'
                }
                form={{
                  fields:
                    discordProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? undefined
                      : [
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: discordProvider.claimValues.private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: discordProvider.claimValues.private,
                            onChange: discordProvider.handleClaimValues
                          }
                        ],
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
                          onClick: () =>
                            discordProvider.handleFetchOAuth(currentVerify)
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
                              'tx',
                              discordProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            discordProvider.handleStampCredential(
                              discordProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={discordProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
              <BoxStep
                title="Step 3"
                description={
                  discordProvider.currentMint || currentPersonhood?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
                }
                form={{
                  button:
                    discordProvider.currentMint || currentPersonhood?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              discordProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint NFT',
                          onClick: () =>
                            discordProvider.handleMintCredential(
                              discordProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={discordProvider.status === 'mint_pending'}
                iconType="nft"
              />
            </>
          )}
          {currentVerify?.credentialType === 'Twitter' && (
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
                  twitterProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your twitter profile'
                }
                form={{
                  fields:
                    twitterProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? undefined
                      : [
                          {
                            name: 'username',
                            placeholder: 'Enter you twitter handle',
                            value: twitterProvider.claimValues.username,
                            onChange: twitterProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: twitterProvider.claimValues.private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: twitterProvider.claimValues.private,
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
                                    walletInformation.address,
                                    currentVerify
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
                              'tx',
                              twitterProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            twitterProvider.handleStampCredential(
                              twitterProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={twitterProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
              <BoxStep
                title="Step 3"
                description={
                  twitterProvider.currentMint || currentPersonhood?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
                }
                form={{
                  button:
                    twitterProvider.currentMint || currentPersonhood?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              twitterProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint NFT',
                          onClick: () =>
                            twitterProvider.handleMintCredential(
                              twitterProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={twitterProvider.status === 'mint_pending'}
                iconType="nft"
              />
            </>
          )}
          {currentVerify?.credentialType === 'Github' && (
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
                  githubProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your github profile'
                }
                form={{
                  fields:
                    githubProvider.currentCredential ||
                    currentPersonhood?.credential
                      ? undefined
                      : [
                          {
                            name: 'username',
                            placeholder: 'Enter you github username',
                            value: githubProvider.claimValues.username,
                            onChange: githubProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: githubProvider.claimValues.private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: githubProvider.claimValues.private,
                            onChange: githubProvider.handleClaimValues
                          }
                        ],
                  button:
                    githubProvider.currentCredential ||
                    currentPersonhood.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              githubProvider.currentCredential ||
                                currentPersonhood?.credential
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
                                    currentVerify
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
                  currentPersonhood?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    githubProvider.currentStamp ||
                    currentPersonhood?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              githubProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            githubProvider.handleStampCredential(
                              githubProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={githubProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
              <BoxStep
                title="Step 3"
                description={
                  githubProvider.currentMint || currentPersonhood?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
                }
                form={{
                  button:
                    githubProvider.currentMint || currentPersonhood?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              githubProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint NFT',
                          onClick: () =>
                            githubProvider.handleMintCredential(
                              githubProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={githubProvider.status === 'mint_pending'}
                iconType="nft"
              />
            </>
          )}
          {currentVerify?.credentialType === 'Veriff' && (
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
                  veriffProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your full legal name'
                }
                form={{
                  fields:
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
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: veriffProvider.claimValues.private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: veriffProvider.claimValues.private,
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
                                    walletInformation.address,
                                    currentVerify
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
                              'tx',
                              veriffProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            veriffProvider.handleStampCredential(
                              veriffProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={veriffProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
              <BoxStep
                title="Step 3"
                description={
                  veriffProvider.currentMint || currentPersonhood?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
                }
                form={{
                  button:
                    veriffProvider.currentMint || currentPersonhood?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              veriffProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint NFT',
                          onClick: () =>
                            veriffProvider.handleMintCredential(
                              veriffProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={veriffProvider.status === 'mint_pending'}
                iconType="nft"
              />
            </>
          )}
          {currentVerify?.credentialType === 'Persona' && (
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
                  personaProvider.currentCredential ||
                  currentPersonhood?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your full legal name'
                }
                form={{
                  fields:
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
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: personaProvider.claimValues.private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: personaProvider.claimValues.private,
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
                              : () =>
                                  personaProvider.handleFetchOAuth(
                                    currentVerify
                                  ),
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
                              'tx',
                              personaProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            personaProvider.handleStampCredential(
                              personaProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={personaProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
              <BoxStep
                title="Step 3"
                description={
                  personaProvider.currentMint || currentPersonhood?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
                }
                form={{
                  button:
                    personaProvider.currentMint || currentPersonhood?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              personaProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint NFT',
                          onClick: () =>
                            personaProvider.handleMintCredential(
                              personaProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={personaProvider.status === 'mint_pending'}
                iconType="nft"
              />
            </>
          )}
          {currentVerify?.credentialType === 'Phone' && (
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
                  phoneProvider.currentVerificationId ||
                  currentPersonhood?.credential
                    ? 'SMS code sent'
                    : 'Claim your phone number'
                }
                form={{
                  fields:
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
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: phoneProvider.claimValues.private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: phoneProvider.claimValues.private,
                            onChange: phoneProvider.handleClaimValues
                          }
                        ],
                  button:
                    phoneProvider.currentVerificationId ||
                    currentPersonhood?.credential
                      ? undefined
                      : {
                          text: 'Send code',
                          onClick:
                            !phoneProvider.claimValues.countryCode ||
                            !phoneProvider.claimValues.number
                              ? undefined
                              : () =>
                                  phoneProvider.handleStartVerification(
                                    currentVerify
                                  ),
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
                  fields:
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
                              'tx',
                              phoneProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            phoneProvider.handleStampCredential(
                              phoneProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                iconType="stamp"
                isLoading={phoneProvider.status === 'stamp_pending'}
              />
              <BoxStep
                title="Step 4"
                description={
                  phoneProvider.currentMint || currentPersonhood?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
                }
                form={{
                  button:
                    phoneProvider.currentMint || currentPersonhood?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              phoneProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint NFT',
                          onClick: () =>
                            phoneProvider.handleMintCredential(
                              phoneProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={phoneProvider.status === 'mint_pending'}
                iconType="nft"
              />
            </>
          )}
          {currentVerify?.credentialType === 'Email' && (
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
                  emailProvider.currentVerificationId ||
                  currentPersonhood?.credential
                    ? 'Verification code sent to your email'
                    : 'Claim your email address'
                }
                form={{
                  fields:
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
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: emailProvider.claimValues.private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: emailProvider.claimValues.private,
                            onChange: emailProvider.handleClaimValues
                          }
                        ],
                  button:
                    emailProvider.currentVerificationId ||
                    currentPersonhood?.credential
                      ? undefined
                      : {
                          text: 'Send Code',
                          onClick: !emailProvider.claimValues.email
                            ? undefined
                            : () =>
                                emailProvider.handleStartVerification(
                                  currentVerify
                                ),
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
                  fields:
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
                              'tx',
                              emailProvider.currentStamp ||
                                currentPersonhood?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            emailProvider.handleStampCredential(
                              emailProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                iconType="stamp"
                isLoading={emailProvider.status === 'stamp_pending'}
              />
              <BoxStep
                title="Step 4"
                description={
                  emailProvider.currentMint || currentPersonhood?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
                }
                form={{
                  button:
                    emailProvider.currentMint || currentPersonhood?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              emailProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint NFT',
                          onClick: () =>
                            emailProvider.handleMintCredential(
                              emailProvider.currentCredential ||
                                currentPersonhood?.credential
                            )
                        }
                }}
                isLoading={emailProvider.status === 'mint_pending'}
                iconType="nft"
              />
            </>
          )}
        </>
      )}
    />
  );
};
