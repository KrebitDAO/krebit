import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { getIssuers, checkCredentialsURLs, guildXyz } from 'utils';
import { GeneralContext } from 'context';
import {
  useIssuerProvider,
  useGithubOrgMemberProvider,
  useDiscordGuildOwnerProvider,
  useDiscordGuildMemberProvider,
  useTwitterFollowersProvider,
  useGuildXyzMemberProvider
} from 'hooks';

// types
import { ICredential } from 'utils/normalizeSchema';

interface IProps {
  currentCommunity: ICredential;
  getInformation: () => Promise<void>;
  onClose: () => void;
}

export const VerifyCredential = (props: IProps) => {
  const { currentCommunity, getInformation, onClose } = props;
  const { walletInformation } = useContext(GeneralContext);
  const issuerProvider = useIssuerProvider();
  const githubOrgMemberProvider = useGithubOrgMemberProvider();
  const discordGuildOwnerProvider = useDiscordGuildOwnerProvider();
  const discordGuildMemberProvider = useDiscordGuildMemberProvider();
  const twitterFollowersProvider = useTwitterFollowersProvider();
  const guildXyzMemberProvider = useGuildXyzMemberProvider();

  const handleClose = async (credentialType: string) => {
    let isStatusResolved = false;

    if (credentialType === 'Issuer') {
      isStatusResolved =
        issuerProvider.status === 'credential_resolved' ||
        issuerProvider.status === 'mint_resolved';
    }

    if (credentialType === 'GithubOrgMember') {
      isStatusResolved =
        githubOrgMemberProvider.status === 'credential_resolved' ||
        githubOrgMemberProvider.status === 'mint_resolved';
    }

    if (credentialType === 'GuildXyzMember') {
      isStatusResolved =
        guildXyzMemberProvider.status === 'credential_resolved' ||
        guildXyzMemberProvider.status === 'mint_resolved';
    }

    if (credentialType === 'DiscordGuildOwner') {
      isStatusResolved =
        discordGuildOwnerProvider.status === 'credential_resolved' ||
        discordGuildOwnerProvider.status === 'mint_resolved';
    }

    if (credentialType === 'DiscordGuildMember') {
      isStatusResolved =
        discordGuildMemberProvider.status === 'credential_resolved' ||
        discordGuildMemberProvider.status === 'mint_resolved';
    }

    if (credentialType === 'TwitterFollowersGT1K') {
      isStatusResolved =
        twitterFollowersProvider.status === 'credential_resolved' ||
        twitterFollowersProvider.status === 'mint_resolved';
    }

    if (credentialType === 'TwitterFollowersGT10K') {
      isStatusResolved =
        twitterFollowersProvider.status === 'credential_resolved' ||
        twitterFollowersProvider.status === 'mint_resolved';
    }

    if (isStatusResolved) {
      await getInformation();
    }

    onClose();
  };

  const handleCleanState = (credentialType: string) => {
    if (credentialType === 'Issuer') {
      issuerProvider.handleCleanClaimValues();
    }

    if (credentialType === 'GithubOrgMember') {
      githubOrgMemberProvider.handleCleanClaimValues();
    }

    if (credentialType === 'GuildXyzMember') {
      guildXyzMemberProvider.handleCleanClaimValues();
    }

    if (credentialType === 'DiscordGuildOwner') {
      discordGuildOwnerProvider.handleCleanClaimValues();
    }

    if (credentialType === 'DiscordGuildMember') {
      discordGuildMemberProvider.handleCleanClaimValues();
    }

    if (credentialType === 'TwitterFollowersGT1K') {
      twitterFollowersProvider.handleCleanClaimValues();
    }

    if (credentialType === 'TwitterFollowersGT10K') {
      twitterFollowersProvider.handleCleanClaimValues();
    }
  };

  return (
    <Verify
      initialList={getIssuers('Community')}
      onClose={handleClose}
      onClean={handleCleanState}
      verifyId={currentCommunity?.credential?.visualInformation?.credentialType}
      component={({ currentVerify }) => (
        <>
          {currentVerify?.credentialType === 'TwitterFollowersGT1K' && (
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
                  twitterFollowersProvider.currentCredential ||
                  currentCommunity?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim that your twitter follower count is more than 1,000'
                }
                form={{
                  fields:
                    twitterFollowersProvider.currentCredential ||
                    currentCommunity?.credential
                      ? undefined
                      : [
                          {
                            name: 'username',
                            placeholder: 'Enter you twitter handle',
                            value:
                              twitterFollowersProvider.claimValues.username,
                            onChange: twitterFollowersProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: twitterFollowersProvider.claimValues
                              .private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: twitterFollowersProvider.claimValues.private,
                            onChange: twitterFollowersProvider.handleClaimValues
                          }
                        ],
                  button:
                    twitterFollowersProvider.currentCredential ||
                    currentCommunity.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              twitterFollowersProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !twitterFollowersProvider.claimValues.username ||
                            twitterFollowersProvider.claimValues.username === ''
                              ? undefined
                              : () =>
                                  twitterFollowersProvider.handleFetchOAuth(
                                    walletInformation.address,
                                    currentVerify
                                  ),
                          isDisabled:
                            !twitterFollowersProvider.claimValues.username ||
                            twitterFollowersProvider.claimValues.username === ''
                        }
                }}
                isLoading={
                  twitterFollowersProvider.status === 'credential_pending'
                }
                loadingMessage={twitterFollowersProvider.statusMessage}
                isError={
                  twitterFollowersProvider.status === 'credential_rejected'
                }
                errorMessage={twitterFollowersProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  twitterFollowersProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    twitterFollowersProvider.currentMint ||
                    currentCommunity?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              twitterFollowersProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            twitterFollowersProvider.handleMintCredential(
                              twitterFollowersProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={twitterFollowersProvider.status === 'mint_pending'}
                loadingMessage={twitterFollowersProvider.statusMessage}
                isError={twitterFollowersProvider.status === 'mint_rejected'}
                errorMessage={twitterFollowersProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'TwitterFollowersGT10K' && (
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
                  twitterFollowersProvider.currentCredential ||
                  currentCommunity?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim that your twitter follower count is more than 10K'
                }
                form={{
                  fields:
                    twitterFollowersProvider.currentCredential ||
                    currentCommunity?.credential
                      ? undefined
                      : [
                          {
                            name: 'username',
                            placeholder: 'Enter you twitter handle',
                            value:
                              twitterFollowersProvider.claimValues.username,
                            onChange: twitterFollowersProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: twitterFollowersProvider.claimValues
                              .private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: twitterFollowersProvider.claimValues.private,
                            onChange: twitterFollowersProvider.handleClaimValues
                          }
                        ],
                  button:
                    twitterFollowersProvider.currentCredential ||
                    currentCommunity.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              twitterFollowersProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !twitterFollowersProvider.claimValues.username ||
                            twitterFollowersProvider.claimValues.username === ''
                              ? undefined
                              : () =>
                                  twitterFollowersProvider.handleFetchOAuth(
                                    walletInformation.address,
                                    currentVerify
                                  ),
                          isDisabled:
                            !twitterFollowersProvider.claimValues.username ||
                            twitterFollowersProvider.claimValues.username === ''
                        }
                }}
                isLoading={
                  twitterFollowersProvider.status === 'credential_pending'
                }
                loadingMessage={twitterFollowersProvider.statusMessage}
                isError={
                  twitterFollowersProvider.status === 'credential_rejected'
                }
                errorMessage={twitterFollowersProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  twitterFollowersProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    twitterFollowersProvider.currentMint ||
                    currentCommunity?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              twitterFollowersProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            twitterFollowersProvider.handleMintCredential(
                              twitterFollowersProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={twitterFollowersProvider.status === 'mint_pending'}
                loadingMessage={twitterFollowersProvider.statusMessage}
                isError={twitterFollowersProvider.status === 'mint_rejected'}
                errorMessage={twitterFollowersProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'Issuer' && (
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
                  issuerProvider.currentCredential ||
                  currentCommunity?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Become an Issuer'
                }
                form={{
                  fields:
                    issuerProvider.currentCredential ||
                    currentCommunity?.credential
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
                    currentCommunity?.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              issuerProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick: issuerProvider.handleGetCredential
                        }
                }}
                iconType="credential"
                isLoading={issuerProvider.status === 'credential_pending'}
              />
              <BoxStep
                title="Step 2"
                description={
                  issuerProvider.currentMint || currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    issuerProvider.currentMint || currentCommunity?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              issuerProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            issuerProvider.handleMintCredential(
                              issuerProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={issuerProvider.status === 'mint_pending'}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'GithubOrgMember' && (
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
                  githubOrgMemberProvider.currentCredential ||
                  currentCommunity?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim that you are a github organization member'
                }
                form={{
                  fields:
                    githubOrgMemberProvider.currentCredential ||
                    currentCommunity?.credential
                      ? undefined
                      : [
                          {
                            name: 'username',
                            placeholder: 'Enter you github username',
                            value: githubOrgMemberProvider.claimValues.username,
                            onChange: githubOrgMemberProvider.handleClaimValues
                          },
                          {
                            name: 'organization',
                            placeholder: 'Enter the github organization',
                            value:
                              githubOrgMemberProvider.claimValues.organization,
                            onChange: githubOrgMemberProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: githubOrgMemberProvider.claimValues
                              .private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: githubOrgMemberProvider.claimValues.private,
                            onChange: githubOrgMemberProvider.handleClaimValues
                          }
                        ],
                  button:
                    githubOrgMemberProvider.currentCredential ||
                    currentCommunity.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              githubOrgMemberProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !githubOrgMemberProvider.claimValues.username ||
                            githubOrgMemberProvider.claimValues.username === ''
                              ? undefined
                              : () =>
                                  githubOrgMemberProvider.handleFetchOAuth(
                                    currentVerify
                                  ),
                          isDisabled:
                            !githubOrgMemberProvider.claimValues.username ||
                            githubOrgMemberProvider.claimValues.username === ''
                        }
                }}
                isLoading={
                  githubOrgMemberProvider.status === 'credential_pending'
                }
                loadingMessage={githubOrgMemberProvider.statusMessage}
                isError={
                  githubOrgMemberProvider.status === 'credential_rejected'
                }
                errorMessage={githubOrgMemberProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  githubOrgMemberProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    githubOrgMemberProvider.currentMint ||
                    currentCommunity?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              githubOrgMemberProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            githubOrgMemberProvider.handleMintCredential(
                              githubOrgMemberProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={githubOrgMemberProvider.status === 'mint_pending'}
                loadingMessage={githubOrgMemberProvider.statusMessage}
                isError={githubOrgMemberProvider.status === 'mint_rejected'}
                errorMessage={githubOrgMemberProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'DiscordGuildOwner' && (
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
                  discordGuildOwnerProvider.currentCredential ||
                  currentCommunity.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your discord guild ownership'
                }
                form={{
                  fields:
                    discordGuildOwnerProvider.currentCredential ||
                    currentCommunity.credential
                      ? undefined
                      : [
                          {
                            name: 'guildId',
                            placeholder: 'Enter your discord guild Id',
                            value:
                              discordGuildOwnerProvider.claimValues.guildId,
                            onChange:
                              discordGuildOwnerProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: discordGuildOwnerProvider.claimValues
                              .private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value:
                              discordGuildOwnerProvider.claimValues.private,
                            onChange:
                              discordGuildOwnerProvider.handleClaimValues
                          }
                        ],
                  button:
                    discordGuildOwnerProvider.currentCredential ||
                    currentCommunity.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              discordGuildOwnerProvider.currentCredential ||
                                currentCommunity.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !discordGuildOwnerProvider.claimValues.guildId ||
                            discordGuildOwnerProvider.claimValues.guildId === ''
                              ? undefined
                              : () =>
                                  discordGuildOwnerProvider.handleFetchOAuth(
                                    currentVerify
                                  ),
                          isDisabled:
                            !discordGuildOwnerProvider.claimValues.guildId ||
                            discordGuildOwnerProvider.claimValues.guildId === ''
                        }
                }}
                isLoading={
                  discordGuildOwnerProvider.status === 'credential_pending'
                }
                loadingMessage={discordGuildOwnerProvider.statusMessage}
                isError={
                  discordGuildOwnerProvider.status === 'credential_rejected'
                }
                errorMessage={discordGuildOwnerProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  discordGuildOwnerProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    discordGuildOwnerProvider.currentMint ||
                    currentCommunity?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              discordGuildOwnerProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            discordGuildOwnerProvider.handleMintCredential(
                              discordGuildOwnerProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={discordGuildOwnerProvider.status === 'mint_pending'}
                loadingMessage={discordGuildOwnerProvider.statusMessage}
                isError={discordGuildOwnerProvider.status === 'mint_rejected'}
                errorMessage={discordGuildOwnerProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'DiscordGuildMember' && (
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
                  discordGuildMemberProvider.currentCredential ||
                  currentCommunity.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your discord guild membership'
                }
                form={{
                  fields:
                    discordGuildMemberProvider.currentCredential ||
                    currentCommunity.credential
                      ? undefined
                      : [
                          {
                            name: 'guildId',
                            placeholder: 'Enter the discord guild Id',
                            value:
                              discordGuildMemberProvider.claimValues.guildId,
                            onChange:
                              discordGuildMemberProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: discordGuildMemberProvider.claimValues
                              .private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value:
                              discordGuildMemberProvider.claimValues.private,
                            onChange:
                              discordGuildMemberProvider.handleClaimValues
                          }
                        ],
                  button:
                    discordGuildMemberProvider.currentCredential ||
                    currentCommunity.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              discordGuildMemberProvider.currentCredential ||
                                currentCommunity.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !discordGuildMemberProvider.claimValues.guildId ||
                            discordGuildMemberProvider.claimValues.guildId ===
                              ''
                              ? undefined
                              : () =>
                                  discordGuildMemberProvider.handleFetchOAuth(
                                    currentVerify
                                  ),
                          isDisabled:
                            !discordGuildMemberProvider.claimValues.guildId ||
                            discordGuildMemberProvider.claimValues.guildId ===
                              ''
                        }
                }}
                isLoading={
                  discordGuildMemberProvider.status === 'credential_pending'
                }
                loadingMessage={discordGuildMemberProvider.statusMessage}
                isError={
                  discordGuildMemberProvider.status === 'credential_rejected'
                }
                errorMessage={discordGuildMemberProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  discordGuildMemberProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    discordGuildMemberProvider.currentMint ||
                    currentCommunity?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              discordGuildMemberProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            discordGuildMemberProvider.handleMintCredential(
                              discordGuildMemberProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={discordGuildMemberProvider.status === 'mint_pending'}
                loadingMessage={discordGuildMemberProvider.statusMessage}
                isError={discordGuildMemberProvider.status === 'mint_rejected'}
                errorMessage={discordGuildMemberProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'GuildXyzMember' && (
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
                  guildXyzMemberProvider.currentCredential ||
                  currentCommunity.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your discord guild membership'
                }
                form={{
                  fields:
                    guildXyzMemberProvider.currentCredential ||
                    currentCommunity.credential
                      ? undefined
                      : [
                          {
                            name: 'guildId',
                            type: 'select',
                            placeholder: 'Select the guild',
                            value: guildXyzMemberProvider.claimValues.guildId,
                            items: guildXyzMemberProvider.guildNames,
                            onChange: guildXyzMemberProvider.handleClaimValues
                          },
                          {
                            name: 'private',
                            type: 'switch',
                            placeholder: guildXyzMemberProvider.claimValues
                              .private
                              ? 'private (Stored encrypted off-chain)'
                              : 'public (WARNING: Is not recommended to publish private data to public networks)',
                            value: guildXyzMemberProvider.claimValues.private,
                            onChange: guildXyzMemberProvider.handleClaimValues
                          }
                        ],
                  button:
                    guildXyzMemberProvider.currentCredential ||
                    currentCommunity.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              guildXyzMemberProvider.currentCredential ||
                                currentCommunity.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !guildXyzMemberProvider.claimValues.guildId ||
                            guildXyzMemberProvider.claimValues.guildId === 0
                              ? undefined
                              : () =>
                                  guildXyzMemberProvider.handleGetCredential(
                                    currentVerify
                                  ),

                          isDisabled:
                            !guildXyzMemberProvider.claimValues.guildId ||
                            guildXyzMemberProvider.claimValues.guildId === 0
                        }
                }}
                isLoading={
                  guildXyzMemberProvider.status === 'credential_pending'
                }
                loadingMessage={guildXyzMemberProvider.statusMessage}
                isError={
                  guildXyzMemberProvider.status === 'credential_rejected'
                }
                errorMessage={guildXyzMemberProvider.errorMessage}
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  guildXyzMemberProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : "Mint the credential stamp and NFT ( NOTE: If you don't have MATIC we cover gas for you :)  )"
                }
                form={{
                  button:
                    guildXyzMemberProvider.currentMint ||
                    currentCommunity?.isMinted
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              guildXyzMemberProvider.currentMint
                            )
                        }
                      : {
                          text: 'Mint Stamp',
                          onClick: () =>
                            guildXyzMemberProvider.handleMintCredential(
                              guildXyzMemberProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={guildXyzMemberProvider.status === 'mint_pending'}
                loadingMessage={guildXyzMemberProvider.statusMessage}
                isError={guildXyzMemberProvider.status === 'mint_rejected'}
                errorMessage={guildXyzMemberProvider.errorMessage}
                iconType="stamp"
              />
            </>
          )}
        </>
      )}
    />
  );
};
