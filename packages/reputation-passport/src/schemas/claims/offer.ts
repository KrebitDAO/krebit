export const offer = {
  title: 'offer',
  type: 'object',
  properties: {
    offerType: { type: 'string' },
    title: { type: 'string' },
    category: { type: 'string' },
    subcategories: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    requiredCredentialTypes: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    description: { type: 'string' },
    imageUrl: { type: 'string' },
    vendorUrl: { type: 'string' },
    deliverableType: { type: 'string' },
    deliverableDescription: { type: 'string' },
    deliveryTime: { type: 'string' },
    price: { type: 'string' },
    usTaxPayer: { type: 'boolean' },
    proofs: { type: 'object' }
  },
  required: ['offerType', 'title', 'price', 'usTaxPayer'],
  additionalProperties: true
};
