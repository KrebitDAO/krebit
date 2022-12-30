export const exploreAccounts = /* GraphQL */ `
  query ExploreAccounts($skip: Int, $first: Int, $where: Account_filter) {
    accounts(skip: $skip, first: $first, where: $where) {
      id
      ERC20balances {
        value
      }
      VerifiableCredentials {
        _type
      }
    }
  }
`;
