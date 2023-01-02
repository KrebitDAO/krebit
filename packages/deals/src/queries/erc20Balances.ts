export const erc20Balances = /* GraphQL */ `
  query Erc20Balances(
    $first: Int
    $skip: Int
    $orderBy: ERC20Balance_orderBy
    $orderDirection: OrderDirection
    $where: ERC20Balance_filter
  ) {
    erc20Balances(
      first: $first
      skip: $skip
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
