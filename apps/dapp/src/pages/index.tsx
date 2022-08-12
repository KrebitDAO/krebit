import krebit from '@krebitdao/reputation-passport';
import { useEffect } from 'react';

const IndexPage = () => {
  useEffect(() => {
    const getData = async () => {
      /* const ethereum = (window as any).ethereum;
      const addresses = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      const address = addresses[0];
      const ethProvider = await krebit.lib.ethereum.getWeb3Provider();
      const wallet = ethProvider.getSigner();

      const Issuer = new krebit.core.Krebit();
      const data = await Issuer.connect(wallet, ethProvider.provider, address);

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

      console.log(data); */
    };

    getData();
  }, []);

  return <h1>hey</h1>;
};

export default IndexPage;
