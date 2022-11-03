export const recommendation = {
  title: 'recommendation',
  type: 'object',
  properties: {
    description: { type: 'string' },
    entity: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
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
  required: ['description', 'entity'],
  additionalProperties: true
};
