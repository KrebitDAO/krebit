import { Issuer as krebit, ReputationPassport} from "@krebitdao/reputation-passport";

I. As an issuer of reputation credentials I want:

- authenticateDID(ceramic, wallet, ethProvider)
- krebit.addTypeSchema(type, schema)
- typeShema = krebit.getTypeShema(type)
- krebit.verifyCredential(address | did, claimedCredential) -> checks the signature
- verification = krebit.issue(address | did, claim, typeShema) //sign
- verifications [] = krebit.batchIssue (addresses[] | dids[], claims[], types[]) //batch sign
- krebit.revoke(verification)
- krebit.suspend(verification)
- krebit.expire(verification)
- verifications [] = krebit.getIssued()
- {delegateCredential , listId } = krebit.delegate(issuerAddress | issuerDid, addresses[] | dids[]) //Delegate power to another issuer for a dynamic list of users

II. As a user I want:

- authenticateDID(ceramic, wallet, ethProvider)
- passport = getPassport(address | did)

- claimedCredential = krebit.issue(passport, claim, typeShema) // self-signed claim
- passport.saveClaim(claimedCredential) // claimedCredentials in ceramic
- claimedCredentials[] = passport.getClaims(type) // claimedCredentials from ceramic
- credentials[] = passport.getCredentials() // heldCredentials from ceramic

- verifications[] = passport.getVerifications(type | filter) // registeredCredentials from subgraph
- passport.saveCredential(verification) // heldCredentials in ceramic
- verificationId = passport.registerVerification(verification) // on-chain (claim KRB reputation)
- passport.checkStatus(verification) //from subgraph : revoked, expired, suspended, disputed
- passport.getNFT(verificationId) // on-chain (claim NFT for the verificationId)

III. As a checker of _public_ reputation credentials I want:

- // no need to authenticate
- getPassport(address | did)
- credentials[] = passport.getCredentials() // heldCredentials from ceramic
- krebit.verifyCredential(address | did, claimedCredential) -> checks the signature
- verifications[] = passport.getVerifications(type | filter) // registeredCredentials from subgraph
- passport.checkStatus(verification) //from subgraph : revoked, expired, suspended, disputed

IV. As a checker of _private_ reputation credentials I want:

- authenticateDID(ceramic, wallet, ethProvider)
- passport.verifyClaim(verification, claim) -> to get access to private data

verification == stamp
