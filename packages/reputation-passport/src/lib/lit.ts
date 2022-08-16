import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

import { krbToken } from '../schemas';
import { base64 } from '../utils';
import { config, IConfigProps } from '../config';

interface ISignAuthMessageProps {
  wallet: ethers.Signer;
  resources?: Array<any>;
  config: IConfigProps;
}

export const AUTH_SIGNATURE_BODY =
  'I am creating an account to use Lit Protocol at {{timestamp}}';

const signAuthMessage = async (props: ISignAuthMessageProps) => {
  const { wallet, resources = [], config } = props;

  const now = new Date().toISOString();
  const statement = AUTH_SIGNATURE_BODY.replace('{{timestamp}}', now);
  const message = {
    domain: config.publicUrl,
    address: await wallet.getAddress(),
    statement,
    uri: config.publicUrl,
    version: '1',
    chainId: Number(krbToken[config.network].domain.chainId)
  };

  if (resources && resources.length > 0) {
    message['resources'] = resources;
  }

  const siweMessage = new SiweMessage(message);

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
  private litNodeClient;
  private currentConfig: IConfigProps;

  constructor() {
    const currentConfig = config.get();
    this.currentConfig = currentConfig;
  }

  private connect = async () => {
    this.litSdk = this.currentConfig.litSdk;
    this.litNodeClient = new this.litSdk.LitNodeClient();
    await this.litNodeClient.connect();
  };

  public getOwnsAddressConditions = (address: string) => {
    return [
      {
        contractAddress: '',
        standardContractType: '',
        chain: this.currentConfig.network,
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

    const authSig = await signAuthMessage({
      wallet,
      config: this.currentConfig
    });

    const { encryptedString, symmetricKey } = await this.litSdk.encryptString(
      message
    );

    const encryptedStringBase64 = await base64.blobToBase64(encryptedString);
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: this.currentConfig.network,
      permanant: false
    });

    return {
      encryptedString: encryptedStringBase64,
      encryptedSymmetricKey: this.litSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16'
      ),
      accessControlConditions: accessControlConditions,
      chain: this.currentConfig.network
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

    const authSig = await signAuthMessage({
      wallet,
      config: this.currentConfig
    });

    const newEncryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey(
      {
        accessControlConditions: newAccessControlConditions,
        encryptedSymmetricKey: base64.decodeb64(encryptedSymmetricKey),
        authSig,
        chain: this.currentConfig.network,
        permanant: false
      }
    );

    return this.litSdk.uint8arrayToString(newEncryptedSymmetricKey, 'base16');
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

    const authSig = await signAuthMessage({
      wallet,
      config: this.currentConfig
    });

    const decryptedSymmKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      authSig,
      chain: this.currentConfig.network
    });

    const decryptedString = await this.litSdk.decryptString(
      new Blob([base64.decodeb64(encryptedString)]),
      decryptedSymmKey
    );

    return decryptedString;
  };
}
