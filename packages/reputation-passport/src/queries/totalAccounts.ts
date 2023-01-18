export const totalAccounts = /* GraphQL */ `
  query TotalAccounts($skip: Int, $first: Int, $where: Account_filter) {
    accounts(skip: $skip, first: $first, where: $where) {
      id
    }
  }
`;
