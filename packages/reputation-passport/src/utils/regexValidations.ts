import { config } from '../config/index.js';
import krbTokenSchema from '../schemas/krbToken.json' assert { type: 'json' };

const currentConfig = config.get();

const address = '0x[a-fA-F0-9]{40}';
const ens = 'eth$';

export const regexValidations = {
  address,
  ens
};
