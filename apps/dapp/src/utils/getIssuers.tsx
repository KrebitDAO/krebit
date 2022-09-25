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
    credentialType: 'discord',
    entity: 'Discord',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    verificationUrl: 'http://localhost:4000/discord',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'twitter',
    entity: 'Twitter',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    verificationUrl: 'http://localhost:4000/twitter',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'twitterFollowers',
    entity: 'Twitter Followers',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    verificationUrl: 'http://localhost:4000/twitter',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'phone',
    entity: 'Phone (Twilio)',
    description: 'Krebit Verification Node',
    icon: <Phone />,
    verificationUrl: 'http://localhost:4000/phone',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'email',
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
    credentialType: 'github',
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
    credentialType: 'githubFollowers',
    entity: 'Github Followers',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: 'http://localhost:4000/github',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'githubRepoOwner',
    entity: 'Github Repository Owner',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: 'http://localhost:4000/github',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'githubRepoCollaborator',
    entity: 'Github Repository Collaborator',
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
    credentialType: 'discordGuildMembers',
    entity: 'Discord Guild Members',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl: 'http://localhost:4000/discord',
    did: 'did:pkh:eip155:80001:0x661f52D8D111ECcF62872bDDb2E70C12d8b4b860',
    price: '0'
  },
  {
    credentialType: 'githubOrgMember',
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
    credentialType: 'issuer',
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
    case 'personhood':
      return PERSONHOOD_CREDENTIALS;
    case 'workExperience':
      return WORK_CREDENTIALS;
    case 'community':
      return COMMUNITY_CREDENTIALS;
    default:
      return [];
  }
};

export { getIssuers };
