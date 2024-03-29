export const phoneNumber = {
  title: 'phoneNumber',
  type: 'object',
  properties: {
    country: { type: 'string' },
    countryCode: { type: 'number' },
    number: { type: 'number' },
    proofs: { type: 'object' }
  },
  required: ['countryCode', 'number'],
  additionalProperties: false
};
