export const erc20Contract = /* GraphQL */ `
  query Erc20Contract(
    $id: ID!
    $orderBy: VerifiableCredential_orderBy
    $orderDirection: OrderDirection
    $where: VerifiableCredential_filter
  ) {
    erc20Contract(id: $id) {
      transfers(
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: $where
      ) {
        from {
          id
        }
        to {
          id
        }
        transaction {
          id
        }
        value
      }
    }
  }
`;
