import { WalletProvider } from './WalletProvider.js';
import {
  issueCredential,
  validateSchema,
  ClaimProps,
  hashClaimValue
} from './issueCredential.js';
import { base64 } from './base64.js';
import { regexValidations } from './regexValidations.js';

export const utils = {
  WalletProvider,
  issueCredential,
  validateSchema,
  base64,
  hashClaimValue,
  regexValidations
};
export type { ClaimProps };
