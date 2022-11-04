import { ReactNode } from 'react';

import { Cake } from 'components/Icons';

// types
import { IItems } from 'components/Select';

export interface IFormValues {
  [key: string]: string | number | string[] | number[] | boolean | File;
}

export interface ICredentialsState {
  id: string;
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
      onClick: (values: IFormValues) => string | Promise<string>;
      isDisabled?: boolean;
    };
  };
}

export const CREDENTIALS_INITIAL_STATE: ICredentialsState[] = [
  {
    id: 'work',
    title: 'Work',
    description:
      'Create your educational credentials to valide the skills of your students.',
    primaryColor: 'melrose',
    secondaryColor: 'blueRibbon',
    icon: <Cake />,
    form: {
      fields: [
        {
          type: 'boxes',
          name: 'boxes',
          placeholder: 'boxes'
        },
        {
          type: 'text',
          name: 'name',
          placeholder: 'hola a todos'
        },
        {
          type: 'text',
          name: 'description',
          placeholder: 'hola a todas'
        },
        {
          type: 'upload',
          name: 'image',
          placeholder: 'add image'
        },
        {
          name: 'testing',
          placeholder: 'testing'
        },
        {
          type: 'switch',
          name: 'change',
          placeholder: 'change'
        },
        {
          type: 'select',
          name: 'select',
          placeholder: 'select',
          items: [
            {
              text: 'testing',
              value: 'testing'
            },
            {
              text: 'testing1',
              value: 'testing1'
            }
          ]
        },
        {
          type: 'datepicker',
          name: 'datepicker',
          placeholder: 'datepicker'
        }
      ],
      issueTo: {
        name: 'issueTo',
        placeholder: 'Issue to'
      },
      button: {
        text: 'Create credentials',
        onClick: async values => {
          console.log(values);
          return '123';
        }
      }
    }
  }
];
