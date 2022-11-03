export const digitalProperty = {
  title: 'digitalProperty',
  type: 'object',
  properties: {
    protocol: { type: 'string' },
    host: { type: 'string' },
    id: { type: 'string' },
    username: { type: 'string' },
    imageUrl: { type: 'string' },
    startDate: { type: 'string' },
    followers: { type: 'number' },
    favorites: { type: 'number' },
    posts: { type: 'number' },
    proofs: { type: 'object' }
  },
  required: ['protocol', 'host'],
  additionalProperties: true
};
