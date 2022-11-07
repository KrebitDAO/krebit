import { ReactNode } from 'react';

import {
  Attendance,
  Token,
  Badge,
  Delegate,
  School,
  Deal,
  WorkExperience,
  Star
} from 'components/Icons';

// types
import { IItems } from 'components/Select';

import {
  getCredential,
  generateUID,
  getWalletInformation,
  constants,
  countries,
  sortByDate
} from 'utils';

import Krebit from '@krebitdao/reputation-passport';
import LitJsSdk from '@lit-protocol/sdk-browser';

const { NEXT_PUBLIC_CERAMIC_URL } = process.env;
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
      onClick: (values: IFormValues) => string | Promise<string>;
      isDisabled?: boolean;
    };
  };
}

//TODO: move to upper level
const getEntities = async () => {
  /*try {
    const session = window.localStorage.getItem('did-session');
    const currentSession = JSON.parse(session);

    if (!currentSession) return;

    const currentType = localStorage.getItem('auth-type');
    const walletInformation = await getWalletInformation(currentType);

    const passport = new Krebit.core.Passport({
      ...walletInformation,
      ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
    });
    await passport.connect();
    const Issuer = new Krebit.core.Krebit({
      ...walletInformation,
      litSdk: LitJsSdk,
      ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
    });
    await Issuer.connect(currentSession);

    const guildAdminCredentials = (
      await passport.getCredentials(undefined, 'GuildXyzAdmin')
    )
      .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate, 'des'))
      .slice(0, 10);

    const discordOwnerCredentials = (
      await passport.getCredentials(undefined, 'DiscordGuildOwner')
    )
      .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate, 'des'))
      .slice(0, 10);

    const gitHubCredentials = (
      await passport.getCredentials(undefined, 'GithubOrgMember')
    )
      .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate, 'des'))
      .slice(0, 10);

    const currentCredentials = [
      ...guildAdminCredentials,
      ...discordOwnerCredentials,
      ...gitHubCredentials
    ];
    console.log('admincredentials', currentCredentials);
    if (currentCredentials.length > 0) {
      const decriptedEntities = await Promise.all(
        currentCredentials.map(async credential => {
          //const stamps = await passport.getStamps({
          //  claimId: credential.id
          //});
          let claimValue = null;
          const value = await passport.getClaimValue(credential);
          if (value?.encryptedString) {
            claimValue = await Issuer.decryptClaimValue(value);
          }

          return {
            text: `${claimValue.entity} [${credential.credentialSubject.type}]`,
            value: claimValue.entity
          };
        })
      );

      let entities = [{ text: 'Personal', value: 'personal' }];
      if (decriptedEntities.length > 0)
        entities = entities.concat(decriptedEntities);

      return entities;
    }
  } catch (error) {
    console.log('error: ', error);*/
  return [{ text: 'Personal', value: 'personal' }];
  //}
};

const handleGetCredential = async (values: any) => {
  try {
    console.log(values);
    const session = window.localStorage.getItem('did-session');
    const currentSession = JSON.parse(session);

    if (!currentSession) return;

    const currentType = localStorage.getItem('auth-type');
    const walletInformation = await getWalletInformation(currentType);

    // Step 1-A:  Get credential from Master Issuer based on claim:
    // Issue self-signed credential to become an Issuer

    const Issuer = new Krebit.core.Krebit({
      ...walletInformation,
      litSdk: LitJsSdk,
      ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
    });
    await Issuer.connect(currentSession);

    console.log('add: ', walletInformation.address);
    console.log('did: ', Issuer.did);

    let typeSchemaUrl = await Issuer.getTypeSchema('Issuer');
    if (!typeSchemaUrl) {
      const issuerSchema = Krebit.schemas.claims.issuer;
      typeSchemaUrl = await Issuer.setTypeSchema('Issuer', issuerSchema);
    }

    const expirationDate = new Date();
    const expiresYears = 1;
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    const claim = {
      id: `issuer-${generateUID(10)}`,
      did: Issuer.did,
      ethereumAddress: walletInformation.address,
      type: 'Issuer',
      typeSchema: 'krebit://schemas/issuer',
      tags: ['Community', `${values.credentialType}Issuer`],
      value: values,
      expirationDate: new Date(expirationDate).toISOString()
    };
    console.log('claim: ', claim);

    const delegatedCredential = await Issuer.issue(claim);
    console.log('delegatedCredential: ', delegatedCredential);

    const passport = new Krebit.core.Passport({
      ...walletInformation,
      ceramicUrl: NEXT_PUBLIC_CERAMIC_URL
    });
    await passport.connect(currentSession);
    // Save delegatedCredential
    if (delegatedCredential) {
      const delegatedCredentialId = await passport.addIssued(
        delegatedCredential
      );
      console.log('delegatedCredentialId: ', delegatedCredentialId);

      // Step 1-B: Send self-signed credential to the Issuer for verification
      const issuedCredential = await getCredential({
        verifyUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/issuer'),
        claimedCredentialId: delegatedCredentialId
      });

      console.log('issuedCredential: ', issuedCredential);

      // Step 1-C: Get the verifiable credential, and save it to the passport
      if (issuedCredential) {
        const addedCredentialId = await passport.addCredential(
          issuedCredential
        );
        console.log('addedCredentialId: ', addedCredentialId);
        return addedCredentialId.replace('ceramic://', '');
      }
    }
  } catch (error) {
    console.log('error: ', error);
    return constants.DEFAULT_ERROR_MESSAGE_FOR_PROVIDERS.ERROR_CREDENTIAL;
  }
};

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
          type: 'switch',
          name: 'private',
          placeholder: 'public/private'
        },
        {
          type: 'select',
          name: 'entity',
          placeholder: 'Entity/Organization',
          items: await getEntities()
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
        onClick: async values => {
          console.log(values);

          let imageUrl = '';
          if (values.image) {
            //upload image
            imageUrl = 'uploaded url';
          } else {
            //imageUrl = formatUrlImage(profile?.picture)
          }

          //encrypt issueTo and get credentialSubjectListUrl

          return await handleGetCredential({
            ...values,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'WorkExperience',
            credentialSchema: 'krebit://schemas/workExperience',
            credentialSubjectListUrl: '',
            imageUrl: ''
          });
        }
      }
    }
  },
  {
    type: 'recommendation',
    title: 'Recomendation',
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
          type: 'switch',
          name: 'private',
          placeholder: 'public/private'
        },
        {
          type: 'select',
          name: 'entity',
          placeholder: 'Entity/Organization',
          items: await getEntities()
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
        onClick: async values => {
          console.log(values);

          let imageUrl = '';
          if (values.image) {
            //upload image
            imageUrl = 'uploaded url';
          } else {
            //imageUrl = formatUrlImage(profile?.picture)
          }

          //encrypt issueTo and get credentialSubjectListUrl

          return await handleGetCredential({
            ...values,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Recommendation',
            credentialSchema: 'krebit://schemas/recommendation',
            credentialSubjectListUrl: '',
            imageUrl: ''
          });
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
          type: 'switch',
          name: 'private',
          placeholder: 'public/private'
        },
        {
          type: 'select',
          name: 'entity',
          placeholder: 'Entity/Organization',
          items: await getEntities()
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
        onClick: async values => {
          console.log(values);

          let imageUrl = '';
          if (values.image) {
            //upload image
            imageUrl = 'uploaded url';
          } else {
            //imageUrl = formatUrlImage(profile?.picture)
          }

          //encrypt issueTo and get credentialSubjectListUrl

          return await handleGetCredential({
            ...values,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Education',
            credentialSchema: 'krebit://schemas/education',
            credentialSubjectListUrl: '',
            imageUrl: ''
          });
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
          type: 'switch',
          name: 'private',
          placeholder: 'public/private'
        },
        {
          type: 'select',
          name: 'entity',
          placeholder: 'Entity/Organization',
          items: await getEntities()
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
        onClick: async values => {
          console.log(values);
          let imageUrl = '';
          if (values.image) {
            //upload image
            imageUrl = 'uploaded url';
          } else {
            //imageUrl = formatUrlImage(profile?.picture)
          }

          //encrypt issueTo and get credentialSubjectListUrl

          return await handleGetCredential({
            ...values,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Attendance',
            credentialSchema: 'krebit://schemas/attendance',
            credentialSubjectListUrl: '',
            imageUrl: ''
          });
        }
      }
    }
  },
  {
    type: 'invite',
    title: 'Invite',
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
          placeholder: 'Invitation Title'
        },
        {
          name: 'description',
          placeholder: 'Write a personalized invitation message here'
        },
        {
          type: 'switch',
          name: 'private',
          placeholder: 'public/private'
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
        text: 'Invite',
        onClick: async values => {
          console.log(values);

          //encrypt issueTo and get credentialSubjectListUrl

          return await handleGetCredential({
            ...values,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Invite',
            credentialSchema: 'krebit://schemas/recommendation',
            credentialSubjectListUrl: '',
            imageUrl: ''
          });
        }
      }
    }
  },
  {
    type: 'review',
    title: 'Review',
    description: 'Rate anyone in the Krebiters community',
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
          type: 'switch',
          name: 'private',
          placeholder: 'public/private'
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
        onClick: async values => {
          console.log(values);

          //encrypt issueTo and get credentialSubjectListUrl

          return await handleGetCredential({
            ...values,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Invite',
            credentialSchema: 'krebit://schemas/recommendation',
            credentialSubjectListUrl: '',
            imageUrl: ''
          });
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
          placeholder: 'Community',
          items: await getEntities()
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
          type: 'switch',
          name: 'private',
          placeholder: 'public/private'
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
        onClick: async values => {
          console.log(values);

          //encrypt issueTo and get credentialSubjectListUrl

          return await handleGetCredential({
            ...values,
            verificationUrl: `${NEXT_PUBLIC_ISSUER_NODE_URL}/delegated`,
            did: NEXT_PUBLIC_ISSUER_DID,
            ethereumAddress: NEXT_PUBLIC_ISSUER_ADDRESS,
            credentialType: 'Badge',
            credentialSchema: 'krebit://schemas/badge',
            credentialSubjectListUrl: '',
            imageUrl: ''
          });
        }
      }
    }
  }
];
