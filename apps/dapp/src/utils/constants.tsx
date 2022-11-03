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
    box: '$KRB 180',
    username: 'fuano.eth',
    image: '/imgs/images/rare-buddies-1.png',
    skills: ['Illustrator', 'NFT Creator', 'UI']
  },
  {
    box: '$KRB 171',
    username: 'alerios.eth',
    image: '/imgs/images/alerios.jpg',
    skills: ['Developer', 'Product']
  },
  {
    box: '$KRB 152',
    username: 'texasfr.eth',
    image: '/imgs/images/texasfr.png',
    skills: ['Talent', 'Software', 'QA']
  },
  {
    box: '$KRB 150',
    username: 'andresmontoya.eth',
    image: '/imgs/images/andresmontoya.jpeg',
    skills: ['Javascript', 'UX', 'Frontend']
  },
  {
    box: '$KRB 143',
    username: 'piraseligman.eth',
    image: '/imgs/images/piraseligman.png',
    skills: ['Growth', 'Innovation', 'Design']
  }
];

const DEFAULT_TWEET_PEOPLE = [
  {
    image:
      'https://pbs.twimg.com/profile_images/1549064242623651845/mp_lIAfL_400x400.png',
    name: 'Orbis, the web3 social protocol',
    username: '@OrbisClub',
    description: [
      '@krebitID is solving the problem of portable reputation.',
      'A web3 profile will have verifiable credentials that are earned once, then can be presented in every other app.',
      '🧵2/6',
      'Data encryption is an important consideration for @krebitID.Their team believes that it is key to the ‘self-service data model’ promised by web3.',
      '@krebitID could verify private data like your email for KYC or job applications, but it would remain encrypted by default.',
      '🧵3/6'
    ],

    url: 'https://twitter.com/OrbisClub/status/1579507937428787200'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1494097574613057541/gATQxSnP_400x400.jpg',
    name: 'unstoppable.x',
    username: '@unstoppableweb',
    description: [
      'Login with Unstoppable is live on @KrebitID - a reputation passport focused on making hiring (and getting hired) easier with blockchain #proofofskills',
      'So futuristic! 🪐'
    ],
    url: 'https://twitter.com/unstoppableweb/status/1583518766482087937',
    imageUrl:
      'https://pbs.twimg.com/media/FfnJTTSVsAEq6mP?format=jpg&name=small'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1544304761658277888/rQ0lofL7_400x400.jpg',
    name: 'EthCC - Ethereum Community Conference',
    username: '@EthCC',
    description: [
      '🎤 #EthCC5 Speakers 🎤',
      'Alerios from @KrebitID talks about "The Credential-Powered DAO and the Future of Work"',
      '💙🤍❤️'
    ],
    url: 'https://twitter.com/EthCC/status/1547687405607534593',
    imageUrl:
      'https://pbs.twimg.com/media/FXp9e74UcAEmft_?format=jpg&name=small'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1562070519448571904/xA8XnIfg_400x400.jpg',
    name: '3six9 Innovatio, Cognito Research',
    username: '@3xcalibur69',
    description: [
      '"Krebit can become an infrastructure layer for dApps using the protocol to conduct decentralized KYC/AML, restrict access to Adult/NSFW pages and prevent anti-Sybil."',
      'Credit Rating, Enforcing trust through code',
      'https://t.co/7n576EsNZa'
    ],
    url: 'https://twitter.com/3xcalibur69/status/1582150275112259584',
    imageUrl:
      'https://pbs.twimg.com/card_img/1584687501054279680/q6udpYvG?format=jpg&name=small'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1520017537869783042/cMhcMhBQ_400x400.jpg',
    name: 'FirstBatch',
    username: '@FirstBatchxyz_',
    description: [
      'Your identity becomes sovereign by your pseudonym.',
      'We have assembled a list of Web3 startups working on pseudonymous identities. ',
      "Let's dive into 🧵"
    ],
    url: 'https://twitter.com/FirstBatchxyz_/status/1533454955440381958',
    imageUrl:
      'https://pbs.twimg.com/media/FUfonzBWYAEcGBy?format=jpg&name=small'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1437676040239796226/PobNlg9b_400x400.jpg',
    name: 'InterFi Audits 🛡',
    username: '@InterFiNetwork',
    description: [
      'InterFi Network has completed a smart contract security audit of: @KrebitID (Krebit)',
      'The full audit report can be read on our GitHub: https://t.co/ov65tA0Mat',
      ' #smartcontract #interfi'
    ],
    url: 'https://twitter.com/InterFiNetwork/status/1513750349135290370',
    imageUrl:
      'https://pbs.twimg.com/card_img/1584976246416490496/HStsBlRK?format=jpg&name=small'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1575914458437894152/p6ltHp0N_400x400.jpg',
    name: 'stargazoor 🌟',
    username: '@stargazoor',
    description: [
      'pcaversaccio and 2 others starred repo MantisClone/awesome-reputation-systems (12 ⭐️)',
      'A curated list of reputation systems',
      '#awesome #awesome-list'
    ],
    url: 'https://twitter.com/stargazoor/status/1580563167822086145',
    imageUrl:
      'https://pbs.twimg.com/card_img/1584923711907536897/wjKMl3_d?format=jpg&name=small'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1537928505555849216/UDFyTFFd_400x400.jpg',
    name: 'Kerman ノ',
    username: '@kermankohli',
    description: [
      'On-Chain Identity & Reputation Market Map 👀',
      'A list of all the projects and categories that make up the next mega-trend of crypto.',
      "Let me know if I've missed anyone below👇"
    ],
    url: 'https://twitter.com/kermankohli/status/1583356132932083712',
    imageUrl:
      'https://pbs.twimg.com/media/Ffk1esTakAA2wwI?format=jpg&name=small'
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1574456733875179521/lQVEEh5a_400x400.png',
    name: 'CryptaniC｜ｸﾘﾌﾟﾀﾆｼ🛸',
    username: '@cryptani_c',
    description: [
      '以前から追ってるDID project @KrebitID 同じくweb3 social mediaとして注目してる @OrbisClub とpartnership結んだり、mainnet launchしたり、やっと活発になってきました giveawayやってるので、この機会に触ってみてね',
      'DID project @KrebitID that I have been following for a long time has partnered with @OrbisClub, which is also attracting attention as web3 social media, and launching in mainnet, finally becoming active.',
      "They're doing a giveaway, so please take this opportunity to try it"
    ],
    url: 'https://twitter.com/cryptani_c/status/1581549950898696192'
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

const DEFAULT_IMAGE_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const constants = {
  DEFAULT_HOME_BOXES,
  DEFAULT_TWEET_PEOPLE,
  DEFAULT_EMPTY_CARD_PERSONHOOD,
  DEFAULT_EMPTY_CARD_WORK,
  DEFAULT_EMPTY_CARD_COMMUNITY,
  DEFAULT_SHARE_CONTENT_SOCIAL_NETWORKS,
  DEFAULT_MESSAGES_FOR_PROVIDERS,
  DEFAULT_ERROR_MESSAGE_FOR_PROVIDERS,
  DEFAULT_IMAGE_FILE_TYPES
};
