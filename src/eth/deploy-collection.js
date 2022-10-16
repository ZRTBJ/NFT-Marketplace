import { ethers } from "ethers";
import { createInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";

async function sendMetaTx(collection, provider, signer, config) {
  const url = process.env.REACT_APP_WEBHOOK_URL;
  if (!url) throw new Error(`Missing relayer url`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();

  const args = {
    deployConfig: {
      name: config?.deploymentConfig?.name,
      symbol: config?.deploymentConfig?.symbol,
      owner: from,
      tokensBurnable: config?.deploymentConfig?.tokensBurnable,
      tokenCounter: config?.deploymentConfig?.tokenCounter,
    },
    runConfig: {
      baseURI: config?.runtimeConfig?.baseURI,
      metadataUpdatable: config?.runtimeConfig?.metadataUpdatable,
      tokensTransferable: config?.runtimeConfig?.tokensTransferable,
      isRoyaltiesEnabled: config?.runtimeConfig?.isRoyaltiesEnabled,
      royaltiesBps: config?.runtimeConfig?.royaltiesBps,
      royaltyAddress: config?.runtimeConfig?.royaltiesAddress,
      //TODO: Need to pass the price dynamically
      primaryMintPrice: ethers.utils.parseEther("0.00001"),
      treasuryAddress: config?.runtimeConfig?.treasuryAddress,
    },
  };

  const data = collection.interface.encodeFunctionData("cloneContract", [
    args.deployConfig,
    args.runConfig,
  ]);
  const to = collection.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });
}

export async function createCollection(collection, provider, config) {
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5)
    throw new Error(`Please switch to Goerli for signing`);

  const signer = userProvider.getSigner();

  let output;
  const result = await sendMetaTx(collection, provider, signer, config);

  await result.json().then(async (response) => {
    const tx = JSON.parse(response.result);
    const txReceipt = await provider.waitForTransaction(tx.txHash);
    console.log(txReceipt);
    output = { txReceipt };
  });

  return output;
}
