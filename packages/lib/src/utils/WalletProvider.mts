import { ethers } from 'ethers';

type Wallet = { address: string } & ethers.Signer;

export class WalletProvider extends ethers.providers.JsonRpcProvider {
  _wallet: Wallet;

  constructor(
    url: string | ethers.utils.ConnectionInfo,
    network: ethers.providers.Networkish
  ) {
    super(url, network);
  }

  setWallet(wallet: Wallet) {
    this._wallet = wallet;
  }

  send = async (method: any, params: any) => {
    if (method.method == 'personal_sign') {
      const signature = await this._wallet.signMessage(
        ethers.utils.arrayify(method.params[0])
      );

      params(null, { result: signature });
    } else if (method == 'eth_sign') {
      const signature = await this._wallet.signMessage(
        ethers.utils.arrayify(params[1])
      );

      return signature;
    } else if (method == 'eth_accounts') {
      return [this._wallet.address];
    } else {
      if (method.method && typeof params === 'function') {
        params(null, await super.send(method.method, method.params));
      } else {
        return await super.send(method, params);
      }
    }
  };
}
