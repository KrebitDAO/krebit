import {
  Badge,
  Discord,
  Email,
  Linkedin,
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
    id: 'phone',
    text: 'Phone',
    icon: <Phone />,
    isDisabled: true
  },
  {
    id: 'contact',
    text: 'Email',
    icon: <Email />,
    isDisabled: true
  },
  {
    id: 'veriff',
    text: 'Legal Name',
    icon: <Badge />,
    isDisabled: true
  }
];

const constants = {
  PERSONHOOD_CREDENTIALS
};

export { constants };
