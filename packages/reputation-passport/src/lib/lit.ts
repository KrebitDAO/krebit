import { ethers } from 'ethers';
import LitJsSdk from 'lit-js-sdk';
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

const client = new LitJsSdk.LitNodeClient();

export class Lit {
  private litNodeClient;

  private connect = async () => {
    await client.connect();
    this.litNodeClient = client;
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
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await signAuthMessage(wallet);

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      message
    );

    const encryptedStringBase64 = await base64.blobToBase64(encryptedString);
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: CHAIN,
      permanant: false
    });

    return {
      encryptedString: encryptedStringBase64,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
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
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await signAuthMessage(wallet);

    const newEncryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey(
      {
        accessControlConditions: newAccessControlConditions,
        encryptedSymmetricKey: base64.decodeb64(encryptedSymmetricKey),
        authSig,
        chain: CHAIN,
        permanant: false
      }
    );

    return LitJsSdk.uint8arrayToString(newEncryptedSymmetricKey, 'base16');
  };

  public decrypt = async (
    encryptedString: string,
    encryptedSymmetricKey: string,
    accessControlConditions: Array<Object>,
    wallet: ethers.Signer
  ): Promise<string> => {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await signAuthMessage(wallet);

    const decryptedSymmKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      authSig,
      chain: CHAIN
    });

    const decryptedString = await LitJsSdk.decryptString(
      new Blob([base64.decodeb64(encryptedString)]),
      decryptedSymmKey
    );

    return decryptedString;
  };
}
