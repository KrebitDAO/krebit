import { useEffect } from 'react';
import { graph } from 'lib';

const IndexPage = () => {
  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_NETWORK);
    const x = async () => {
      const data = await graph.erc20BalanceQuery({
        id: '1',
      });

      console.log(data);
    };

    x();
  });

  return <h1>hey</h1>;
};

export default IndexPage;
