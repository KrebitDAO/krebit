export const credentialRegistry = /* GraphQL */ `
  query CredentialRegistry($id: ID!) {
    credentialRegistry(id: $id) {
      balance
      staked
      issued
      revoked
      deleted
      suspended
      disputed
      expired
    }
  }
`;
