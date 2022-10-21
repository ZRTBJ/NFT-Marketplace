import { ethers } from "ethers";
import { createInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";
import { NETWORKS } from "config/networks";

async function sendMetaTx(collection, provider, signer, config, type) {
  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  let chainId = localStorage.getItem("networkChain");
  let minimalForwarder = NETWORKS[Number(chainId)]?.forwarder;
  let masterCopyCollection = NETWORKS[Number(chainId)]?.masterCopyCollection;
  let masterMembershipCollection =
    NETWORKS[Number(chainId)]?.masterMembershipCollection;
  let webhook = NETWORKS[Number(chainId)]?.webhook;
  const args = {
    deployConfig: {
      name: config?.deploymentConfig?.name,
      symbol: config?.deploymentConfig?.symbol,
      owner: from,
      tokensBurnable: config?.deploymentConfig?.tokensBurnable,
      masterCopy:
        type === "membership"
          ? masterMembershipCollection
          : masterCopyCollection,
      forwarder: minimalForwarder,
    },
    runConfig: {
      baseURI: config?.runtimeConfig?.baseURI,
      metadataUpdatable: config?.runtimeConfig?.metadataUpdatable,
      tokensTransferable: config?.runtimeConfig?.tokensTransferable,
      isRoyaltiesEnabled: config?.runtimeConfig?.isRoyaltiesEnabled,
      royaltiesBps: config?.runtimeConfig?.royaltiesBps,
      royaltyAddress: config?.runtimeConfig?.royaltiesAddress,
      creatorDAO: config?.runtimeConfig?.DAOContractAddress,
    },
  };

  const data = collection.interface.encodeFunctionData("createProxyContract", [
    args.deployConfig,
    args.runConfig,
  ]);
  const to = collection.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });

  return fetch(webhook, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });
}

export async function createCollection(collection, provider, config, type) {
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = userProvider.getSigner();

  let output;
  const result = await sendMetaTx(collection, provider, signer, config, type);

  await result.json().then(async (response) => {
    const tx = JSON.parse(response.result);
    const txReceipt = await provider.waitForTransaction(tx.txHash);
    console.log(txReceipt);
    output = { txReceipt };
  });

  return output;
}
