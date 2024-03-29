export const governmentId = {
  title: 'governmentId',
  type: 'object',
  properties: {
    type: { type: 'string' },
    country: { type: 'string' },
    number: { type: 'string' },
    issuanceDate: { type: 'string' },
    expirationDate: { type: 'string' },
    proofs: { type: 'object' }
  },
  required: ['country', 'number'],
  additionalProperties: false
};
