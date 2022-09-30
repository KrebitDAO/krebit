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

const PERSONHOOD_CREDENTIALS = [
  {
    credentialType: 'Discord',
    entity: 'Discord',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    verificationUrl: 'http://localhost:4000/discord',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'Twitter',
    entity: 'Twitter',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    verificationUrl: 'http://localhost:4000/twitter',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'TwitterFollowersGT1K',
    entity: 'Twitter Followers > 1K',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    verificationUrl: 'http://localhost:4000/twitter',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'Phone',
    entity: 'Phone (Twilio)',
    description: 'Krebit Verification Node',
    icon: <Phone />,
    verificationUrl: 'http://localhost:4000/phone',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'Email',
    entity: 'Email (Twilio)',
    description: 'Krebit Verification Node',
    icon: <Email />,
    verificationUrl: 'http://localhost:4000/email',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'veriff',
    entity: 'Legal Name (Veriff)',
    description: 'Krebit Verification Node',
    icon: <Badge />,
    verificationUrl: 'http://localhost:4000/veriff',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '1.5',
    isDisabled: true
  },
  {
    credentialType: 'persona',
    entity: 'Legal Name (Persona)',
    description: 'Krebit Verification Node',
    icon: <Badge />,
    verificationUrl: 'http://localhost:4000/persona',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '2.5'
  }
];

const WORK_CREDENTIALS = [
  {
    credentialType: 'Github',
    entity: 'Github',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: 'http://localhost:4000/github',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'GithubFollowersGT10',
    entity: 'Github Followers > 10',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: 'http://localhost:4000/github',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'GithubRepoStarsGT10',
    entity: 'Github Repository Stars > 10',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: 'http://localhost:4000/github',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'GithubRepoMergedPullsGT10',
    entity: 'Github Repo Merged Pull-Requests > 10',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: 'http://localhost:4000/github',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'spect',
    entity: 'Spect',
    description: 'Krebit Verification Node',
    icon: <Spect />,
    verificationUrl: 'http://localhost:4000/spect',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0',
    isDisabled: true
  }
];

const COMMUNITY_CREDENTIALS = [
  {
    credentialType: 'DiscordGuildOwner',
    entity: 'Discord Guild Owner',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl: 'http://localhost:4000/discord',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'DiscordGuildMember',
    entity: 'Discord Guild Member',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl: 'http://localhost:4000/discord',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'GithubOrgMember',
    entity: 'Github Organization Member',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: 'http://localhost:4000/github',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'Issuer',
    entity: 'Issuer',
    description: 'Krebit Verification Node',
    icon: <Approval />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmThGkNo3FcNrF3za1x5eqGpN99Dr9HXY6NkpQvMPArs8j/krebit-logo.png',
    verificationUrl: 'http://localhost:4000/issuer',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
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
