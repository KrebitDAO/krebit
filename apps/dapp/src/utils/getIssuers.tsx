import { ChangeEvent, ReactNode } from 'react';
import {
  Approval,
  Badge,
  Discord,
  Email,
  Phone,
  Twitter,
  Github,
  Spect,
  Cake,
  Person,
  Guild,
  Dework,
  Stack
} from 'components/Icons';
import { countries } from './countries';
import { constants } from './constants';

// types
import { ICredential } from './normalizeSchema';
import { IItems } from 'components/Select';
import { SelectChangeEvent } from '@mui/material';

interface IStepMetadata {
  title: string;
  description: string;
  icon: ReactNode;
  imageUrl?: string;
  verificationUrl?: string;
  did?: string;
  address?: string;
  price?: string;
}

interface IIssuerParamsStep {
  title: string;
  type: 'overview' | 'verification' | 'credential' | 'mint';
  metadata: IStepMetadata;
  form: (
    provider: any,
    credential: ICredential,
    currentVerify: IIssuerParams
  ) => {
    fields?: {
      name: string;
      placeholder: string;
      value: string | number | boolean;
      onChange: (
        event: ChangeEvent<HTMLInputElement> | SelectChangeEvent
      ) => void;
      type?: string;
      pattern?: string;
      isDisabled?: boolean;
      isRequired?: boolean;
      items?: IItems[];
    }[];
    action?: {
      text: string;
      method: () => Promise<any>;
      isDisabled?: boolean;
    };
  };
}

interface IIssuerParams {
  credentialType: string;
  entity: string;
  verificationUrl: string;
  address: string;
  imageUrl?: string;
  icon?: ReactNode;
  badgeText?: string;
  badgeColor?: string;
  badgeIconColor?: string;
  isDisabled?: boolean;
  steps: IIssuerParamsStep[];
}

const PERSONHOOD_CREDENTIALS = [
  {
    credentialType: 'Discord',
    entity: 'Discord',
    icon: <Discord />,
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Discord details',
          description:
            'Krebit Verification Node. This is the discord used for blah blah blah',
          icon: <Discord />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify discord',
        type: 'credential',
        metadata: {
          title: 'Verify discord',
          description: 'Claim your Discord profile'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify)
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'Twitter',
    entity: 'Twitter',
    icon: <Twitter />,
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Twitter details',
          description:
            'Krebit Verification Node. This is the twitter used for blah blah blah',
          icon: <Twitter />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID,
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
          price: '0'
        }
      },
      {
        title: 'Verify twitter',
        type: 'credential',
        metadata: {
          title: 'Twitter discord',
          description: 'Claim your Twitter profile'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'username',
              placeholder: 'Enter you twitter handle',
              value: provider?.claimValues?.username,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify)
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'TwitterVerified',
    entity: 'Twitter Verified (blue checkmark)',
    icon: <Twitter />,
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    badgeText: 'Beta',
    badgeColor: 'blueRibbon',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Twitter details',
          description:
            'Krebit Verification Node. This is the twitter used for blah blah blah',
          icon: <Twitter />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify twitter',
        type: 'credential',
        metadata: {
          title: 'Verify twitter',
          description: 'Claim your Twitter profile'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'username',
              placeholder: 'Enter you twitter handle',
              value: provider?.claimValues?.username,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify)
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'Github',
    entity: 'Github',
    icon: <Github />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Github details',
          description:
            'Krebit Verification Node. This is the Github used for blah blah blah',
          icon: <Github />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          imageUrl:
            process.env.NEXT_PUBLIC_IPFS_GATEWAY +
            '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
          price: '0'
        }
      },
      {
        title: 'Verify Github',
        type: 'credential',
        metadata: {
          title: 'Verify github',
          description: 'Claim your Github profile'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'username',
              placeholder: 'Enter you github username',
              value: provider?.claimValues?.username,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: Is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify)
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'PhoneNumber',
    entity: 'Phone',
    icon: <Phone />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/phone'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'PhoneNumber details',
          description:
            'Krebit Verification Node. This is the PhoneNumber used for blah blah blah',
          icon: <Phone />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/phone'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Claim phone number',
        type: 'verification',
        metadata: {
          title: 'Claim phone number',
          description: 'Claim your phone number'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'countryCode',
              type: 'select',
              placeholder: 'Select the country dialing prefix',
              value: provider?.claimValues?.countryCode,
              items: countries.phoneCodes,
              onChange: provider?.handleClaimValues
            },
            {
              type: 'password',
              pattern: '[0-9]*',
              name: 'number',
              placeholder: 'Enter phone number',
              value: provider?.claimValues?.number,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: Is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              isDisabled: true,
              onChange: undefined
            }
          ],
          action: {
            text: 'Send code',
            method: async () =>
              await provider.handleStartVerification(currentVerify),
            isDisabled:
              !provider?.claimValues?.countryCode ||
              !provider?.claimValues?.number
          }
        })
      },
      {
        title: 'Verify phone number',
        type: 'credential',
        metadata: {
          title: 'Verify phone number',
          description: 'Get phone number credential via Twilio'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              type: 'number',
              name: 'code',
              placeholder: 'Enter the SMS code sent to your phone',
              value: provider?.claimValues?.code,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider?.handleGetCredential()
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'Email',
    entity: 'Email',
    icon: <Email />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/email'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Email details',
          description:
            'Krebit Verification Node. This is the email used for blah blah blah',
          icon: <Email />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/email'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Claim email address',
        type: 'verification',
        metadata: {
          title: 'Claim email address',
          description: 'Claim your email address'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              type: 'email',
              name: 'email',
              placeholder: 'username@example.com',
              value: provider?.claimValues?.email,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              isDisabled: true,
              onChange: undefined
            }
          ],
          action: {
            text: 'Send code',
            method: async () =>
              await provider.handleStartVerification(currentVerify),
            isDisabled: !provider?.claimValues?.email
          }
        })
      },
      {
        title: 'Verify email address',
        type: 'credential',
        metadata: {
          title: 'Verify email address',
          description: 'Get email credential via Twilio'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              type: 'number',
              name: 'code',
              placeholder: 'Enter the verification code sent to your email',
              value: provider?.claimValues?.code,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleGetCredential()
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'VeriffAgeGT18',
    entity: 'Age > 18 (KYC)',
    icon: <Cake />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/veriff'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    isDisabled: !process.env.NEXT_PUBLIC_VERIFF_ENABLED,
    badgeText: 'Beta',
    badgeColor: 'blueRibbon',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Adulthood details',
          description:
            'Krebit Verification Node. This is the Adulthood used for blah blah blah',
          icon: <Cake />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/veriff'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Adulthood',
        type: 'credential',
        metadata: {
          title: 'Verify Adulthood',
          description: 'Start verification of your Adulthood with Veriff'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'date',
              type: 'datepicker',
              placeholder: 'Date of birth',
              value: provider?.claimValues?.date,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              isDisabled: true,
              onChange: undefined
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify)
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'VeriffGovernmentId',
    entity: 'Verified Government Id (KYC)',
    icon: <Badge />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/veriff'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    isDisabled: !process.env.NEXT_PUBLIC_VERIFF_ENABLED,
    badgeText: 'Beta',
    badgeColor: 'blueRibbon',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Government Id details',
          description:
            'Krebit Verification Node. This is the Government Id used for blah blah blah',
          icon: <Badge />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/veriff'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Government Id',
        type: 'credential',
        metadata: {
          title: 'Verify Government Id',
          description: 'Claim your Government Id'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'country',
              type: 'select',
              placeholder: 'Select the ID document country',
              value: provider?.claimValues?.country,
              items: countries.isoCodes,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'number',
              placeholder:
                'ID number with *all* exact characters as it appears on the document',
              value: provider?.claimValues?.number,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: Is not recommended to publish private data to public networks)',
              value: provider?.claimValues.private,
              isDisabled: true,
              onChange: undefined
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify),
            isDisabled:
              !provider?.claimValues?.country || !provider?.claimValues?.number
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'VeriffLegalName',
    entity: 'Legal Name (KYC)',
    icon: <Person />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/veriff'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    isDisabled: !process.env.NEXT_PUBLIC_VERIFF_ENABLED,
    badgeText: 'Beta',
    badgeColor: 'blueRibbon',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Full legal name details',
          description:
            'Krebit Verification Node. This is the full legal name used for blah blah blah',
          icon: <Person />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/veriff'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Full legal name',
        type: 'credential',
        metadata: {
          title: 'Verify Full legal name',
          description: 'Claim your full legal name'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'firstName',
              placeholder:
                'Enter you first name as it appears on the ID document',
              value: provider?.claimValues?.firstName,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'lastName',
              placeholder:
                'Enter you last name as it appears on the ID document',
              value: provider?.claimValues?.lastName,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              isDisabled: true,
              onChange: undefined
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify),
            isDisabled:
              !provider?.claimValues?.firstName ||
              !provider?.claimValues?.lastName
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  }
];

const WORK_CREDENTIALS = [
  {
    credentialType: 'StackOverflowReputationGT1K',
    entity: 'Stack Overflow Reputation > 1K',
    icon: <Stack />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/stack'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'New',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Stack Overflow Reputation > 1K details',
          description:
            'Krebit Verification Node. This is the Stack Overflow Reputation > 1K used for blah blah blah',
          icon: <Stack />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/stack'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Stack Overflow Reputation > 1K',
        type: 'credential',
        metadata: {
          title: 'Verify Stack Overflow Reputation > 1K',
          description:
            'Claim that your StackOverflow profile has more than 1K of reputation'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify)
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'StackOverflowScoreGT10',
    entity: 'Stack Overflow Tag Score > 10',
    icon: <Stack />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/stack'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    badgeText: 'Beta',
    badgeColor: 'blueRibbon',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Stack Overflow Tag Score > 10 details',
          description:
            'Krebit Verification Node. This is the Stack Overflow Tag Score > 10 used for blah blah blah',
          icon: <Stack />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/stack'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Stack Overflow Tag Score > 10',
        type: 'credential',
        metadata: {
          title: 'Verify Stack Overflow Tag Score > 10',
          description:
            'Claim that your StackOverflow profile has a score more than 10 for a programming language'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'language',
              type: 'select',
              placeholder: 'Select the language tag',
              value: provider?.claimValues?.language,
              items: constants.DEFAULT_SKILL_LANGUAGES,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify)
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'DeworkCompletedTasksGT10',
    entity: 'Dework Completed Tasks > 10',
    icon: <Dework />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/dework'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    badgeText: 'New',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Dework Completed Tasks > 10 details',
          description:
            'Krebit Verification Node. This is the Dework Completed Tasks > 10 used for blah blah blah',
          icon: <Dework />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/dework'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Dework Completed Tasks > 10',
        type: 'credential',
        metadata: {
          title: 'Verify Dework Completed Tasks > 10',
          description: 'Claim your Dework completed tasks'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'organization',
              placeholder: 'Enter the Dework organization',
              value: provider?.claimValues?.organization,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify),
            isDisabled:
              !provider?.claimValues?.organization ||
              provider?.claimValues?.organization === ''
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'SpectCompletedTasksGT10',
    entity: 'Spect Completed Tasks > 10',
    icon: <Spect />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/spect'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Spect Completed Tasks > 10 details',
          description:
            'Krebit Verification Node. This is the Spect Completed Tasks > 10 used for blah blah blah',
          icon: <Spect />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/spect'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify spect',
        type: 'credential',
        metadata: {
          title: 'Verify spect',
          description: 'Claim your Spect completed tasks'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'circle',
              placeholder: 'Enter the spect circle',
              value: provider?.claimValues?.circle,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify),
            isDisabled:
              !provider?.claimValues?.circle ||
              provider?.claimValues?.circle === ''
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'GithubFollowersGT10',
    entity: 'Github Followers > 10',
    icon: <Github />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Github Followers > 10 details',
          description:
            'Krebit Verification Node. This is the Github Followers > 10 used for blah blah blah',
          icon: <Github />,
          imageUrl:
            process.env.NEXT_PUBLIC_IPFS_GATEWAY +
            '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Github Followers > 10',
        type: 'credential',
        metadata: {
          title: 'Verify Github Followers > 10',
          description:
            'Claim that your github profile has more than 10 followers'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'username',
              placeholder: 'Enter you github username',
              value: provider?.claimValues?.username,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify),
            isDisabled:
              !provider?.claimValues?.username ||
              provider?.claimValues?.username === ''
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'GithubRepoStarsGT10',
    entity: 'Github Repository Stars > 10',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Github Repository Stars > 10 details',
          description:
            'Krebit Verification Node. This is the Github Repository Stars > 10 used for blah blah blah',
          icon: <Github />,
          imageUrl:
            process.env.NEXT_PUBLIC_IPFS_GATEWAY +
            '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Github Repository Stars > 10',
        type: 'credential',
        metadata: {
          title: 'Verify Github Repository Stars > 10',
          description: 'Claim your github repo'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'username',
              placeholder: 'Enter you github username',
              value: provider?.claimValues?.username,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'repository',
              placeholder: 'Enter the github repository',
              value: provider?.claimValues?.repository,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify),
            isDisabled:
              !provider?.claimValues?.username ||
              provider?.claimValues?.username === ''
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  },
  {
    credentialType: 'GithubRepoCollaborator',
    entity: 'Github Repo Collaborator',
    icon: <Github />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Github Repo Collaborator details',
          description:
            'Krebit Verification Node. This is the Github Repo Collaborator used for blah blah blah',
          icon: <Github />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Github Repo Collaborator',
        type: 'credential',
        metadata: {
          title: 'Verify Github Repo Collaborator',
          description: 'Claim that you are a github repo collaborator'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'username',
              placeholder: 'Enter you github username',
              value: provider?.claimValues?.username,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'owner',
              placeholder: 'Enter the github repository owner',
              value: provider?.claimValues?.owner,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'repository',
              placeholder: 'Enter the github repository',
              value: provider?.claimValues?.repository,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'private',
              type: 'switch',
              placeholder: provider?.claimValues?.private
                ? 'private (Stored encrypted off-chain)'
                : 'public (WARNING: It is not recommended to publish private data to public networks)',
              value: provider?.claimValues?.private,
              onChange: provider?.handleClaimValues
            }
          ],
          action: {
            text: 'Verify',
            method: async () => await provider.handleFetchOAuth(currentVerify),
            isDisabled:
              !provider?.claimValues?.username ||
              provider?.claimValues?.username === ''
          }
        })
      },
      {
        title: 'Mint credential',
        type: 'mint',
        metadata: {
          title: 'Mint credential',
          description:
            'Mint the credential stamp and NFT ( NOTE: we cover gas for you :)  )'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Mint',
            method: async () =>
              await provider?.handleMintCredential(
                provider?.currentCredential || credential?.credential
              )
          }
        })
      }
    ]
  }
];

const COMMUNITY_CREDENTIALS = [
  {
    credentialType: 'GuildXyzMember',
    entity: 'Guild Member',
    description: 'Krebit Verification Node',
    icon: <Guild />,
    imageUrl:
      'https://guild-xyz.mypinata.cloud/ipfs/QmSJtjpHzaEdMuBE2uAPSN3r32eZkLXndMzQLBSbknFD1W',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'New'
  },
  {
    credentialType: 'GuildXyzAdmin',
    entity: 'Admin of Guild',
    description: 'Krebit Verification Node',
    icon: <Guild />,
    imageUrl:
      'https://guild-xyz.mypinata.cloud/ipfs/QmSJtjpHzaEdMuBE2uAPSN3r32eZkLXndMzQLBSbknFD1W',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'New'
  },
  {
    credentialType: 'GuildXyzRole',
    entity: 'Has Role in a Guild',
    description: 'Krebit Verification Node',
    icon: <Guild />,
    imageUrl:
      'https://guild-xyz.mypinata.cloud/ipfs/QmSJtjpHzaEdMuBE2uAPSN3r32eZkLXndMzQLBSbknFD1W',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0',
    badgeText: 'New'
  },
  {
    credentialType: 'TwitterFollowersGT1K',
    entity: 'Twitter Followers > 1K',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/twitter-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'TwitterFollowersGT10K',
    entity: 'Twitter Followers > 10K',
    description: 'Krebit Verification Node',
    icon: <Twitter />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/twitter-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'DiscordGuildOwner',
    entity: 'Discord Guild Owner',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'DiscordGuildMember',
    entity: 'Discord Guild Member',
    description: 'Krebit Verification Node',
    icon: <Discord />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'GithubOrgMember',
    entity: 'Github Organization Member',
    description: 'Krebit Verification Node',
    icon: <Github />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  },
  {
    credentialType: 'Issuer',
    entity: 'Issuer',
    description: 'Krebit Verification Node',
    icon: <Approval />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmThGkNo3FcNrF3za1x5eqGpN99Dr9HXY6NkpQvMPArs8j/krebit-logo.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/issuer'),
    did: process.env.NEXT_PUBLIC_ISSUER_DID,
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    price: '0'
  }
];

const getIssuers = (type: string): any[] => {
  //TODO: call Krebit.call.getIssuers(type);
  switch (type) {
    case 'Personhood':
      return PERSONHOOD_CREDENTIALS;
    case 'WorkExperience':
      return WORK_CREDENTIALS;
    case 'Community':
      return COMMUNITY_CREDENTIALS;
    default:
      return [];
  }
};

export { getIssuers };
export type { IIssuerParams, IIssuerParamsStep };
