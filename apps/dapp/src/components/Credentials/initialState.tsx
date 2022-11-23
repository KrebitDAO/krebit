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
    type: 'workExperience',
    title: 'Work Experience',
    description: 'Certify someone that has worked for you',
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
            credentialSchema: 'krebit://schemas/workExperience',
            credentialSubjectListUrl: '',
            imageUrl: values?.image || ''
          };
        }
      }
    }
  },
  {
    type: 'recommendation',
    title: 'Endorsement',
    description:
      'Recommend a colleague that you have worked with or a buyer/seller that you have done business with',
    primaryColor: 'haiti',
    secondaryColor: 'tango',
    icon: <Deal />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Title'
        },
        {
          name: 'description',
          placeholder: 'Write your recommendation here'
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
        text: 'Recommend',
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
            credentialType: 'Recommendation',
            credentialSchema: 'krebit://schemas/recommendation',
            credentialSubjectListUrl: '',
            imageUrl: values?.image || ''
          };
        }
      }
    }
  },
  {
    type: 'education',
    title: 'Education',
    description: 'Certify students that completed your class or course',
    primaryColor: 'blueCharcoal',
    secondaryColor: 'pomegranate',
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
            credentialSchema: 'krebit://schemas/education',
            credentialSubjectListUrl: '',
            imageUrl: values?.image || ''
          };
        }
      }
    }
  },
  {
    type: 'attendance',
    title: 'Event Attendance',
    description: 'Certify your event attendees',
    primaryColor: 'blueCharcoal',
    secondaryColor: 'scorpion',
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
            credentialSchema: 'krebit://schemas/attendance',
            credentialSubjectListUrl: '',
            imageUrl: values?.image || ''
          };
        }
      }
    }
  },
  {
    type: 'referr',
    title: 'Referral',
    description:
      'Invite a friend or colleague that your trust to the Krebiters community',
    primaryColor: 'rose',
    secondaryColor: 'haiti',
    icon: <Delegate />,
    form: {
      fields: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Referral Title'
        },
        {
          name: 'description',
          placeholder: 'Write a personalized invitation message here'
        },

        {
          type: 'text',
          name: 'proof',
          placeholder: 'Proof/Job url'
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
            credentialType: 'Invite',
            credentialSchema: 'krebit://schemas/recommendation',
            credentialSubjectListUrl: '',
            imageUrl: values?.image || ''
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
          placeholder: 'Review Title'
        },
        {
          type: 'rating',
          name: 'rating',
          placeholder: 'Rating: 5/10'
        },
        {
          name: 'description',
          placeholder: 'Write your review notes here'
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
            credentialType: 'Invite',
            credentialSchema: 'krebit://schemas/recommendation',
            credentialSubjectListUrl: '',
            imageUrl: values?.image || ''
          };
        }
      }
    }
  },
  {
    type: 'badge',
    title: 'Badge',
    description: 'Issue an achievement Badge to a member of your community',
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
          placeholder: 'Level: 5/10'
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
            credentialType: 'Badge',
            credentialSchema: 'krebit://schemas/badge',
            credentialSubjectListUrl: '',
            imageUrl: values?.image || ''
          };
        }
      }
    }
  }
];
