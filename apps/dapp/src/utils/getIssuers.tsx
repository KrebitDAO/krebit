import {
  Approval,
  Badge,
  Discord,
  Email,
  Phone,
  Twitter,
  Github,
  Spect
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
    verificationUrl: process.env.NEXT_PUBLIC_DISCORD_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'Twitter',
    entity: 'Twitter',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    verificationUrl: process.env.NEXT_PUBLIC_TWITTER_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'Github',
    entity: 'Github',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_GITHUB_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },

  {
    credentialType: 'Phone',
    entity: 'Phone',
    description: 'Krebit Verification Node',
    icon: <Phone />,
    verificationUrl: process.env.NEXT_PUBLIC_PHONE_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'Email',
    entity: 'Email',
    description: 'Krebit Verification Node',
    icon: <Email />,
    verificationUrl: process.env.NEXT_PUBLIC_EMAIL_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'Veriff',
    entity: 'Legal Name (Veriff)',
    description: 'Krebit Verification Node',
    icon: <Badge />,
    verificationUrl: process.env.NEXT_PUBLIC_VERIFF_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '1.5',
    isDisabled: true
  },
  {
    credentialType: 'Persona',
    entity: 'Legal Name (Persona)',
    description: 'Krebit Verification Node',
    icon: <Badge />,
    verificationUrl: process.env.NEXT_PUBLIC_PERSONA_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '2.5'
  }
];

const WORK_CREDENTIALS = [
  {
    credentialType: 'GithubFollowersGT10',
    entity: 'Github Followers > 10',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_GITHUB_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'GithubRepoStarsGT10',
    entity: 'Github Repository Stars > 10',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_GITHUB_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'GithubRepoCollaborator',
    entity: 'Github Repo Collaborator',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_GITHUB_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'spect',
    entity: 'Spect',
    description: 'Krebit Verification Node',
    icon: <Spect />,
    verificationUrl: process.env.NEXT_PUBLIC_SPECT_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0',
    isDisabled: true
  }
];

const COMMUNITY_CREDENTIALS = [
  {
    credentialType: 'TwitterFollowersGT1K',
    entity: 'Twitter Followers > 1K',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    verificationUrl: process.env.NEXT_PUBLIC_TWITTER_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'DiscordGuildOwner',
    entity: 'Discord Guild Owner',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_DISCORD_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'DiscordGuildMember',
    entity: 'Discord Guild Member',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_DISCORD_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'GithubOrgMember',
    entity: 'Github Organization Member',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_GITHUB_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',

    price: '0'
  },
  {
    credentialType: 'Issuer',
    entity: 'Issuer',
    description: 'Krebit Verification Node',
    icon: <Approval />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmThGkNo3FcNrF3za1x5eqGpN99Dr9HXY6NkpQvMPArs8j/krebit-logo.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL,
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    address: '0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0',
    isDisabled: true
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
