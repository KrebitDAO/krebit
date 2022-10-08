export interface IConfigProps {
  network?: 'mumbai' | 'polygon' | 'goerli' | 'mainnet';
  rpcUrl?: string;
  graphUrl?: string;
  ensGraphUrl?: string;
  ceramicUrl?: string;
  publicUrl?: string;
  litSdk?: any;
  biconomyKey?: string;
}

const initialConfigTestnet = {
  network: 'mumbai',
  rpcUrl:
    'https://rpc-mumbai.maticvigil.com/v1/5de1e8fc6cabc2e7782450d3a1a2135b2710c50c',
  graphUrl: 'https://api.thegraph.com/subgraphs/name/krebit/krb-mumbai-v01',
  ensGraphUrl: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  ceramicUrl: 'https://ceramic-clay.3boxlabs.com',
  publicUrl: 'https://testnet.krebit.id',
  biconomyKey: 'XtWAXxY1v.afcf7601-39b1-4e0d-b930-1c00581e36f1'
};

const initialConfigMainnet = {
  network: 'polygon',
  rpcUrl:
    'https://rpc-mainnet.maticvigil.com/v1/5de1e8fc6cabc2e7782450d3a1a2135b2710c50c',
  graphUrl: 'https://api.thegraph.com/subgraphs/name/krebit/krb-matic-v1',
  ensGraphUrl: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  ceramicUrl: 'https://node1.orbis.club',
  publicUrl: 'https://krebit.id',
  biconomyKey: 'lMY3O7m6h.884dd5c0-9682-421c-817c-f9160c7cfd94'
};

const initialConfig =
  process.env.NEXT_PUBLIC_NETWORK === 'polygon' ||
  process.env.SERVER_NETWORK === 'polygon'
    ? initialConfigMainnet
    : initialConfigTestnet;

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
