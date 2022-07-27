import { ethers } from 'ethers';
import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import siwe from 'siwe';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';

import { config } from '../config/index.mjs';
import { krbToken } from '../schemas/index.mjs';
import { base64 } from '../utils/base64.mjs';

export const AUTH_SIGNATURE_BODY =
  'I am creating an account to use Lit Protocol at {{timestamp}}';

const { NETWORK: CHAIN, PUBLIC_URL } = config;

const signAuthMessage = async (
  wallet: ethers.Wallet,
  resources: Array<any> = []
) => {
  const now = new Date().toISOString();
  const statement = AUTH_SIGNATURE_BODY.replace('{{timestamp}}', now);
  const message = {
    domain: PUBLIC_URL,
    address: wallet.address,
    statement,
    uri: PUBLIC_URL,
    version: '1',
    chainId: Number(krbToken[CHAIN].domain.chainId),
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
    address: recoveredAddress,
  };
};

const client = new LitJsSdk.LitNodeClient();

class Lit {
  private litNodeClient;

  private connect = async () => {
    await client.connect();
    this.litNodeClient = client;
  };

  public encrypt = async (
    message: String,
    accessControlConditions: Array<Object>,
    wallet: ethers.Wallet,
    accessControlConditionType: String = 'accessControlConditions'
  ) => {
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
      permanant: false,
    });
    const encryptedStringBase64 = await base64.blobToBase64(encryptedString);

    const encryptedSymmetricKeyBase64 = base64.encodeb64(encryptedSymmetricKey);

    return {
      encryptedZip: encryptedStringBase64,
      symKey: encryptedSymmetricKeyBase64,
      accessControlConditions: accessControlConditions,
      chain: CHAIN,
      accessControlConditionType: accessControlConditionType,
    };
  };

  public updateConditions = async (
    symKey: string,
    accessControlConditions: Array<Object>,
    wallet: ethers.Wallet
  ) => {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await signAuthMessage(wallet);

    const toDecrypt = uint8ArrayToString(base64.decodeb64(symKey));
    console.log('toDecrypt', toDecrypt);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      encryptedSymmetricKey: toDecrypt,
      authSig,
      chain: CHAIN,
      permanant: false,
    });

    return encryptedSymmetricKey;
  };

  public decrypt = async (
    encryptedString: string,
    symKey: string,
    accessControlConditions: Array<any>,
    wallet: ethers.Wallet
  ): Promise<string> => {
    if (!this.litNodeClient) {
      await this.connect();
    }

    console.log('encryptedString', encryptedString);
    const authSig = await signAuthMessage(wallet);

    const toDecrypt = uint8ArrayToString(base64.decodeb64(symKey));
    console.log('toDecrypt', toDecrypt);

    let decryptedSymmKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: toDecrypt,
      chain: CHAIN,
      authSig,
    });
    console.log('decryptedSymKey', decryptedSymmKey);

    const decryptedString = await LitJsSdk.decryptString(
      new Blob([base64.decodeb64(encryptedString)]),
      decryptedSymmKey
    );

    return decryptedString;
  };
}

export default Lit;
