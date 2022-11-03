export const legalName = {
  title: 'legalName',
  type: 'object',
  properties: {
    fullName: { type: 'string' },
    firstName: { type: 'string' },
    middleName: { type: 'string' },
    lastName: { type: 'string' },
    proofs: { type: 'object' }
  },
  required: ['fullName'],
  additionalProperties: false
};
