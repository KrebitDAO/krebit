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
    id: 'linkedin',
    text: 'LinkedIn',
    icon: <Linkedin />
  },
  {
    id: 'contact',
    text: 'Contact',
    icon: <Email />
  },
  {
    id: 'phone',
    text: 'Phone',
    icon: <Phone />
  }
];

const VERIFY_CREDENTIAL_STEPS = {
  discord: [
    {
      id: 'dicord-step-1',
      title: 'Step 1',
      description: 'Step 1 for Discord verification',
      form: {
        buttonText: 'Load'
      }
    },
    {
      id: 'dicord-step-2',
      title: 'Step 2',
      description: 'Step 2 for Discord verification',
      form: {
        buttonText: 'Stamp'
      }
    }
  ],
  twitter: [
    {
      id: 'twitter-step-1',
      title: 'Step 1',
      description: 'Step 1 for twitter verification',
      form: {
        buttonText: 'Load'
      }
    },
    {
      id: 'twitter-step-2',
      title: 'Step 2',
      description: 'Step 2 for twitter verification',
      form: {
        buttonText: 'Stamp'
      }
    }
  ],
  linkedin: [
    {
      id: 'linkedin-step-1',
      title: 'Step 1',
      description: 'Step 1 for linkedin verification',
      form: {
        buttonText: 'Load'
      }
    },
    {
      id: 'linkedin-step-2',
      title: 'Step 2',
      description: 'Step 2 for linkedin verification',
      form: {
        buttonText: 'Stamp'
      }
    }
  ],
  contact: [
    {
      id: 'contact-step-1',
      title: 'Step 1',
      description: 'Step 1 Enter your first name',
      form: {
        input: {
          name: 'first_name',
          placeholder: 'First Name'
        }
      }
    },
    {
      id: 'contact-step-2',
      title: 'Step 2',
      description: 'Step 2 Enter your last name',
      form: {
        input: {
          name: 'last_name',
          placeholder: 'Last Name'
        }
      }
    },
    {
      id: 'contact-step-3',
      title: 'Step 3',
      description: 'Step 3 Get verify',
      form: {
        buttonText: 'Verify'
      }
    }
  ],
  phone: [
    {
      id: 'phone-step-1',
      title: 'Step 1',
      description: 'Step 1 for phone verification',
      form: {
        buttonText: 'Load'
      }
    },
    {
      id: 'phone-step-2',
      title: 'Step 2',
      description: 'Step 2 for phone verification',
      form: {
        buttonText: 'Stamp'
      }
    }
  ]
};

const constants = {
  PERSONHOOD_CREDENTIALS,
  VERIFY_CREDENTIAL_STEPS
};

export { constants };
