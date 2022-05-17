export const verifiableCredential = /* GraphQL */ `
  query VerifiableCredential($id: ID!) {
    verifiableCredential(id: $id) {
      id
      credentialStatus
    }
  }
`;
