import { WalletProvider } from './WalletProvider.js';
import {
  issueCredential,
  getCredentialToSign,
  validateSchema,
  ClaimProps,
  hashClaimValue
} from './issueCredential.js';
import { base64 } from './base64.js';
import { regexValidations } from './regexValidations.js';
import { mergeArray } from './mergeArray.js';

export const utils = {
  WalletProvider,
  issueCredential,
  getCredentialToSign,
  validateSchema,
  base64,
  hashClaimValue,
  regexValidations,
  mergeArray
};
export type { ClaimProps };
