import LitJsSdk from "@lit-protocol/sdk-browser";
import Krebit from "@krebitdao/reputation-passport";
import { ethers } from "ethers";

const Index = () => {
  const getWalletInformation = async () => {
    if (!window.ethereum) return;

    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = addresses[0];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await Krebit.lib.ethereum.switchNetwork(window.ethereum);
    const wallet = provider.getSigner();

    return {
      ethProvider: provider.provider,
      address,
      wallet,
    };
  };

  const action = async () => {
    const { wallet, address, ethProvider } = await getWalletInformation();

    const claimedCredentialId =
      "ceramic://kjzl6cwe1jw148vv5wb10jnaqzuwbqrojm73xme05fw5x3nl7uykifs7fmi34qd";

    // Log in with wallet to Ceramic DID
    const Issuer = new Krebit.core.Krebit({
      wallet,
      ethProvider,
      address,
      litSdk: LitJsSdk,
      ceramicUrl: "https://ceramic-clay.3boxlabs.com",
    });
    const did = await Issuer.connect();
    console.log("DID:", did);

    const claimedCredential = await Issuer.getCredential(claimedCredentialId);

    console.log(
      "Verifying discord with claimedCredential: ",
      claimedCredential
    );

    // Check self-signature
    console.log("checkCredential: ", Issuer.checkCredential(claimedCredential));
  };

  return <button onClick={() => action()}>click me</button>;
};

export default Index;
