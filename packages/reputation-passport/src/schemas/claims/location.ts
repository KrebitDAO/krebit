export const location = {
  title: 'location',
  type: 'object',
  properties: {
    country: { type: 'string' },
    city: { type: 'string' },
    postalCode: { type: 'string' },
    fullAddress: { type: 'string' },
    latitude: { type: 'string' },
    longitude: { type: 'string' },
    proofs: { type: 'object' }
  },
  required: ['country', 'city'],
  additionalProperties: false
};
