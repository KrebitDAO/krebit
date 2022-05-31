export const erc20Balance = /* GraphQL */ `
  query Erc20Balance($id: ID!) {
    erc20Balance(id: $id) {
      value
    }
  }
`;
