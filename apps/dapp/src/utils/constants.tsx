import { Discord, Email, Linkedin, Phone, Twitter } from 'components/Icons';

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
    id: 'veriff',
    text: 'Veriff',
    icon: <Linkedin />,
    isDisabled: true
  },
  {
    id: 'contact',
    text: 'Contact',
    icon: <Email />,
    isDisabled: true
  },
  {
    id: 'phone',
    text: 'Phone',
    icon: <Phone />,
    isDisabled: true
  }
];

const constants = {
  PERSONHOOD_CREDENTIALS
};

export { constants };
