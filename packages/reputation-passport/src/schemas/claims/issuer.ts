export const issuer = {
  title: 'issuer',
  type: 'object',
  properties: {
    did: { type: 'string' },
    ethereumAddress: { type: 'string' },
    entity: { type: 'string' },
    description: { type: 'string' },
    imageUrl: { type: 'string' },
    verificationUrl: { type: 'string' },
    credentialType: { type: 'string' },
    credentialSchema: { type: 'string' },
    credentialSubjectListUrl: { type: 'string' },
    price: { type: 'number' },
    expirationMonths: { type: 'number' },
    proofs: { type: 'object' }
  },
  required: ['did', 'credentialType'],
  additionalProperties: true
};
