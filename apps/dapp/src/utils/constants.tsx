import {
  Approval,
  Badge,
  Discord,
  Email,
  Phone,
  Twitter
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
    icon: <Badge />
    //isDisabled: true
  },
  {
    id: 'persona',
    text: 'Legal Name (Persona)',
    icon: <Badge />
    //isDisabled: true
  },
  {
    id: 'issuer',
    text: 'Issuer',
    icon: <Approval />,
    isDisabled: true
  }
];

const constants = {
  PERSONHOOD_CREDENTIALS
};

export { constants };
