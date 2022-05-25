export const credentialRegistries = /* GraphQL */ `
  query CredentialRegistries(
    $first: Int
    $orderBy: VerifiableCredential_orderBy
    $orderDirection: OrderDirection
    $where: VerifiableCredential_filter
  ) {
    credentialRegistries(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      id
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
