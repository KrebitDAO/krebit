export const workExperience = {
  title: 'workExperience',
  type: 'object',
  properties: {
    title: { type: 'string' },
    entity: { type: 'string' },
    city: { type: 'string' },
    employmentType: { type: 'string' },
    imageUrl: { type: 'string' },
    description: { type: 'string' },
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
  required: ['title', 'entity'],
  additionalProperties: true
};
