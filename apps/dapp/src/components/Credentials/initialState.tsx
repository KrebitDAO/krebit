import { ReactNode } from 'react';

import {
  Attendance,
  Token,
  Delegate,
  School,
  Deal,
  WorkExperience,
  Star
} from 'components/Icons';
import { countries } from 'utils';

// types
import { IItems } from 'components/Select';

const { NEXT_PUBLIC_ISSUER_DID } = process.env;
const { NEXT_PUBLIC_ISSUER_ADDRESS } = process.env;
const { NEXT_PUBLIC_ISSUER_NODE_URL } = process.env;

export interface IFormValues {
  [key: string]: string | number | string[] | number[] | boolean | File;
}

export interface ICredentialsState {
  type: string;
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  icon: ReactNode;
  form: {
    fields?: {
      name: string;
      placeholder: string;
      type?: string;
      defaultValue?: string | number | string[] | number[] | boolean;
      pattern?: string;
      isDisabled?: boolean;
      isRequired?: boolean;
      isMultiline?: boolean;
      items?: IItems[];
    }[];
    issueTo?: {
      name: string;
      placeholder: string;
    };
    button?: {
      text: string;
      onClick: (values: IFormValues) => any;
      isDisabled?: boolean;
    };
  };
}

export const CREDENTIALS_INITIAL_STATE: ICredentialsState[] = [
  {
    type: 'referral',
    title: 'Referr a friend',
    description:
      'Invite a friend to the Krebiters community and earn when they sell',
    primaryColor: 'haiti',
    secondaryColor: 'rose',
    icon: <Delegate />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Referral Title',
          defaultValue: 'Referral'
        },
        {
          name: 'description',
          placeholder: 'Write a personalized invitation message here'
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to'
      },
      button: {
        text: 'Invite',
        onClick: values => {
          // TODO: encrypt issueTo and get credentialSubjectListUrl

          return {
            values: {
              ...values,
              entity: 'Personal'
            },
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Referral',
            credentialSchema: 'krebit://schemas/recommendation'
          };
        }
      }
    }
  },
  {
    type: 'review',
    title: 'Review',
    description: 'Rate anyone or anything',
    primaryColor: 'blueCharcoal',
    secondaryColor: 'cyan',
    icon: <Star />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Review Title',
          defaultValue: 'Review'
        },
        {
          type: 'rating',
          name: 'rating',
          placeholder: 'Rating: 2/5'
        },
        {
          name: 'description',
          placeholder: 'Write your review here'
        },

        {
          type: 'text',
          name: 'proof',
          placeholder: 'Proof url'
        },
        {
          type: 'boxes',
          name: 'skills',
          placeholder: 'Skills'
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to'
      },
      button: {
        text: 'Review',
        onClick: values => {
          // TODO: encrypt issueTo and get credentialSubjectListUrl

          return {
            values: {
              ...values,
              rating: values?.rating ? values.rating : '2',
              entity: 'Personal',
              skills: (values.skills as string[]).map(skill => {
                return {
                  skillId: skill,
                  score: values?.rating
                    ? parseInt(values?.rating as string) * 20
                    : 100
                };
              })
            },
            tags: values.skills,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Review',
            credentialSchema: 'krebit://schemas/recommendation'
          };
        }
      }
    }
  },
  {
    type: 'deal',
    title: 'Deal',
    description: 'Offer or quotation for a service or product',
    primaryColor: 'blueCharcoal',
    secondaryColor: 'pomegranate',
    icon: <Deal />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Offer Title'
        },
        {
          type: 'select',
          name: 'deliverableType',
          placeholder: 'Deliverable Type',
          items: [
            { text: 'File', value: 'file' },
            { text: 'Video Call', value: 'meeting' },
            { text: 'Product', value: 'product' }
          ]
        },
        {
          name: 'description',
          placeholder: 'Deliverable description & requirements'
        },
        {
          type: 'upload',
          name: 'image',
          placeholder: 'Image / Logo'
        },
        {
          type: 'datepicker',
          name: 'deliveryTime',
          placeholder: 'Delivery Time',
          defaultValue: '01/12/2021'
        },
        {
          type: 'number',
          name: 'price',
          placeholder: 'Price'
        },
        {
          type: 'text',
          name: 'proof',
          placeholder: 'Vendor url'
        },
        {
          type: 'text',
          name: 'referralId',
          placeholder: 'Referral Id'
        },
        {
          type: 'boxes',
          name: 'skills',
          placeholder: 'Skills'
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to'
      },
      button: {
        text: 'Offer',
        onClick: values => {
          // TODO: encrypt issueTo and get credentialSubjectListUrl
          return {
            values: {
              ...values,
              title: values.name,
              skills: (values.skills as string[]).map(skill => {
                return {
                  skillId: skill,
                  score: 100
                };
              })
            },
            tags: values.skills,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Deal',
            credentialSchema: 'krebit://schemas/offer'
          };
        }
      }
    }
  },
  {
    type: 'workExperience',
    title: 'Work Experience (Pro)',
    description: 'Certify someone that has worked with/for you',
    primaryColor: 'haiti',
    secondaryColor: 'blueRibbon',
    icon: <WorkExperience />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Role / Job Title'
        },
        {
          name: 'description',
          placeholder:
            'Write the description of the tasks/achievements of that person here'
        },
        {
          type: 'upload',
          name: 'image',
          placeholder: 'add logo'
        },
        {
          type: 'select',
          name: 'entity',
          placeholder: 'Entity/Organization'
        },
        {
          type: 'datepicker',
          name: 'startDate',
          placeholder: 'Start date'
        },
        {
          type: 'datepicker',
          name: 'endDate',
          placeholder: 'End date'
        },
        {
          type: 'text',
          name: 'proof',
          placeholder: 'Proof url'
        },
        {
          type: 'boxes',
          name: 'skills',
          placeholder: 'Skills'
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to'
      },
      button: {
        text: 'WorkExperience',
        onClick: values => {
          // TODO: encrypt issueTo and get credentialSubjectListUrl

          return {
            values: {
              ...values,
              title: values.name,
              skills: (values.skills as string[]).map(skill => {
                return {
                  skillId: skill,
                  score: 100
                };
              })
            },
            tags: values.skills,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'WorkExperience',
            credentialSchema: 'krebit://schemas/workExperience'
          };
        }
      }
    }
  },
  {
    type: 'education',
    title: 'Education (Pro)',
    description: 'Certify students that completed your class or course',

    primaryColor: 'haiti',
    secondaryColor: 'tango',
    icon: <School />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Class/Course Title'
        },
        {
          name: 'description',
          placeholder: 'Write your class/course description here'
        },
        {
          type: 'upload',
          name: 'image',
          placeholder: 'add logo'
        },

        {
          type: 'select',
          name: 'entity',
          placeholder: 'Entity/Organization'
        },
        {
          type: 'datepicker',
          name: 'issuanceDate',
          placeholder: 'Completion date'
        },
        {
          type: 'number',
          name: 'hours',
          placeholder: 'Total hours completed'
        },
        {
          type: 'text',
          name: 'proof',
          placeholder: 'Proof url'
        },
        {
          type: 'boxes',
          name: 'skills',
          placeholder: 'Skills'
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to'
      },
      button: {
        text: 'Issue Credential',
        onClick: values => {
          // TODO: encrypt issueTo and get credentialSubjectListUrl

          return {
            values: {
              ...values,
              skills: (values.skills as string[]).map(skill => {
                return {
                  skillId: skill,
                  score: 100
                };
              })
            },
            tags: values.skills,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Education',
            credentialSchema: 'krebit://schemas/education'
          };
        }
      }
    }
  },
  {
    type: 'attendance',
    title: 'Event Attendance (Pro)',
    description: 'Certify your event attendees',
    primaryColor: 'blueCharcoal',
    secondaryColor: 'oliveDrab',
    icon: <Attendance />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Event Name'
        },
        {
          name: 'description',
          placeholder: 'Write your event description here'
        },
        {
          type: 'upload',
          name: 'image',
          placeholder: 'add logo'
        },

        {
          type: 'select',
          name: 'entity',
          placeholder: 'Entity/Organization'
        },
        {
          type: 'switch',
          name: 'virtual',
          placeholder: 'virtual/IRL'
        },
        {
          type: 'select',
          name: 'country',
          placeholder: 'select',
          items: countries.isoCodes
        },
        {
          type: 'text',
          name: 'city',
          placeholder: 'City'
        },
        {
          type: 'datepicker',
          name: 'startDate',
          placeholder: 'Start date'
        },
        {
          type: 'datepicker',
          name: 'endDate',
          placeholder: 'End date'
        },
        {
          type: 'text',
          name: 'proof',
          placeholder: 'Proof url'
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to'
      },
      button: {
        text: 'Issue Credential',
        onClick: values => {
          // TODO: encrypt issueTo and get credentialSubjectListUrl

          return {
            values,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Attendance',
            credentialSchema: 'krebit://schemas/attendance'
          };
        }
      }
    }
  },

  {
    type: 'badge',
    title: 'Badge (Pro)',
    description: 'Issue an achievement Badge to members of your community',
    primaryColor: 'gray',
    secondaryColor: 'haiti',
    icon: <Token />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Badge Name'
        },
        {
          type: 'select',
          name: 'entity',
          placeholder: 'Community'
        },

        {
          name: 'description',
          placeholder: 'Write your badge description here'
        },
        {
          type: 'text',
          name: 'role',
          placeholder: 'Role'
        },
        {
          type: 'rating',
          name: 'level',
          placeholder: 'Level: 2/5'
        },

        {
          type: 'text',
          name: 'proof',
          placeholder: 'Proof url'
        },
        {
          type: 'boxes',
          name: 'skills',
          placeholder: 'Skills'
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to'
      },
      button: {
        text: 'Issue Credential',
        onClick: values => {
          // TODO: encrypt issueTo and get credentialSubjectListUrl

          return {
            values: {
              ...values,
              level: values?.level ? values.level : '2',
              skills: (values.skills as string[]).map(skill => {
                return {
                  skillId: skill,
                  score: values?.level
                    ? parseInt(values?.level as string) * 20
                    : 100
                };
              })
            },
            tags: values.skills,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Badge',
            credentialSchema: 'krebit://schemas/badge'
          };
        }
      }
    }
  }
];
