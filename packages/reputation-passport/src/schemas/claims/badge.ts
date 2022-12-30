export const badge = {
  title: 'badge',
  type: 'object',
  properties: {
    entity: { type: 'string' },
    username: { type: 'string' },
    name: { type: 'string' },
    startDate: { type: 'string' },
    role: { type: 'string' },
    level: { type: 'string' },
    imageUrl: { type: 'string' },
    description: { type: 'string' },
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
    xp: { type: 'integer' },
    proofs: { type: 'object' }
  },
  required: ['entity', 'name'],
  additionalProperties: true
};
