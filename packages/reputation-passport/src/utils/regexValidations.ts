import { config } from '../config';
import krbTokenSchema from '../schemas/krbToken.json' assert { type: 'json' };

const currentConfig = config.get();

const address = '0x[a-fA-F0-9]{40}';
const ens = 'eth$';
const did = `did:pkh:eip155:${
  krbTokenSchema[currentConfig.network]?.domain?.chainId
}:${address}`;

export const regexValidations = {
  address,
  ens,
  did
};
