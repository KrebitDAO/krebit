import {
  Approval,
  Badge,
  Discord,
  Email,
  Phone,
  Twitter,
  Github,
  Spect,
  Cake,
  Person,
  Guild,
  Dework,
  Stack
} from 'components/Icons';
import { ReactNode } from 'react';

interface IIsuerParams {
  credentialType: string;
  entity: string;
  description: string;
  icon: ReactNode;
  imageUrl: string;
  verificationUrl: string;
  did: string;
  address: string;
  price: string;
}

const PERSONHOOD_CREDENTIALS = [
  {
    credentialType: 'Discord',
    entity: 'Discord',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'Twitter',
    entity: 'Twitter',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'TwitterVerified',
    entity: 'Twitter Verified (blue checkmark)',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'Beta',
    badgeColor: 'blueRibbon'
  },
  {
    credentialType: 'Github',
    entity: 'Github',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'PhoneNumber',
    entity: 'Phone',
    description: 'Krebit Verification Node',
    icon: <Phone />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/phone'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'Email',
    entity: 'Email',
    description: 'Krebit Verification Node',
    icon: <Email />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/email'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'VeriffAgeGT18',
    entity: 'Age > 18 (KYC)',
    description: 'Krebit Verification Node',
    icon: <Cake />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/veriff'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    isDisabled: !process.env.NEXT_PUBLIC_VERIFF_ENABLED,
    badgeText: 'Beta',
    badgeColor: 'blueRibbon'
  },
  {
    credentialType: 'VeriffGovernmentId',
    entity: 'Verified Government Id (KYC)',
    description: 'Krebit Verification Node',
    icon: <Badge />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/veriff'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    isDisabled: !process.env.NEXT_PUBLIC_VERIFF_ENABLED,
    badgeText: 'Beta',
    badgeColor: 'blueRibbon'
  },
  {
    credentialType: 'VeriffLegalName',
    entity: 'Legal Name (KYC)',
    description: 'Krebit Verification Node',
    icon: <Person />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/veriff'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    isDisabled: !process.env.NEXT_PUBLIC_VERIFF_ENABLED,
    badgeText: 'Beta',
    badgeColor: 'blueRibbon'
  }
];

const WORK_CREDENTIALS = [
  {
    credentialType: 'StackOverflowReputationGT1K',
    entity: 'Stack Overflow Reputation > 1K',
    description: 'Krebit Verification Node',
    icon: <Stack />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/stack'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'New'
  },
  {
    credentialType: 'StackOverflowScoreGT10',
    entity: 'Stack Overflow Tag Score > 10',
    description: 'Krebit Verification Node',
    icon: <Stack />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/stack'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'New',
    isDisabled: true
  },
  {
    credentialType: 'DeworkCompletedTasksGT10',
    entity: 'Dework Completed Tasks > 10',
    description: 'Krebit Verification Node',
    icon: <Dework />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/dework'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'New'
  },

  {
    credentialType: 'SpectCompletedTasksGT10',
    entity: 'Spect Completed Tasks > 10',
    description: 'Krebit Verification Node',
    icon: <Spect />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/spect'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'GithubFollowersGT10',
    entity: 'Github Followers > 10',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'GithubRepoStarsGT10',
    entity: 'Github Repository Stars > 10',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'GithubRepoCollaborator',
    entity: 'Github Repo Collaborator',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  }
];

const COMMUNITY_CREDENTIALS = [
  {
    credentialType: 'GuildXyzMember',
    entity: 'Guild Member',
    description: 'Krebit Verification Node',
    icon: <Guild />,
    imageUrl:
      'https://guild-xyz.mypinata.cloud/ipfs/QmSJtjpHzaEdMuBE2uAPSN3r32eZkLXndMzQLBSbknFD1W',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'New'
  },
  {
    credentialType: 'GuildXyzAdmin',
    entity: 'Admin of Guild',
    description: 'Krebit Verification Node',
    icon: <Guild />,
    imageUrl:
      'https://guild-xyz.mypinata.cloud/ipfs/QmSJtjpHzaEdMuBE2uAPSN3r32eZkLXndMzQLBSbknFD1W',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'New'
  },
  {
    credentialType: 'GuildXyzRole',
    entity: 'Has Role in a Guild',
    description: 'Krebit Verification Node',
    icon: <Guild />,
    imageUrl:
      'https://guild-xyz.mypinata.cloud/ipfs/QmSJtjpHzaEdMuBE2uAPSN3r32eZkLXndMzQLBSbknFD1W',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'New'
  },
  {
    credentialType: 'TwitterFollowersGT1K',
    entity: 'Twitter Followers > 1K',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/twitter-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'TwitterFollowersGT10K',
    entity: 'Twitter Followers > 10K',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/twitter-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'DiscordGuildOwner',
    entity: 'Discord Guild Owner',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'DiscordGuildMember',
    entity: 'Discord Guild Member',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'GithubOrgMember',
    entity: 'Github Organization Member',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'Issuer',
    entity: 'Issuer',
    description: 'Krebit Verification Node',
    icon: <Approval />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmThGkNo3FcNrF3za1x5eqGpN99Dr9HXY6NkpQvMPArs8j/krebit-logo.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/issuer'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  }
];

const getIssuers = (type: string): any[] => {
  //TODO: call Krebit.call.getIssuers(type);
  switch (type) {
    case 'Personhood':
      return PERSONHOOD_CREDENTIALS;
    case 'WorkExperience':
      return WORK_CREDENTIALS;
    case 'Community':
      return COMMUNITY_CREDENTIALS;
    default:
      return [];
  }
};

export { getIssuers };
export type { IIsuerParams };
