import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

import { schemas } from '@krebitdao/reputation-passport/dist/schemas';
import { AUTH_SIGNATURE_BODY } from '@krebitdao/reputation-passport/dist/lib/lit';
import {
  config as currentConfig,
  IConfigProps
} from '@krebitdao/reputation-passport/dist/config';

interface ISignAuthMessageProps {
  wallet: ethers.Signer;
  resources?: Array<any>;
  config?: IConfigProps;
}

export const signAuthMessage = async (props: ISignAuthMessageProps) => {
  const { wallet, resources = [], config = currentConfig.state } = props;

  const now = new Date().toISOString();
  const statement = AUTH_SIGNATURE_BODY.replace('{{timestamp}}', now);
  const message = {
    domain: config.publicUrl.replace('https://', '').replace('http://', ''),
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

  return authSig;
};
