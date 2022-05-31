export const erc20Balances = /* GraphQL */ `
  query Erc20Balances(
    $first: Int
    $orderBy: VerifiableCredential_orderBy
    $orderDirection: OrderDirection
    $where: VerifiableCredential_filter
  ) {
    erc20Balances(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      account {
        id
      }
      value
    }
  }
`;
