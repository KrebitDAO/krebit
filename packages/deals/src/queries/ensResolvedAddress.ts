export const ensResolvedAddress = /* GraphQL */ `
  query Domains(
    $name: Int
    $orderBy: Domain_orderBy
    $orderDirection: OrderDirection
    $where: Domain_filter
  ) {
    domains(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      name
      resolvedAddress {
        id
      }
    }
  }
`;
