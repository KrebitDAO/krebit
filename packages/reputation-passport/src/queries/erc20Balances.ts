export const erc20Balances = /* GraphQL */ `
  query Erc20Balances(
    $first: Int
    $orderBy: ERC20Balance_orderBy
    $orderDirection: OrderDirection
    $where: ERC20Balance_filter
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
