import krebit from '@krebitdao/reputation-passport';
import LitJsSdk from 'lit-js-sdk';

const IndexPage = () => {
  const getData = async () => {
    if (!window) return;
    const ethereum = (window as any).ethereum;

    if (!ethereum) return;

    const addresses = await ethereum.request({
      method: 'eth_requestAccounts'
    });
    const address = addresses[0];
    const ethProvider = await krebit.lib.ethereum.getWeb3Provider();
    const wallet = ethProvider.getSigner();

    const client = new LitJsSdk.LitNodeClient();
    const Issuer = new krebit.core.Krebit({
      providers: {
        lit: {
          sdk: LitJsSdk,
          client: client
        }
      }
    });
    const did = await Issuer.connect(wallet, ethProvider.provider, address);
    console.log(did);

    const questBadgeSchema = {
      type: 'object',
      properties: {
        communityId: { type: 'integer' },
        name: { type: 'string' },
        imageIPFS: { type: 'string' },
        description: { type: 'string' },
        skills: {
          type: 'array',
          properties: {
            skillId: { type: 'string' },
            score: { type: 'integer' }
          }
        },
        xp: { type: 'integer' }
      },
      required: ['communityId', 'name'],
      additionalProperties: false
    };
    console.log(
      'add type:',
      await Issuer.setTypeSchema('questBadge', questBadgeSchema)
    );

    console.log('Types:', await Issuer.getTypeSchema());

    console.log('Verifying questapp for address: ', address);
    console.log('Valid quest found in community: ', 1);
    const badgeValue = {
      communityId: 1,
      name: 'Community Badge Name',
      imageIPFS: 'ipfs://asdf',
      description: 'Badge for users that meet some criteria',
      skills: [{ skillId: 'participation', score: 100 }],
      xp: '1'
    };

    const expirationDate = new Date();
    const expiresYears = 1;
    expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
    console.log('expirationDate: ', expirationDate);

    const claim = {
      id: 'uri://badge-id',
      credentialSubject: {
        encrypted: 'true',
        ethereumAddress: address,
        id: `did:pkh:eip155:1:${address}`,
        type: 'questBadge',
        value: badgeValue,
        typeSchema: 'https://github.com/KrebitDAO/schemas/questBadge',
        trust: 1, // How much we trust the evidence to sign this?
        stake: 1, // In KRB
        price: 0 * 10 ** 18 // charged to the user for claiming KRBs
      },
      expirationDate: new Date(expirationDate).toISOString()
    };
    console.log('claim: ', claim);

    const issuedCredential = await Issuer.issue(claim, 'questBadge');

    console.log('issuedCredential: ', issuedCredential);

    console.log(
      'Verifying signature:',
      await Issuer.checkCredentialSignature(issuedCredential)
    );
  };

  return <h1 onClick={() => getData()}>hey</h1>;
};

export default IndexPage;
