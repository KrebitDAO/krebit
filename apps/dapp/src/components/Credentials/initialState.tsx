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

// Functions for specific use cases
import { getReferralCredentials } from '../CredentialsBuilder/utils';

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
      validationType?: string;
      validations?: {
        type: string;
        params: any[];
      }[];
      type?: string;
      defaultValue?: string | number | string[] | number[] | boolean;
      pattern?: string;
      isDisabled?: boolean;
      isRequired?: boolean;
      isMultiline?: boolean;
      items?: IItems[];
      asyncFunction?: (props: any) => void | Promise<any | any[]>;
    }[];
    issueTo?: {
      name: string;
      placeholder: string;
      validationType?: string;
      validations?: {
        type: string;
        params: any[];
      }[];
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
    title: 'Refer a friend',
    description: 'Invite a friend to the Krebiters community',
    primaryColor: 'haiti',
    secondaryColor: 'rose',
    icon: <Delegate />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Referral Title',
          defaultValue: 'Referral',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Referral title is required']
            }
          ]
        },
        {
          name: 'description',
          placeholder: 'Write a personalized invitation message here'
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to',
        validationType: 'array',
        validations: [
          {
            type: 'min',
            params: [1, 'Issuers are required']
          }
        ]
      },
      button: {
        text: 'Invite',
        onClick: values => {
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
          defaultValue: 'Review',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Review title is required']
            }
          ]
        },
        {
          type: 'rating',
          name: 'rating',
          validationType: 'string',
          placeholder: 'Rating: 2/5',
          defaultValue: '2'
        },
        {
          name: 'description',
          validationType: 'string',
          placeholder: 'Write your review here'
        },

        {
          type: 'text',
          name: 'proof',
          validationType: 'string',
          placeholder: 'Proof url'
        },
        {
          type: 'boxes',
          name: 'skills',
          placeholder: 'Skills',
          validationType: 'array',
          validations: [
            {
              type: 'min',
              params: [1, 'Skills are required']
            }
          ]
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to',
        validationType: 'array',
        validations: [
          {
            type: 'min',
            params: [1, 'Issuers are required']
          }
        ]
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
    title: 'Deal (beta)',
    description: 'Offer or quotation for a service or product',
    primaryColor: 'blueCharcoal',
    secondaryColor: 'pomegranate',
    icon: <Deal />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Offer Title',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Offer title is required']
            }
          ]
        },
        {
          type: 'select',
          name: 'deliverableType',
          placeholder: 'Deliverable Type',
          items: [
            { text: 'Service', value: 'service' },
            { text: 'File', value: 'file' },
            { text: 'Video Call', value: 'meeting' },
            { text: 'Product', value: 'product' }
          ],
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Deliverable type is required']
            }
          ]
        },
        {
          name: 'description',
          validationType: 'string',
          placeholder: 'Deliverable description & requirements'
        },
        {
          type: 'upload',
          name: 'image',
          placeholder: 'Image / Logo'
        },
        {
          type: 'datetimepicker',
          name: 'deliveryTime',
          placeholder: 'Delivery Time',
          defaultValue: '2021-12-01T00:00:00',
          validationType: 'string'
        },
        {
          type: 'number',
          name: 'price',
          placeholder: 'Price',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Price is required']
            }
          ]
        },
        {
          type: 'text',
          name: 'proof',
          validationType: 'string',
          placeholder: 'Vendor url'
        },
        {
          type: 'select',
          name: 'referral',
          placeholder: 'Referral Id',
          asyncFunction: props => getReferralCredentials(props),
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Referral is required']
            }
          ]
        },
        {
          type: 'boxes',
          name: 'skills',
          placeholder: 'Skills',
          validationType: 'array',
          validations: [
            {
              type: 'min',
              params: [1, 'Skills are required']
            }
          ]
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to',
        validationType: 'array',
        validations: [
          {
            type: 'min',
            params: [1, 'Issuers are required']
          }
        ]
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
          placeholder: 'Role / Job Title',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Role / Job title is required']
            }
          ]
        },
        {
          name: 'description',
          placeholder:
            'Write the description of the tasks/achievements of that person here',
          validationType: 'string'
        },
        {
          type: 'upload',
          name: 'image',
          placeholder: 'add logo'
        },
        {
          type: 'select',
          name: 'entity',
          placeholder: 'Entity/Organization',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Entity/Organization is required']
            }
          ]
        },
        {
          type: 'datepicker',
          name: 'startDate',
          placeholder: 'Start date',
          validationType: 'string'
        },
        {
          type: 'datepicker',
          name: 'endDate',
          placeholder: 'End date',
          validationType: 'string'
        },
        {
          type: 'text',
          name: 'proof',
          placeholder: 'Proof url',
          validationType: 'string'
        },
        {
          type: 'boxes',
          name: 'skills',
          placeholder: 'Skills',
          validationType: 'array',
          validations: [
            {
              type: 'min',
              params: [1, 'Skills are required']
            }
          ]
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to',
        validationType: 'array',
        validations: [
          {
            type: 'min',
            params: [1, 'Issuers are required']
          }
        ]
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
          placeholder: 'Class/Course Title',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Class/Course title is required']
            }
          ]
        },
        {
          name: 'description',
          placeholder: 'Write your class/course description here',
          validationType: 'string'
        },
        {
          type: 'upload',
          name: 'image',
          placeholder: 'add logo'
        },

        {
          type: 'select',
          name: 'entity',
          placeholder: 'Entity/Organization',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Entity/Organization title is required']
            }
          ]
        },
        {
          type: 'datepicker',
          name: 'issuanceDate',
          placeholder: 'Completion date',
          validationType: 'string'
        },
        {
          type: 'number',
          name: 'hours',
          placeholder: 'Total hours completed',
          validationType: 'string'
        },
        {
          type: 'text',
          name: 'proof',
          placeholder: 'Proof url',
          validationType: 'string'
        },
        {
          type: 'boxes',
          name: 'skills',
          placeholder: 'Skills',
          validationType: 'array',
          validations: [
            {
              type: 'min',
              params: [1, 'Skills are required']
            }
          ]
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to',
        validationType: 'array',
        validations: [
          {
            type: 'min',
            params: [1, 'Issuers are required']
          }
        ]
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
          placeholder: 'Event Name',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Event name is required']
            }
          ]
        },
        {
          name: 'description',
          placeholder: 'Write your event description here',
          validationType: 'string'
        },
        {
          type: 'upload',
          name: 'image',
          placeholder: 'add logo'
        },
        {
          type: 'select',
          name: 'entity',
          placeholder: 'Entity/Organization',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Entity/Organization is required']
            }
          ]
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
          items: countries.isoCodes,
          validationType: 'string'
        },
        {
          type: 'text',
          name: 'city',
          placeholder: 'City',
          validationType: 'string'
        },
        {
          type: 'datepicker',
          name: 'startDate',
          placeholder: 'Start date',
          validationType: 'string'
        },
        {
          type: 'datepicker',
          name: 'endDate',
          placeholder: 'End date',
          validationType: 'string'
        },
        {
          type: 'text',
          name: 'proof',
          placeholder: 'Proof url',
          validationType: 'string'
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to',
        validationType: 'array',
        validations: [
          {
            type: 'min',
            params: [1, 'Issuers are required']
          }
        ]
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
          placeholder: 'Badge Name',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['Badge Name is required']
            }
          ]
        },
        {
          type: 'select',
          name: 'entity',
          placeholder: 'Community',
          validationType: 'string'
        },
        {
          name: 'description',
          placeholder: 'Write your badge description here',
          validationType: 'string'
        },
        {
          type: 'upload',
          name: 'image',
          placeholder: 'add logo'
        },
        {
          type: 'text',
          name: 'role',
          placeholder: 'Role',
          validationType: 'string'
        },
        {
          type: 'rating',
          name: 'level',
          placeholder: 'Level: 2/5',
          defaultValue: '2',
          validationType: 'string'
        },
        {
          type: 'text',
          name: 'proof',
          placeholder: 'Proof url',
          validationType: 'string'
        },
        {
          type: 'boxes',
          name: 'skills',
          placeholder: 'Skills',
          validationType: 'array',
          validations: [
            {
              type: 'min',
              params: [1, 'Skills are required']
            }
          ]
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to',
        validationType: 'array',
        validations: [
          {
            type: 'min',
            params: [1, 'Issuers are required']
          }
        ]
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
