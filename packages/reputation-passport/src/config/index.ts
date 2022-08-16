export interface IConfigProps {
  network?: 'mumbai' | 'polygon' | 'goerli' | 'mainnet' | 'xdai';
  rpcUrl?: string;
  graphUrl?: string;
  ceramicUrl?: string;
  publicUrl?: string;
  litSdk?: any;
}

const initialConfig = {
  network: 'mumbai',
  rpcUrl:
    'https://rpc-mumbai.maticvigil.com/v1/5de1e8fc6cabc2e7782450d3a1a2135b2710c50c',
  graphUrl: 'https://api.thegraph.com/subgraphs/name/krebit/krb-mumbai-v01',
  ceramicUrl: 'https://ceramic-clay.3boxlabs.com',
  publicUrl: 'https://testnet.krebit.id'
};

const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

export const config = {
  state: initialConfig,
  update(props: IConfigProps) {
    if (isNode) {
      global.krebit = props;
    } else {
      (window as any).krebit = props;
    }

    this.state = {
      ...this.state,
      ...props
    };

    return this.state;
  },
  get() {
    let krebit = {};

    if (isNode) {
      krebit = global.krebit;
    } else {
      krebit = (window as any).krebit;
    }

    return {
      ...this.state,
      ...krebit
    };
  }
};
