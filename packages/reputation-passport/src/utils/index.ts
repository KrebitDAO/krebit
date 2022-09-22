import { WalletProvider } from './WalletProvider';
import {
  issueCredential,
  validateSchema,
  ClaimProps,
  hashClaimValue,
} from './issueCredential';
import { base64 } from './base64';
import { regexValidations } from './regexValidations';

export {
  WalletProvider,
  issueCredential,
  validateSchema,
  base64,
  hashClaimValue,
  regexValidations,
};
export type { ClaimProps };
