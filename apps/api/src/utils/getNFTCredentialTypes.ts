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
  'DribbbleTeamMember',
  'JavaScriptGithubRepoStarsGT10',
  'PythonGithubRepoStarsGT10',
  'JavaScriptGithubRepoStarsGT10',
  'JavaGithubRepoStarsGT10',
  'C#GithubRepoStarsGT10',
  'PHPGithubRepoStarsGT10',
  'AndroidGithubRepoStarsGT10',
  'HTMLGithubRepoStarsGT10',
  'C++GithubRepoStarsGT10',
  'CSSGithubRepoStarsGT10',
  'Objective-CGithubRepoStarsGT10',
  'SQLGithubRepoStarsGT10',
  'RGithubRepoStarsGT10',
  'CGithubRepoStarsGT10',
  'SwiftGithubRepoStarsGT10',
  'RubyGithubRepoStarsGT10',
  'TypeScriptGithubRepoStarsGT10',
  'ScalaGithubRepoStarsGT10',
  'ShellGithubRepoStarsGT10',
  'KotlinGithubRepoStarsGT10',
  'GoGithubRepoStarsGT10',
  'RustGithubRepoStarsGT10',
  'SolidityGithubRepoStarsGT10',
  'JavaScriptGithubRepoCollaborator',
  'PythonGithubRepoCollaborator',
  'JavaScriptGithubRepoCollaborator',
  'JavaGithubRepoCollaborator',
  'C#GithubRepoCollaborator',
  'PHPGithubRepoCollaborator',
  'AndroidGithubRepoCollaborator',
  'HTMLGithubRepoCollaborator',
  'C++GithubRepoCollaborator',
  'CSSGithubRepoCollaborator',
  'Objective-CGithubRepoCollaborator',
  'SQLGithubRepoCollaborator',
  'RGithubRepoCollaborator',
  'CGithubRepoCollaborator',
  'SwiftGithubRepoCollaborator',
  'RubyGithubRepoCollaborator',
  'TypeScriptGithubRepoCollaborator',
  'ScalaGithubRepoCollaborator',
  'ShellGithubRepoCollaborator',
  'KotlinGithubRepoCollaborator',
  'GoGithubRepoCollaborator',
  'RustGithubRepoCollaborator',
  'SolidityGithubRepoCollaborator',
  'GuildXyzAdmin',
  'GuildXyzMember',
  'GuildXyzRole',
  'VerifiableCredential',
  'DeworkCompletedTasksGT10',
  'PythonStackOverflowScoreGT10',
  'JavaScriptStackOverflowScoreGT10',
  'JavaStackOverflowScoreGT10',
  'C#StackOverflowScoreGT10',
  'PHPStackOverflowScoreGT10',
  'AndroidStackOverflowScoreGT10',
  'HTMLStackOverflowScoreGT10',
  'C++StackOverflowScoreGT10',
  'CSSStackOverflowScoreGT10',
  'Objective-CStackOverflowScoreGT10',
  'SQLStackOverflowScoreGT10',
  'RStackOverflowScoreGT10',
  'CStackOverflowScoreGT10',
  'SwiftStackOverflowScoreGT10',
  'RubyStackOverflowScoreGT10',
  'TypeScriptStackOverflowScoreGT10',
  'ScalaStackOverflowScoreGT10',
  'ShellStackOverflowScoreGT10',
  'KotlinStackOverflowScoreGT10',
  'GoStackOverflowScoreGT10',
  'RustStackOverflowScoreGT10',
  'SolidityStackOverflowScoreGT10',
  'TwitterVerified',
  'Referral',
  'Deal',
  'Badge',
  'Review',
  'WorkExperience',
  'Education',
  'Attendance',
  'CredScoreGTEGood'
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

export const getTokenId = (type: string) => {
  const tokenIdHex = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(['string'], [type])
  );
  const tokenId = ethers.BigNumber.from(tokenIdHex);
  return tokenId;
};

export const getTokenIds = () => {
  let result = {};
  for (const type of CREDENTIAL_TYPES) {
    const tokenIdHex = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(['string'], [type])
    );
    const tokenId = ethers.BigNumber.from(tokenIdHex);
    result[type] = {
      name: type
        .replace('Github', ' Github')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace('#', '# ')
        .replace('++', '++ ')
        .replace('GTE', '>= ')
        .replace('GT', '> '),
      tokenId: tokenId.toString()
    };
  }
  return result;
};
