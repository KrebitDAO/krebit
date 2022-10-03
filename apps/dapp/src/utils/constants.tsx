import {
  Discord,
  Facebook,
  Linkedin,
  Telegram,
  Twitter,
  Whatsapp
} from 'components/Icons';

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

export const constants = {
  DEFAULT_EMPTY_CARD_PERSONHOOD,
  DEFAULT_EMPTY_CARD_WORK,
  DEFAULT_EMPTY_CARD_COMMUNITY,
  DEFAULT_SHARE_CONTENT_SOCIAL_NETWORKS
};
