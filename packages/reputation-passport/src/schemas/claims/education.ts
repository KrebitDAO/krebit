export const education = {
  title: 'education',
  type: 'object',
  properties: {
    name: { type: 'string' },
    level: { type: 'string' },
    description: { type: 'string' },
    imageUrl: { type: 'string' },
    entity: { type: 'string' },
    issuanceDate: { type: 'string' },
    hours: { type: 'string' },
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
  required: ['name', 'entity', 'hours', 'issuanceDate'],
  additionalProperties: true
};
