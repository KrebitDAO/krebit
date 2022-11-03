import { MouseEvent, ReactNode } from 'react';

import { Cake } from 'components/Icons';

// types
import { IItems } from 'components/Select';

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
    button?: {
      text: string;
      onClick: (event: MouseEvent<HTMLButtonElement>) => void;
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
      ]
    }
  }
];
