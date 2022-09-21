export const ensDomains = /* GraphQL */ `
  query Account($id: ID!) {
    account(id: $id) {
      domains(first: 1) {
        name
      }
    }
  }
`;
