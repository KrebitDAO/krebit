import { ethers } from 'ethers';

import { schemas } from '../schemas/index.js';

export class WalletProvider extends ethers.providers.JsonRpcProvider {
  _wallet: ethers.Wallet;
  networkish: ethers.providers.Networkish;

  constructor(
    url: string | ethers.utils.ConnectionInfo,
    network: ethers.providers.Networkish
  ) {
    super(url);
    this.networkish = network;
  }

  setWallet(wallet: ethers.Wallet) {
    this._wallet = wallet;
  }

  send = async (method: any, params: any) => {
    if (method == 'personal_sign' || method.method == 'personal_sign') {
      const signature = await this._wallet.signMessage(
        method.params[0].startsWith('0x')
          ? ethers.utils.arrayify(method.params[0])
          : method.params[0]
      );

      params(null, { result: signature });
    } else if (method == 'eth_sign' || method.method == 'eth_sign') {
      const signature = await this._wallet.signMessage(
        ethers.utils.arrayify(params[1])
      );

      return signature;
    } else if (method == 'eth_accounts' || method.method == 'eth_accounts') {
      return [await this._wallet.getAddress()];
    } else if (method == 'eth_chainId' || method.method == 'eth_chainId') {
      params(null, {
        result: `0x${Number(
          schemas.krebitEscrow[this.networkish.toString()].domain.chainId
        ).toString(16)}`
      });
    } else {
      if (method.method && typeof params === 'function') {
        params(null, await super.send(method.method, method.params));
      } else {
        return await super.send(method, params);
      }
    }
  };
}
