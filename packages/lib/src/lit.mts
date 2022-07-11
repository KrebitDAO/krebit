import { ethers } from 'ethers';
//import LitJsSdk from 'lit-js-sdk'; //browser
import LitJsSdk from 'lit-js-sdk/build/index.node.js'; //node
import siwe from 'siwe';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';

import { krbToken } from './schemas/index.mjs';

const CHAIN = process.env.NEXT_PUBLIC_NETWORK;

export const AUTH_SIGNATURE_BODY =
  'I am creating an account to use Lit Protocol at {{timestamp}}';
const AUTH_SIGNATURE_DOMAIN = process.env.NEXT_PUBLIC_PUBLIC_URL;
const AUTH_SIGNATURE_ORIGIN = process.env.NEXT_PUBLIC_PUBLIC_URL;

/**
 * This function encodes into base 64.
 * it's useful for storing symkeys and files in ceramic
 * @param {Uint8Array} input a file or any data
 * @returns {string} returns a string of b64
 */
export const encodeb64 = (uintarray: any) => {
  const b64 = Buffer.from(uintarray).toString('base64');
  return b64;
};

/**
 * This function converts blobs to base 64.
 * for easier storage in ceramic
 * @param {Blob} blob what you'd like to encode
 * @returns {Promise<String>} returns a string of b64
 */
export const blobToBase64 = async (blob: Blob) => {
  const b64 = Buffer.from(await blob.arrayBuffer()).toString('base64');
  return b64;
};

/**
 * This function decodes from base 64.
 * it's useful for decrypting symkeys and files in ceramic
 * @param {blob} input a b64 string
 * @returns {string} returns the data as a string
 */
export const decodeb64 = (b64String: any) => {
  return new Uint8Array(Buffer.from(b64String, 'base64'));
};

export const getOwnsAddressConditions = (address: string): Array<any> => {
  return [
    {
      contractAddress: '',
      standardContractType: '',
      chain: CHAIN,
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: address
      }
    }
  ];
};

/**
 * Sign the auth message with the user's wallet, and store it in localStorage.  Called by checkAndSignAuthMessage if the user does not have a signature stored.
 * @param {Object} params
 * @param {ethers.Wallet} params.wallet An ethers.js wallet instance
 * @returns {AuthSig} The AuthSig created or retrieved
 */
export const signAuthMessage = async (
  wallet: ethers.Wallet,
  resources: Array<any> = []
): Promise<any> => {
  const now = new Date().toISOString();
  const statement = AUTH_SIGNATURE_BODY.replace('{{timestamp}}', now);
  const message = {
    domain: AUTH_SIGNATURE_DOMAIN,
    address: wallet.address,
    statement,
    uri: AUTH_SIGNATURE_ORIGIN,
    version: '1',
    chainId: Number(krbToken[CHAIN].domain.chainId)
  };

  if (resources && resources.length > 0) {
    message['resources'] = resources;
  }
  const siweMessage = new siwe.SiweMessage(message);

  const messageToSign = siweMessage.prepareMessage();

  const signature = await wallet.signMessage(messageToSign);

  console.log('signature: ', signature);

  const recoveredAddress = ethers.utils.verifyMessage(messageToSign, signature);

  return {
    sig: signature,
    derivedVia: 'web3.eth.personal.sign',
    signedMessage: messageToSign,
    address: recoveredAddress
  };
};

const client = new LitJsSdk.LitNodeClient();

export class Lit {
  private static litNodeClient: any;
  static connect = async () => {
    await client.connect();
    this.litNodeClient = client;
  };

  /**
   * encrypts a message with Lit returns required details
   * this obfuscates data such that it can be stored on ceramic without
   * non-permissioned eyes seeing what the data is
   * @param {String} message the clear text you'd like encrypted
   * @param {Array<Object>} accessControlConditions the access control conditions that govern who is able to decrypt this data.  See the docs here for examples: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples
   * @param {Wallet} wallet
   * @param {String} accessControlConditionType the access control condition type you are using.  Pass `accessControlConditions` for traditional access control conditions.  This is the default if you don't pass anything.  Pass `evmContractConditions` for custom smart contract access control conditions
   * @returns {Promise<Array<any>>} returns, in this order: encryptedZipBase64, encryptedSymmetricKeyBase64, accessControlConditions, chain
   */

  static encrypt = async (
    message: String,
    accessControlConditions: Array<Object>,
    wallet: ethers.Wallet,
    accessControlConditionType: String = 'accessControlConditions'
  ): Promise<any> => {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await signAuthMessage(wallet);

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      message
    );

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: CHAIN,
      permanant: false
    });
    const encryptedStringBase64 = await blobToBase64(encryptedString);

    const encryptedSymmetricKeyBase64 = encodeb64(encryptedSymmetricKey);

    return {
      encryptedZip: encryptedStringBase64,
      symKey: encryptedSymmetricKeyBase64,
      accessControlConditions: accessControlConditions,
      chain: CHAIN,
      accessControlConditionType: accessControlConditionType
    };
  };

  /**
   * supports updating conditions by the creator of those conditions.
   * @param {Uint8Array} encryptedSymmKey symmetric key
   * @param {Array<Object>} accessControlConditions the access control conditions that govern who is able to decrypt this data.  See the docs here for examples: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples
   * @param {Wallet} wallet
   * @param {String} accessControlConditionType the access control condition type you are using.  Pass `accessControlConditions` for traditional access control conditions.  This is the default if you don't pass anything.  Pass `evmContractConditions` for custom smart contract access control conditions
   * @returns {Promise<Array<any>>} returns, in this order: encryptedZipBase64, encryptedSymmetricKeyBase64, accessControlConditions, chain
   */

  static updateConditions = async (
    symKey: Uint8Array,
    accessControlConditions: Array<Object>,
    wallet: ethers.Wallet,
    accessControlConditionType: String = 'accessControlConditions'
  ): Promise<any> => {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await signAuthMessage(wallet);

    const toDecrypt = uint8ArrayToString(decodeb64(symKey), 'base16');
    console.log('toDecrypt', toDecrypt);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      encryptedSymmetricKey: toDecrypt,
      authSig,
      chain: CHAIN,
      permanant: false
    });

    return encryptedSymmetricKey;
  };

  /**
   * decrypt encrypted zip and symmetric key using the lit protocol
   * @param {Uint8Array} encryptedZip encrypted data that will be converted into a string
   * @param {Uint8Array} encryptedSymmKey symmetric key
   * @param {Array<any>} accessControlConditions conditions that determine access
   * @param {Wallet} wallet
   * @param {String} accessControlConditionType the access control condition type you are using.  Pass `accessControlConditions` for traditional access control conditions.  This is the default if you don't pass anything.  Pass `evmContractConditions` for custom smart contract access control conditions
   * @returns {Promise<string>} promise with the decrypted string
   */
  static decrypt = async (
    encryptedString: Uint8Array,
    symKey: Uint8Array,
    accessControlConditions: Array<any>,
    wallet: ethers.Wallet,
    accessControlConditionType: String = 'accessControlConditions'
  ): Promise<string> => {
    if (!this.litNodeClient) {
      await this.connect();
    }

    console.log('encryptedString', encryptedString);
    const authSig = await signAuthMessage(wallet);

    const toDecrypt = uint8ArrayToString(decodeb64(symKey), 'base16');
    console.log('toDecrypt', toDecrypt);

    let decryptedSymmKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: toDecrypt,
      chain: CHAIN,
      authSig
    });
    console.log('decryptedSymKey', decryptedSymmKey);

    // decrypt the files
    const decryptedString = await LitJsSdk.decryptString(
      new Blob([decodeb64(encryptedString)]),
      decryptedSymmKey
    );
    return decryptedString;
  };
}

export default new Lit();
