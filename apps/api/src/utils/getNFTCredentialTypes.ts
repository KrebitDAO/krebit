import { ethers } from 'ethers';

const CREDENTIAL_TYPES = [
  'Issuer',
  'LegalName',
  'GovernmentId',
  'Location',
  'AgeGT18',
  'AgeGT21',
  'Email',
  'PhoneNumber',
  'Twitter',
  'TwitterFollowersGT1K',
  'TwitterFollowersGT10K',
  'TwitterFollowersGT100K',
  'TwitterFollowersGT1M',
  'Discord',
  'DiscordGuildOwner',
  'DiscordGuildMember',
  'Github',
  'GithubFollowersGT10',
  'GithubFollowersGT100',
  'GithubOrgMember',
  'GithubRepoOwner',
  'GithubRepoForksGT10',
  'GithubRepoStarsGT10',
  'GithubRepoWatchersGT10',
  'GithubRepoCollaborator',
  'GithubRepoMergedPullsGT1',
  'GithubRepoCollaborator',
  'StackOverflowReputationGT1K',
  'StackOverflowReputationGT10K',
  'StackOverflowBronzeBadgesGT10',
  'StackOverflowSilverBadgesGT10',
  'StackOverflowGoldBadgesGT10',
  'SnapshotProposalsPassedGT10',
  'SnapshotVotesGT10',
  'SnapshotVotesGT100',
  'SpectCompletedTasksGT10',
  'DribbbleFollowersGT100',
  'DribbbleFollowersGT1K',
  'DribbbleTeamMember'
];

export const getNFTCredentialTypes = () => {
  let result = {};
  for (const type of CREDENTIAL_TYPES) {
    const tokenIdHex = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(['string'], [type])
    );
    const tokenId = ethers.BigNumber.from(tokenIdHex);
    result[tokenIdHex.toString().substring(2)] = type;
    result[tokenId.toString()] = type;
  }
  return result;
};
