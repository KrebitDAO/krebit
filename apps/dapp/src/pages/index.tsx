import { core, lib, utils } from '@krebitdao/reputation-passport';
import React, { useEffect } from 'react';

const IndexPage = () => {
  useEffect(() => {
    const getData = async () => {
      const ethereum = (window as any).ethereum;
      const addresses = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      const address = addresses[0];
      const ethProvider = (await lib.ethereum.getProvider()) as utils.WalletProvider;

      const krebit = new core.Krebit();
      const data = await krebit.connect(ethereum, ethProvider, address);

      console.log(data);
    };

    getData();
  }, []);

  return <h1>hey</h1>;
};

export default IndexPage;
