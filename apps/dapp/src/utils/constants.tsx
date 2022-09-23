import { Discord } from 'components/Icons';

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

export const constants = {
  DEFAULT_EMPTY_CARD_PERSONHOOD,
  DEFAULT_EMPTY_CARD_WORK,
  DEFAULT_EMPTY_CARD_COMMUNITY
};
