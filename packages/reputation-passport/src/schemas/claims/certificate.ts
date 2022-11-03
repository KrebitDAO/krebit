export const certificate = {
  title: 'certificate',
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    imageUrl: { type: 'string' },
    entity: { type: 'string' },
    issuanceDate: { type: 'string' },
    expirationDate: { type: 'string' },
    skills: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          skillId: { type: 'string' },
          score: { type: 'number' }
        },
        required: ['skillId', 'score']
      }
    },
    proofs: { type: 'object' }
  },
  required: ['name', 'entity', 'issuanceDate', 'expirationDate'],
  additionalProperties: true
};
