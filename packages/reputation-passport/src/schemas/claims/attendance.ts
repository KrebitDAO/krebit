export const attendance = {
  title: 'attendance',
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    imageUrl: { type: 'string' },
    entity: { type: 'string' },
    country: { type: 'string' },
    city: { type: 'string' },
    virtual: { type: 'boolean' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    proofs: { type: 'object' }
  },
  required: ['name', 'entity', 'startDate', 'virtual'],
  additionalProperties: true
};
