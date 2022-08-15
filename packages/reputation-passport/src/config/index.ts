export interface IConfigProps {
  network?: 'rinkeby' | 'mainnet';
  infuraUrl?: string;
  graphUrl?: string;
  ceramicUrl?: string;
  publicUrl?: string;
  providers?: {
    lit?: {
      sdk: any;
      client: any;
    };
  };
}

const DEFAULT_NETWORK = 'rinkeby' as 'rinkeby';
const initialConfig = {
  network: DEFAULT_NETWORK,
  infuraUrl: 'https://rinkeby.infura.io/v3/114f51211ffe430294ddfc842c5f3df9',
  graphUrl: 'https://api.thegraph.com/subgraphs/name/krebit/krb-token-v01',
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
    const { network = DEFAULT_NETWORK, providers } = props;

    if (network !== 'rinkeby' && network !== 'mainnet') {
      throw new Error('Network not valid');
    }

    const krebit = {
      network,
      providers
    };

    if (isNode) {
      global.krebit = krebit;
    } else {
      (window as any).krebit = krebit;
    }

    this.state = {
      ...this.state,
      network,
      providers
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
