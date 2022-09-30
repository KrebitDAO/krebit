import { datamodel } from './datamodel.js';
import encodedModel from './encodedModel.json' assert { type: 'json' };
import krbToken from './krbToken.json' assert { type: 'json' };
import { claims } from './claims/index.js';
import { orbis } from './orbis.js';

export const schemas = {
  datamodel,
  encodedModel,
  krbToken,
  claims,
  orbis
};
