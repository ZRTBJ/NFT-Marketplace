import { ethers } from "ethers";
import { createInstance } from "./../abis/forwarder";
import { signMetaTxRequest } from "./signer";
import { NETWORKS } from "config/networks";

async function sendMetaTx(contract, provider, signer, price) {
  const forwarder = createInstance(provider);
  const from = await signer.getAddress();

  const data = contract.interface.encodeFunctionData("setPrimaryMintPrice", [
    ethers.utils.parseUnits(price.toString(), "ether"),
  ]);
  const to = contract.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });

  let chainId = localStorage.getItem("networkChain");
  let webhook = NETWORKS[Number(chainId)]?.webhook;

  return fetch(webhook, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });
}

export async function setNFTPrice(collection, provider, price) {
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = userProvider.getSigner();

  let output;
  const result = await sendMetaTx(collection, provider, signer, price);

  await result.json().then(async (response) => {
    const tx = JSON.parse(response.result);
    const txReceipt = await provider.waitForTransaction(tx.txHash);
    console.log(txReceipt);
    output = { txReceipt };
  });

  return output;
}
