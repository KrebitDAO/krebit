import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import localStore from 'store2';

import { schemas } from '../schemas/index.js';
import { utils } from '../utils/index.js';
import { config, IConfigProps } from '../config/index.js';

interface ISignAuthMessageProps {
  wallet: ethers.Signer;
  resources?: Array<any>;
  config: IConfigProps;
}

export const AUTH_SIGNATURE_BODY =
  'I am creating an account to use the private features of Krebit at {{timestamp}}';

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
    chainId: Number(schemas.krbToken[config.network].domain.chainId)
  };

  if (resources && resources.length > 0) {
    message['resources'] = resources;
  }

  const siweMessage = new SiweMessage(message);

  const messageToSign = siweMessage.prepareMessage();

  const signature = await wallet.signMessage(messageToSign);

  console.log('signature: ', signature);

  const recoveredAddress = ethers.utils.verifyMessage(messageToSign, signature);

  const authSig = {
    sig: signature,
    derivedVia: 'web3.eth.personal.sign',
    signedMessage: messageToSign,
    address: recoveredAddress
  };
  localStore.set('lit-auth-signature', authSig);
  return authSig;
};

export function canonicalAccessControlConditionFormatter(cond) {
  // need to return in the exact format below:
  /*
  pub struct JsonAccessControlCondition {
    pub contract_address: String,
    pub chain: String,
    pub standard_contract_type: String,
    pub method: String,
    pub parameters: Vec<String>,
    pub return_value_test: JsonReturnValueTest,
  }
  */

  if (Array.isArray(cond)) {
    return cond.map(c => canonicalAccessControlConditionFormatter(c));
  }

  if ('operator' in cond) {
    return {
      operator: cond.operator
    };
  }

  if ('returnValueTest' in cond) {
    return {
      contractAddress: cond.contractAddress,
      chain: cond.chain,
      standardContractType: cond.standardContractType,
      method: cond.method,
      parameters: cond.parameters,
      returnValueTest: {
        comparator: cond.returnValueTest.comparator,
        value: cond.returnValueTest.value
      }
    };
  }

  throw new Error(`invalid access control condition: ${cond}`);
}

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

  public getOwnsAddressCondition = (address: string): Array<any> => {
    return [
      {
        conditionType: 'evmBasic',
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

  public getShareWithCondition = (address: string): Array<any> => {
    return [
      {
        operator: 'or'
      },
      {
        conditionType: 'evmBasic',
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
    try {
      if (!this.litNodeClient) {
        await this.connect();
      }

      let authSig = localStore.get('lit-auth-signature');
      if (!authSig || authSig === 'undefined') {
        console.log('signing auth message because sig is not in local storage');
        await signAuthMessage({
          wallet,
          config: this.currentConfig
        });
        authSig = localStore.get('lit-auth-signature');
      }

      const { encryptedString, symmetricKey } = await this.litSdk.encryptString(
        message
      );

      const encryptedStringBase64 = await utils.base64.blobToBase64(
        encryptedString
      );
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
        unifiedAccessControlConditions: accessControlConditions,
        chain: this.currentConfig.network
      };
    } catch (error) {
      console.error('Encrypt error', error);
    }
  };

  public updateConditions = async (
    encryptedSymmetricKey: string,
    newAccessControlConditions: Array<Object>,
    wallet: ethers.Signer
  ) => {
    if (!this.litNodeClient) {
      await this.connect();
    }

    let authSig = localStore.get('lit-auth-signature');
    if (!authSig || authSig === 'undefined') {
      console.log('signing auth message because sig is not in local storage');
      await signAuthMessage({
        wallet,
        config: this.currentConfig
      });
      authSig = localStore.get('lit-auth-signature');
    }
    authSig = JSON.parse(authSig);

    const conds = newAccessControlConditions.map(c =>
      canonicalAccessControlConditionFormatter(c)
    );
    const newEncryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey(
      {
        accessControlConditions: conds,
        encryptedSymmetricKey: utils.base64.decodeb64(encryptedSymmetricKey),
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

    let authSig = localStore.get('lit-auth-signature');
    if (!authSig || authSig === 'undefined') {
      console.log('signing auth message because sig is not in local storage');
      await signAuthMessage({
        wallet,
        config: this.currentConfig
      });
      authSig = localStore.get('lit-auth-signature');
    }

    const conds = accessControlConditions.map(c =>
      canonicalAccessControlConditionFormatter(c)
    );

    const decryptedSymmKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: conds,
      toDecrypt: encryptedSymmetricKey,
      authSig,
      chain: this.currentConfig.network
    });

    const decryptedString = await this.litSdk.decryptString(
      new Blob([utils.base64.decodeb64(encryptedString)]),
      decryptedSymmKey
    );

    return decryptedString;
  };
}
