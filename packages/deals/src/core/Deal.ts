import { ethers } from 'ethers';
import { Biconomy } from '@biconomy/mexa';
import {
  W3CCredential,
  EIP712VerifiableCredential,
  getEIP712Credential,
  getKrebitCredentialTypes
} from '@krebitdao/eip712-vc';

import { lib } from '../lib/index.js';
import { utils } from '../utils/index.js';
import { schemas } from '../schemas/index.js';
import { config, IConfigProps } from '../config/index.js';

interface IProps extends IConfigProps {
  wallet: ethers.Signer;
  ethProvider: ethers.providers.Provider | ethers.providers.ExternalProvider;
  address: string;
}

const getEIP712CredentialFromStamp = (stamp: any) =>
  ({
    ...stamp,
    id: stamp.claimId,
    credentialSubject: {
      ...stamp.credentialSubject,
      id: stamp.credentialSubjectDID,
      stake: Number(stamp.credentialSubject.stake),
      nbf: Number(stamp.credentialSubject.nbf),
      exp: Number(stamp.credentialSubject.exp)
    }
  } as EIP712VerifiableCredential);

export class Deal {
  public address: string;
  public escrowContract: any;
  public wallet: ethers.Signer;
  public ethProvider:
    | ethers.providers.Provider
    | ethers.providers.ExternalProvider;
  private currentConfig: IConfigProps;

  constructor(props?: IProps) {
    const currentConfig = config.update(props);
    this.currentConfig = currentConfig;

    this.address = props.address.toLocaleLowerCase();
    this.ethProvider = props.ethProvider;
    this.wallet = props.wallet;
    this.escrowContract = new ethers.Contract(
      schemas.krebitEscrow[this.currentConfig.network].address,
      schemas.krebitEscrow.abi,
      props.wallet
    );
  }

  // Buyer createEscrow
  createDealFromStamp = async (
    referralStamp: any,
    dealCredential: W3CCredential
  ) => {
    const referralEip712credential =
      getEIP712CredentialFromStamp(referralStamp);
    const dealEip712credential = getEIP712Credential(dealCredential);
    const tx = await this.escrowContract.createEscrow(
      referralEip712credential,
      dealEip712credential,
      dealCredential.proof.proofValue,
      {
        from: this.address,
        value: dealCredential.credentialSubject.price.toString(),
        gasLimit: 5000000
      }
    );
    console.log('createEscrow Tx: ', tx);
    return tx.hash;
  };

  // Buyer createEscrow
  createDeal = async (
    referralCredential: W3CCredential,
    dealCredential: W3CCredential
  ) => {
    const referralEip712credential = getEIP712Credential(referralCredential);
    const dealEip712credential = getEIP712Credential(dealCredential);
    const tx = await this.escrowContract.createEscrow(
      referralEip712credential,
      dealEip712credential,
      dealCredential.proof.proofValue,
      {
        from: this.address,
        value: dealCredential.credentialSubject.price.toString(),
        gasLimit: 5000000
      }
    );
    console.log('createEscrow Tx: ', tx);
    return tx.hash;
  };

  //from the contract? or graph? : None, Created, Delivered, BuyerCanceled, SellerCanceled, Released, DisputeResolved
  checkStatus = async (dealCredential: W3CCredential) => {
    const dealEip712credential = getEIP712Credential(dealCredential);
    return await this.escrowContract.getDealStatus(dealEip712credential);
  };

  //on-chain
  markDelivered = async (dealCredential: W3CCredential) => {
    const dealEip712credential = getEIP712Credential(dealCredential);
    const tx = await this.escrowContract.disableBuyerCancel(
      dealEip712credential,
      {
        value: ethers.constants.Zero.toString(),
        from: this.address
      }
    );
    console.log('disableBuyerCancel Tx: ', tx);
    return tx.hash;
  };

  //on-chain
  buyerCancel = async (referralStamp: any, dealCredential: W3CCredential) => {
    const referralEip712credential =
      getEIP712CredentialFromStamp(referralStamp);
    const dealEip712credential = getEIP712Credential(dealCredential);

    const tx = await this.escrowContract.buyerCancel(
      referralEip712credential,
      dealEip712credential,
      {
        value: ethers.constants.Zero.toString(),
        from: this.address
      }
    );
    console.log('buyerCancel Tx: ', tx);
    return tx.hash;
  };

  //on-chain
  sellerCancel = async (referralStamp: any, dealCredential: W3CCredential) => {
    const referralEip712credential =
      getEIP712CredentialFromStamp(referralStamp);
    const dealEip712credential = getEIP712Credential(dealCredential);

    const tx = await this.escrowContract.sellerCancel(
      referralEip712credential,
      dealEip712credential,
      {
        value: ethers.constants.Zero.toString(),
        from: this.address
      }
    );
    console.log('sellerCancel Tx: ', tx);
    return tx.hash;
  };

  //on-chain
  releaseDeal = async (referralStamp: any, dealCredential: W3CCredential) => {
    const referralEip712credential =
      getEIP712CredentialFromStamp(referralStamp);
    const dealEip712credential = getEIP712Credential(dealCredential);

    const tx = await this.escrowContract.release(
      referralEip712credential,
      dealEip712credential,
      {
        value: ethers.constants.Zero.toString(),
        from: this.address
      }
    );
    console.log('buyerCancel Tx: ', tx);
    return tx.hash;
  };

  // Pending payments
  paymentsBalance = async () => {
    const balance = await this.escrowContract.payments(this.address);
    return balance;
  };

  // Withdraw Pending payments
  withdrawPayments = async () => {
    const tx = await this.escrowContract.withdrawPayments(this.address, {
      value: ethers.constants.Zero.toString(),
      from: this.address
    });
    console.log('withdrawPayments Tx: ', tx);
    return tx.hash;
  };
}
