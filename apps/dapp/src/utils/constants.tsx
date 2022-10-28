import {
  Discord,
  Facebook,
  Linkedin,
  Telegram,
  Twitter,
  Whatsapp
} from 'components/Icons';

const DEFAULT_HOME_BOXES = [
  {
    box: 'KRB 180',
    username: 'fuano.eth',
    image: '/imgs/images/rare-buddies-1.png',
    skills: ['Illustrator', 'NFT Creator', 'UI']
  },
  {
    box: 'KRB 171',
    username: 'alerios.eth',
    image: '/imgs/images/alerios.jpg',
    skills: ['Developer', 'Product']
  },
  {
    box: 'KRB 152',
    username: 'texasfr.eth',
    image: '/imgs/images/texasfr.png',
    skills: ['Talent', 'Software', 'QA']
  },
  {
    box: 'KRB 150',
    username: 'andresmontoya.eth',
    image: '/imgs/images/andresmontoya.jpeg',
    skills: ['Javascript', 'UX', 'Frontend']
  },
  {
    box: 'KRB 143',
    username: 'piraseligman.eth',
    image: '/imgs/images/piraseligman.png',
    skills: ['Growth', 'Innovation', 'Design']
  }
];

const DEFAULT_TWEET_PEOPLE = [
  {
    image:
      'https://pbs.twimg.com/profile_images/1448444558862397440/gKB7I-0U_400x400.jpg',
    name: 'andresmontoya.eth',
    username: '@AndresMontoyaIN',
    description: 'Krebit rocks 🤘',
    url: 'https://twitter.com/AndresMontoyaIN'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1448444558862397440/gKB7I-0U_400x400.jpg',
    name: 'andresmontoya.eth',
    username: '@AndresMontoyaIN',
    description: 'Krebit rocks 🤘',
    url: 'https://twitter.com/AndresMontoyaIN'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1448444558862397440/gKB7I-0U_400x400.jpg',
    name: 'andresmontoya.eth',
    username: '@AndresMontoyaIN',
    description: 'Krebit rocks 🤘',
    url: 'https://twitter.com/AndresMontoyaIN'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1448444558862397440/gKB7I-0U_400x400.jpg',
    name: 'andresmontoya.eth',
    username: '@AndresMontoyaIN',
    description: 'Krebit rocks 🤘',
    url: 'https://twitter.com/AndresMontoyaIN'
  }
];

const DEFAULT_EMPTY_CARD_PERSONHOOD = {
  title: 'Platform',
  description: 'Username',
  dates: {
    issuanceDate: {
      text: 'ISSUED',
      value: new Date().toISOString()
    },
    expirationDate: {
      text: 'EXPIRES',
      value: new Date().toISOString()
    }
  },
  icon: <Discord />,
  isIssued: false
};

const DEFAULT_EMPTY_CARD_WORK = {
  title: 'Job Title',
  description: 'Company / Dates',
  dates: {
    issuanceDate: {
      text: 'ISSUED',
      value: new Date().toISOString()
    },
    expirationDate: {
      text: 'EXPIRES',
      value: new Date().toISOString()
    }
  },
  image: '/imgs/logos/Logo.svg',
  isIssued: false
};

const DEFAULT_EMPTY_CARD_COMMUNITY = {
  title: 'Institution Title',
  description: 'Institution Company',
  dates: {
    issuanceDate: {
      text: 'ISSUED',
      value: new Date().toISOString()
    },
    expirationDate: {
      text: 'EXPIRES',
      value: new Date().toISOString()
    }
  },
  image: '',
  isIssued: false
};

const DEFAULT_SHARE_CONTENT_SOCIAL_NETWORKS = [
  {
    id: 'twitter',
    text: 'Twitter',
    icon: <Twitter />
  },
  {
    id: 'facebook',
    text: 'Facebook',
    icon: <Facebook />
  },
  {
    id: 'linkedin',
    text: 'Linkedin',
    icon: <Linkedin />
  },
  {
    id: 'telegram',
    text: 'Telegram',
    icon: <Telegram />
  },
  {
    id: 'whatsapp',
    text: 'Whatsapp',
    icon: <Whatsapp />
  }
];

const DEFAULT_MESSAGES_FOR_PROVIDERS = {
  INITIAL: 'Approve signature on your Wallet...',
  ISSUER_CONNECTION: 'Connecting to issuer...',
  SAVING_CLAIMED_CREDENTIAL: 'Saving claimed credential...',
  ISSUING_CREDENTIAL: 'Issuing credential...',
  ADDING_CREDENTIAL: 'Adding credential...',
  MINTING_NFT: 'Minting NFT...'
};

const DEFAULT_ERROR_MESSAGE_FOR_PROVIDERS = {
  ERROR_CREDENTIAL: 'Error saving credential. Please check later'
};

export const constants = {
  DEFAULT_HOME_BOXES,
  DEFAULT_TWEET_PEOPLE,
  DEFAULT_EMPTY_CARD_PERSONHOOD,
  DEFAULT_EMPTY_CARD_WORK,
  DEFAULT_EMPTY_CARD_COMMUNITY,
  DEFAULT_SHARE_CONTENT_SOCIAL_NETWORKS,
  DEFAULT_MESSAGES_FOR_PROVIDERS,
  DEFAULT_ERROR_MESSAGE_FOR_PROVIDERS
};
