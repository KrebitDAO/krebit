export const verifiableCredentials = /* GraphQL */ `
  query VerifiableCredentials(
    $first: Int
    $orderBy: VerifiableCredential_orderBy
    $orderDirection: OrderDirection
    $where: VerifiableCredential_filter
  ) {
    verifiableCredentials(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      _context
      _type
      claimId
      id
      credentialStatus
      issuer {
        id
        ethereumAddress
      }
      credentialSubject {
        id
        ethereumAddress
        _type
        typeSchema
        value
        encrypted
        trust
        stake
        nbf
        exp
      }
      credentialSchema {
        id
        _type
      }
      credentialSubjectDID
      credentialSubjectAddress
      issuanceDate
      expirationDate
      transaction
      reason
      disputedBy
    }
  }
`;
