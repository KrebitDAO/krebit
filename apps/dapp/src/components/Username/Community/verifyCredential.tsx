import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { getIssuers, checkCredentialsURLs } from 'utils';
import { GeneralContext } from 'context';
import {
  useIssuerProvider,
  useGithubOrgMemberProvider,
  useDiscordGuildOwnerProvider,
  useDiscordGuildMemberProvider,
  useTwitterFollowersProvider
} from 'hooks';

// types
import { ICredential } from 'utils/normalizeSchema';

interface IProps {
  currentCommunity: ICredential;
  onClose: () => void;
}

export const VerifyCredential = (props: IProps) => {
  const { currentCommunity, onClose } = props;
  const { walletInformation } = useContext(GeneralContext);
  const issuerProvider = useIssuerProvider();
  const githubOrgMemberProvider = useGithubOrgMemberProvider();
  const discordGuildOwnerProvider = useDiscordGuildOwnerProvider();
  const discordGuildMemberProvider = useDiscordGuildMemberProvider();
  const twitterFollowersProvider = useTwitterFollowersProvider();

  const handleClose = () => {
    if (!window) return;

    // TODO: WE SHOULD USE onClose INSTEAD
    window.location.reload();
  };

  return (
    <Verify
      initialList={getIssuers('Community')}
      onClose={handleClose}
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
                iconType="credential"
              />

              <BoxStep
                title="Step 2"
                description={
                  twitterFollowersProvider.currentStamp ||
                  currentCommunity.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    twitterFollowersProvider.currentStamp ||
                    currentCommunity.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              twitterFollowersProvider.currentStamp ||
                                currentCommunity.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            twitterFollowersProvider.handleStampCredential(
                              twitterFollowersProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={twitterFollowersProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
              <BoxStep
                title="Step 3"
                description={
                  twitterFollowersProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
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
                          text: 'Mint NFT',
                          onClick: () =>
                            twitterFollowersProvider.handleMintCredential(
                              twitterFollowersProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={twitterFollowersProvider.status === 'mint_pending'}
                iconType="nft"
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
                iconType="credential"
              />

              <BoxStep
                title="Step 2"
                description={
                  twitterFollowersProvider.currentStamp ||
                  currentCommunity.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    twitterFollowersProvider.currentStamp ||
                    currentCommunity.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              twitterFollowersProvider.currentStamp ||
                                currentCommunity.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            twitterFollowersProvider.handleStampCredential(
                              twitterFollowersProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={twitterFollowersProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
              <BoxStep
                title="Step 3"
                description={
                  twitterFollowersProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
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
                          text: 'Mint NFT',
                          onClick: () =>
                            twitterFollowersProvider.handleMintCredential(
                              twitterFollowersProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={twitterFollowersProvider.status === 'mint_pending'}
                iconType="nft"
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
                  issuerProvider.currentStamp ||
                  currentCommunity?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Stamp verification on-chain'
                }
                form={{
                  button:
                    issuerProvider.currentStamp ||
                    currentCommunity?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              issuerProvider.currentStamp ||
                                currentCommunity?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            issuerProvider.handleStampCredential(
                              issuerProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                iconType="stamp"
                isLoading={issuerProvider.status === 'stamp_pending'}
              />
              <BoxStep
                title="Step 3"
                description={
                  issuerProvider.currentMint || currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
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
                          text: 'Mint NFT',
                          onClick: () =>
                            issuerProvider.handleMintCredential(
                              issuerProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={issuerProvider.status === 'mint_pending'}
                iconType="nft"
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
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  githubOrgMemberProvider.currentStamp ||
                  currentCommunity?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    githubOrgMemberProvider.currentStamp ||
                    currentCommunity?.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              githubOrgMemberProvider.currentStamp ||
                                currentCommunity?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            githubOrgMemberProvider.handleStampCredential(
                              githubOrgMemberProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={githubOrgMemberProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
              <BoxStep
                title="Step 3"
                description={
                  githubOrgMemberProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
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
                          text: 'Mint NFT',
                          onClick: () =>
                            githubOrgMemberProvider.handleMintCredential(
                              githubOrgMemberProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={githubOrgMemberProvider.status === 'mint_pending'}
                iconType="nft"
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
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  discordGuildOwnerProvider.currentStamp ||
                  currentCommunity.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    discordGuildOwnerProvider.currentStamp ||
                    currentCommunity.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              discordGuildOwnerProvider.currentStamp ||
                                currentCommunity.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            discordGuildOwnerProvider.handleStampCredential(
                              discordGuildOwnerProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={discordGuildOwnerProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
              <BoxStep
                title="Step 3"
                description={
                  discordGuildOwnerProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
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
                          text: 'Mint NFT',
                          onClick: () =>
                            discordGuildOwnerProvider.handleMintCredential(
                              discordGuildOwnerProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={discordGuildOwnerProvider.status === 'mint_pending'}
                iconType="nft"
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
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  discordGuildMemberProvider.currentStamp ||
                  currentCommunity.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    discordGuildMemberProvider.currentStamp ||
                    currentCommunity.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'tx',
                              discordGuildMemberProvider.currentStamp ||
                                currentCommunity.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            discordGuildMemberProvider.handleStampCredential(
                              discordGuildMemberProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={
                  discordGuildMemberProvider.status === 'stamp_pending'
                }
                iconType="stamp"
              />
              <BoxStep
                title="Step 3"
                description={
                  discordGuildMemberProvider.currentMint ||
                  currentCommunity?.isMinted
                    ? 'Step completed, you can now check your stamp'
                    : 'Mint the credential as NFT'
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
                          text: 'Mint NFT',
                          onClick: () =>
                            discordGuildMemberProvider.handleMintCredential(
                              discordGuildMemberProvider.currentCredential ||
                                currentCommunity?.credential
                            )
                        }
                }}
                isLoading={discordGuildMemberProvider.status === 'mint_pending'}
                iconType="nft"
              />
            </>
          )}
        </>
      )}
    />
  );
};
