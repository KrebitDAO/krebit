import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { getIssuers, checkCredentialsURLs } from 'utils';
import {
  useIssuerProvider,
  useGithubOrgMemberProvider,
  useDiscordGuildMembersProvider
} from 'hooks';

// types
import { ICredential } from 'utils/normalizeSchema';

interface IProps {
  currentCommunity: ICredential;
  onClose: () => void;
}

export const VerifyCredential = (props: IProps) => {
  const { currentCommunity, onClose } = props;
  const issuerProvider = useIssuerProvider();
  const githubOrgMemberProvider = useGithubOrgMemberProvider();
  const discordGuildMembersProvider = useDiscordGuildMembersProvider();

  const handleClose = () => {
    if (!window) return;

    // TODO: WE SHOULD USE onClose INSTEAD
    window.location.reload();
  };

  return (
    <Verify
      initialList={getIssuers('community')}
      onClose={handleClose}
      verifyId={currentCommunity?.credential?.visualInformation?.credentialType}
      component={({ currentVerify }) => (
        <>
          {currentVerify?.credentialType === 'issuer' && (
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
                  inputs:
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
                              'stamp',
                              issuerProvider.currentStamp ||
                                currentCommunity?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: issuerProvider.handleStampCredential
                        }
                }}
                iconType="stamp"
                isLoading={issuerProvider.status === 'stamp_pending'}
              />
            </>
          )}
          {currentVerify?.credentialType === 'githubOrgMember' && (
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
                  inputs:
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
                                  githubOrgMemberProvider.handleFetchOAuth(),
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
                              'stamp',
                              githubOrgMemberProvider.currentStamp ||
                                currentCommunity?.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick: githubOrgMemberProvider.handleStampCredential
                        }
                }}
                isLoading={githubOrgMemberProvider.status === 'stamp_pending'}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.credentialType === 'discordGuildMembers' && (
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
                  discordGuildMembersProvider.currentCredential ||
                  currentCommunity.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Claim your discord guild member count ( i.e. more than 1,000 would be gt1000 )'
                }
                form={{
                  inputs:
                    discordGuildMembersProvider.currentCredential ||
                    currentCommunity.credential
                      ? undefined
                      : [
                          {
                            name: 'guildId',
                            placeholder:
                              'Enter your discord guild Id (you must be the owner)',
                            value:
                              discordGuildMembersProvider.claimValues.guildId,
                            onChange:
                              discordGuildMembersProvider.handleClaimValues
                          },
                          {
                            name: 'followers',
                            placeholder:
                              'gt100 | gt500 | gt1000 | gt5K | gt10K | gt50K | gt100K | gt1M',
                            value:
                              discordGuildMembersProvider.claimValues.followers,
                            onChange:
                              discordGuildMembersProvider.handleClaimValues
                          }
                        ],
                  button:
                    discordGuildMembersProvider.currentCredential ||
                    currentCommunity.credential
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'ceramic',
                              'credential',
                              discordGuildMembersProvider.currentCredential ||
                                currentCommunity.credential
                            )
                        }
                      : {
                          text: 'Verify',
                          onClick:
                            !discordGuildMembersProvider.claimValues
                              .followers ||
                            discordGuildMembersProvider.claimValues
                              .followers === ''
                              ? undefined
                              : () =>
                                  discordGuildMembersProvider.handleFetchOAuth(),
                          isDisabled:
                            !discordGuildMembersProvider.claimValues
                              .followers ||
                            discordGuildMembersProvider.claimValues
                              .followers === ''
                        }
                }}
                isLoading={
                  discordGuildMembersProvider.status === 'credential_pending'
                }
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  discordGuildMembersProvider.currentStamp ||
                  currentCommunity.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Add an on-chain stamp to your credential'
                }
                form={{
                  button:
                    discordGuildMembersProvider.currentStamp ||
                    currentCommunity.stamps?.length !== 0
                      ? {
                          text: 'Check it',
                          onClick: () =>
                            checkCredentialsURLs(
                              'polygon',
                              'stamp',
                              discordGuildMembersProvider.currentStamp ||
                                currentCommunity.stamps[0]
                            )
                        }
                      : {
                          text: 'Stamp',
                          onClick:
                            discordGuildMembersProvider.handleStampCredential
                        }
                }}
                isLoading={
                  discordGuildMembersProvider.status === 'stamp_pending'
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
