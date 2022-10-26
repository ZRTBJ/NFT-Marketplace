import { ethers } from "ethers";
import { createInstance } from "eth/abis/forwarder";
import { signMetaTxRequest } from "eth/utils/signer";
import { NETWORKS } from "config/networks";
import { ls_GetChainID } from "util/ApplicationStorage";

async function sendMetaTx(contract, provider, signer, tier) {
  const forwarder = createInstance(provider);
  const from = await signer.getAddress();

  const data = contract.interface.encodeFunctionData("setTiers", [tier]);
  const to = contract.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });
  let chainId = ls_GetChainID()
  let webhook = NETWORKS?.[chainId]?.webhook;
  return fetch(webhook, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });
}

export async function setMemNFTPrice(collection, provider, tier) {
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = userProvider.getSigner();

  let output;
  const result = await sendMetaTx(collection, provider, signer, tier);

  await result.json().then(async (response) => {
    const tx = JSON.parse(response.result);
    const txReceipt = await provider.waitForTransaction(tx.txHash);
    console.log(txReceipt);
    output = { txReceipt };
  });

  return output;
}
