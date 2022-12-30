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
  Stack,
  Star
} from 'components/Icons';
import { countries } from './countries';
import { constants } from './constants';

// types
import { ICredential } from './normalizeSchema';
import { IItems } from 'components/Select';
import { SelectChangeEvent } from '@mui/material';
import { IWalletInformation } from 'context';

interface IStepMetadata {
  title: string;
  description: string;
  icon?: ReactNode;
  imageUrl?: string;
  verificationUrl?: string;
  did?: string;
  address?: string;
  price?: string;
}

interface IIssuerParamsStep {
  title: string;
  type: 'overview' | 'verification' | 'credential' | 'mint' | 'add';
  metadata: IStepMetadata;
  form?: (
    provider: any,
    credential: ICredential,
    currentVerify: IIssuerParams,
    walletInformation: IWalletInformation
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

const PERSONHOOD_CREDENTIALS: IIssuerParams[] = [
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
          title: 'Discord',
          description:
            'The Krebit Verification Node issues this discord Credential',
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
          title: 'Twitter',
          description:
            'The Krebit Verification Node issues this twitter Credential',
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
          title: 'Twitter Verified (blue checkmark)',
          description:
            'The Krebit Verification Node issues this twitter Credential',
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
          title: 'Github',
          description:
            'The Krebit Verification Node issues this Github Credential',
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
          title: 'Phone Number',
          description:
            'The Krebit Verification Node issues this Phone Number Credential',
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
          title: 'Email',
          description:
            'The Krebit Verification Node issues this email Credential',
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
          title: 'Adulthood',
          description:
            'The Krebit Verification Node issues this Adulthood Credential',
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
          title: 'Government Id',
          description:
            'The Krebit Verification Node issues this Government Id Credential',
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
          title: 'Full legal name',
          description:
            'The Krebit Verification Node issues this full legal name Credential',
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

const WORK_CREDENTIALS: IIssuerParams[] = [
  {
    credentialType: 'StackOverflowReputationGT1K',
    entity: 'Stack Overflow Reputation > 1K',
    icon: <Stack />,
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/stack'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    badgeText: 'New',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Stack Overflow Reputation > 1K',
          description:
            'The Krebit Verification Node issues this Stack Overflow Reputation > 1K Credential',
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
          title: 'Stack Overflow Tag Score > 10',
          description:
            'The Krebit Verification Node issues this Stack Overflow Tag Score > 10 Credential',
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
          title: 'Dework Completed Tasks > 10',
          description:
            'The Krebit Verification Node issues this Dework Completed Tasks > 10 Credential',
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
          title: 'Spect Completed Tasks > 10',
          description:
            'The Krebit Verification Node issues this Spect Completed Tasks > 10 Credential',
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
          title: 'Github Followers > 10',
          description:
            'The Krebit Verification Node issues this Github Followers > 10 Credential',
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
          title: 'Github Repository Stars > 10',
          description:
            'The Krebit Verification Node issues this Github Repository Stars > 10 Credential',
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
          title: 'Github Repo Collaborator',
          description:
            'The Krebit Verification Node issues this Github Repo Collaborator Credential',
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

const COMMUNITY_CREDENTIALS: IIssuerParams[] = [
  {
    credentialType: 'GuildXyzMember',
    entity: 'Guild Member',
    icon: <Guild />,
    imageUrl:
      'https://guild-xyz.mypinata.cloud/ipfs/QmSJtjpHzaEdMuBE2uAPSN3r32eZkLXndMzQLBSbknFD1W',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    badgeText: 'New',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Guild Member',
          description:
            'The Krebit Verification Node issues this Guild Member Credential',
          icon: <Guild />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Guild Member',
        type: 'credential',
        metadata: {
          title: 'Verify Guild Member',
          description: 'Claim your guild membership'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'guildId',
              type: 'select',
              placeholder: 'Select the guild',
              value: provider?.claimValues?.guildId,
              items: provider?.guildNames,
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
            method: async () =>
              await provider.handleGetCredential(currentVerify),
            isDisabled:
              !provider?.claimValues?.guildId ||
              provider?.claimValues?.guildId === ''
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
    credentialType: 'GuildXyzAdmin',
    entity: 'Admin of Guild',
    icon: <Guild />,
    imageUrl:
      'https://guild-xyz.mypinata.cloud/ipfs/QmSJtjpHzaEdMuBE2uAPSN3r32eZkLXndMzQLBSbknFD1W',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    badgeText: 'New',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Admin of Guild',
          description:
            'The Krebit Verification Node issues this Admin of Guild Credential',
          icon: <Guild />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Admin of Guild',
        type: 'credential',
        metadata: {
          title: 'Verify Admin of Guild',
          description: 'Claim your guild admin status'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'guildId',
              type: 'select',
              placeholder: 'Select the guild',
              value: provider?.claimValues?.guildId,
              items: provider?.guildNames,
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
            method: async () =>
              await provider.handleGetCredential(currentVerify),
            isDisabled:
              !provider?.claimValues?.guildId ||
              provider?.claimValues?.guildId === ''
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
    credentialType: 'GuildXyzRole',
    entity: 'Has Role in a Guild',
    icon: <Guild />,
    imageUrl:
      'https://guild-xyz.mypinata.cloud/ipfs/QmSJtjpHzaEdMuBE2uAPSN3r32eZkLXndMzQLBSbknFD1W',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    badgeText: 'New',
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Guild role',
          description:
            'The Krebit Verification Node issues this Guild role Credential',
          icon: <Guild />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/guild'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify guild role',
        type: 'credential',
        metadata: {
          title: 'Verify guild role',
          description: 'Claim your guild role'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'guildId',
              type: 'select',
              placeholder: 'Select the guild',
              value: provider?.claimValues?.guildId,
              items: provider?.guildNames,
              onChange: provider?.handleClaimValues
            },
            {
              name: 'roleId',
              type: 'select',
              placeholder: 'Select the role',
              value: provider?.claimValues?.roleId,
              items: provider?.roleNames,
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
            method: async () =>
              await provider.handleGetCredential(currentVerify),
            isDisabled:
              !provider?.claimValues?.guildId ||
              provider?.claimValues?.guildId === ''
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
    credentialType: 'TwitterFollowersGT1K',
    entity: 'Twitter Followers > 1K',
    icon: <Twitter />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/twitter-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Twitter Followers > 1K',
          description:
            'The Krebit Verification Node issues this Twitter Followers > 1K Credential',
          icon: <Twitter />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Twitter Followers > 1K',
        type: 'credential',
        metadata: {
          title: 'Verify Twitter Followers > 1K',
          description:
            'Claim that your twitter follower count is more than 1,000'
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
    credentialType: 'TwitterFollowersGT10K',
    entity: 'Twitter Followers > 10K',
    icon: <Twitter />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/twitter-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Twitter Followers > 10K',
          description:
            'The Krebit Verification Node issues this Twitter Followers > 10K Credential',
          icon: <Twitter />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/twitter'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify Twitter Followers > 10K',
        type: 'credential',
        metadata: {
          title: 'Verify Twitter Followers > 10K',
          description: 'Claim that your twitter follower count is more than 10K'
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
    credentialType: 'DiscordGuildOwner',
    entity: 'Discord Guild Owner',
    icon: <Discord />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Discord guild ownership',
          description:
            'The Krebit Verification Node issues this discord guild ownership Credential',
          icon: <Discord />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify discord guild ownership',
        type: 'credential',
        metadata: {
          title: 'Verify discord guild ownership',
          description: 'Claim your discord guild ownership'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'guildId',
              placeholder: 'Enter your discord guild Id',
              value: provider?.claimValues?.guildId,
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
              !provider?.claimValues?.guildId ||
              provider?.claimValues?.guildId === ''
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
    credentialType: 'DiscordGuildMember',
    entity: 'Discord Guild Member',
    icon: <Discord />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/discord-white.png',
    verificationUrl:
      process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Discord guild membership',
          description:
            'The Krebit Verification Node issues this discord guild membership Credential',
          icon: <Discord />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/discord'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify discord guild membership',
        type: 'credential',
        metadata: {
          title: 'Verify discord guild membership',
          description: 'Claim your discord guild membership'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          fields: [
            {
              name: 'guildId',
              placeholder: 'Enter the discord guild Id',
              value: provider?.claimValues?.guildId,
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
              !provider?.claimValues?.guildId ||
              provider?.claimValues?.guildId === ''
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
    credentialType: 'GithubOrgMember',
    entity: 'Github Organization Member',
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
          title: 'Github organization member',
          description:
            'The Krebit Verification Node issues this github organization member Credential',
          icon: <Github />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/github'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Verify github organization member',
        type: 'credential',
        metadata: {
          title: 'Verify github organization member',
          description: 'Claim that you are a github organization member'
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
              name: 'organization',
              placeholder: 'Enter the github organization',
              value: provider?.claimValues?.organization,
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
    credentialType: 'Review',
    entity: 'Review',
    icon: <Star />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/none'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Review by other member',
          description: 'Review Credential issued by other member',
          icon: <Star />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/none'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Add credential to my passport',
        type: 'add',
        metadata: {
          title: 'Add Review to my passport',
          description: 'Add this review to my passport'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams,
          walletInformation: IWalletInformation
        ) => ({
          action: {
            text: 'Add',
            method: async () =>
              await provider.handleAddCredential(
                provider?.currentCredential || credential?.credential
              ),
            isDisabled: !Boolean(
              walletInformation?.address?.toLowerCase() !==
                credential?.credential?.issuer?.ethereumAddress &&
                walletInformation?.address?.toLowerCase() ==
                  credential?.credential?.credentialSubject?.ethereumAddress
            )
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
    credentialType: 'Deal',
    entity: 'Deal',
    icon: <Star />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmchEeUb98p5EpjdGocCc2fxLUziA29vBiRhoeQtzubj4c/github-white.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/none'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Deal proposed by Seller',
          description: 'Deal terms proposed by seller',
          icon: <Star />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/none'),
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Accept deal and start payment',
        type: 'add',
        metadata: {
          title: 'Start Payment',
          description: 'Start escrow payment'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams,
          walletInformation: IWalletInformation
        ) => ({
          action: {
            text: 'Start Payment',
            method: async () =>
              await provider.handleAddCredential(
                provider?.currentCredential || credential?.credential
              ),
            isDisabled: !Boolean(
              walletInformation?.address?.toLowerCase() !==
                credential?.credential?.issuer?.ethereumAddress &&
                walletInformation?.address?.toLowerCase() ==
                  credential?.credential?.credentialSubject?.ethereumAddress
            )
          }
        })
      },
      {
        title: 'Release Payment',
        type: 'mint',
        metadata: {
          title: 'Release payment',
          description: 'Release escrow payment to seller'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams
        ) => ({
          action: {
            text: 'Release Payment',
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
    credentialType: 'Issuer',
    entity: 'Community Issued',
    icon: <Approval />,
    imageUrl:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY +
      '/ipfs/QmThGkNo3FcNrF3za1x5eqGpN99Dr9HXY6NkpQvMPArs8j/krebit-logo.png',
    verificationUrl: process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/issuer'),
    address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS,
    isDisabled: true,
    steps: [
      {
        title: 'Overview',
        type: 'overview',
        metadata: {
          title: 'Credential',
          description: 'Credential issued to you',
          icon: <Approval />,
          verificationUrl:
            process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/issuer'),
          imageUrl:
            process.env.NEXT_PUBLIC_IPFS_GATEWAY +
            '/ipfs/QmThGkNo3FcNrF3za1x5eqGpN99Dr9HXY6NkpQvMPArs8j/krebit-logo.png',
          did: process.env.NEXT_PUBLIC_ISSUER_DID || '',
          address: process.env.NEXT_PUBLIC_ISSUER_ADDRESS || '',
          price: '0'
        }
      },
      {
        title: 'Claim credential',
        type: 'credential',
        metadata: {
          title: 'Claim credential',
          description:
            'Claim credential and add to your passport. Only add your email if the credential was issued to your email addrress.'
        },
        form: (
          provider: any,
          credential: ICredential,
          currentVerify: IIssuerParams,
          walletInformation: IWalletInformation
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
            text: 'Claim',
            method: async () =>
              await provider.handleClaimCredential(
                provider?.currentCredential || credential?.credential
              ),
            isDisabled: !Boolean(
              walletInformation?.address?.toLowerCase() !==
                credential?.credential?.issuer?.ethereumAddress &&
                walletInformation?.address?.toLowerCase() !==
                  credential?.credential?.credentialSubject?.ethereumAddress
            )
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
          currentVerify: IIssuerParams,
          walletInformation: IWalletInformation
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
