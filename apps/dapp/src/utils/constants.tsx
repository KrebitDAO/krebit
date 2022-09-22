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
    id: 'discord',
    text: 'Discord',
    icon: <Discord />
  },
  {
    id: 'twitter',
    text: 'Twitter',
    icon: <Twitter />
  },
  {
    id: 'twitterFollowers',
    text: 'Twitter Followers',
    icon: <Twitter />
  },
  {
    id: 'phone',
    text: 'Phone (Twilio)',
    icon: <Phone />
  },
  {
    id: 'email',
    text: 'Email (Twilio)',
    icon: <Email />
  },
  {
    id: 'veriff',
    text: 'Legal Name (Veriff)',
    icon: <Badge />,
    isDisabled: true
  },
  {
    id: 'persona',
    text: 'Legal Name (Persona)',
    icon: <Badge />
    //isDisabled: true
  }
];

const WORK_CREDENTIALS = [
  {
    id: 'github',
    text: 'Github',
    icon: <Github />,
    image:
      'https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png'
  },
  {
    id: 'githubFollowers',
    text: 'Github Followers',
    icon: <Github />,
    image:
      'https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png'
  },
  {
    id: 'spect',
    text: 'Spect',
    icon: <Spect />,
    isDisabled: true
  }
];

const COMMUNITY_CREDENTIALS = [
  {
    id: 'issuer',
    text: 'Issuer',
    icon: <Approval />,
    image:
      'https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png'
  }
];

const constants = {
  PERSONHOOD_CREDENTIALS,
  WORK_CREDENTIALS,
  COMMUNITY_CREDENTIALS
};

export { constants };
