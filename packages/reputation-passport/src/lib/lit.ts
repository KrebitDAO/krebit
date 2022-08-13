import { ethers } from 'ethers';
import siwe from 'siwe';

import { config } from '../config';
import { krbToken } from '../schemas';
import { base64 } from '../utils';

export const AUTH_SIGNATURE_BODY =
  'I am creating an account to use Lit Protocol at {{timestamp}}';

const { NETWORK: CHAIN, PUBLIC_URL } = config;

const signAuthMessage = async (
  wallet: ethers.Signer,
  resources: Array<any> = []
) => {
  const now = new Date().toISOString();
  const statement = AUTH_SIGNATURE_BODY.replace('{{timestamp}}', now);
  const message = {
    domain: PUBLIC_URL,
    address: await wallet.getAddress(),
    statement,
    uri: PUBLIC_URL,
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

export class Lit {
  private litSdk;
  private litClient;

  constructor(sdk, client) {
    this.litSdk = sdk;
    this.litClient = client;
  }

  private connect = async () => {
    await this.litClient.connect();
  };

  public getOwnsAddressConditions = (address: string) => {
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

  public encrypt = async (
    message: String,
    accessControlConditions: Array<Object>,
    wallet: ethers.Signer
  ) => {
    if (!this.litClient) {
      await this.connect();
    }

    const authSig = await signAuthMessage(wallet);

    const { encryptedString, symmetricKey } = await this.litSdk.encryptString(
      message
    );

    const encryptedStringBase64 = await base64.blobToBase64(encryptedString);
    const encryptedSymmetricKey = await this.litClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: CHAIN,
      permanant: false
    });

    return {
      encryptedString: encryptedStringBase64,
      encryptedSymmetricKey: this.litSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16'
      ),
      accessControlConditions: accessControlConditions,
      chain: CHAIN
    };
  };

  public updateConditions = async (
    encryptedSymmetricKey: string,
    newAccessControlConditions: Array<Object>,
    wallet: ethers.Signer
  ) => {
    if (!this.litClient) {
      await this.connect();
    }

    const authSig = await signAuthMessage(wallet);

    const newEncryptedSymmetricKey = await this.litClient.saveEncryptionKey({
      accessControlConditions: newAccessControlConditions,
      encryptedSymmetricKey: base64.decodeb64(encryptedSymmetricKey),
      authSig,
      chain: CHAIN,
      permanant: false
    });

    return this.litSdk.uint8arrayToString(newEncryptedSymmetricKey, 'base16');
  };

  public decrypt = async (
    encryptedString: string,
    encryptedSymmetricKey: string,
    accessControlConditions: Array<Object>,
    wallet: ethers.Signer
  ): Promise<string> => {
    if (!this.litClient) {
      await this.connect();
    }

    const authSig = await signAuthMessage(wallet);

    const decryptedSymmKey = await this.litClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      authSig,
      chain: CHAIN
    });

    const decryptedString = await this.litSdk.decryptString(
      new Blob([base64.decodeb64(encryptedString)]),
      decryptedSymmKey
    );

    return decryptedString;
  };
}

export const litProvider = async () => {
  let litSdk;

  if (typeof process !== 'undefined') {
    litSdk = await import('lit-js-sdk/build/index.node.js');
  } else {
    litSdk = await import('lit-js-sdk');
  }

  const litClient = new litSdk.default.LitNodeClient();
  await litClient.connect();

  return new Lit(litSdk.default, litClient);
};
