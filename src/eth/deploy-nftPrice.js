import { ethers } from "ethers";
import { createInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";

async function sendMetaTx(contract, provider, signer, price) {
  const url = process.env.REACT_APP_WEBHOOK_URL;
  if (!url) throw new Error(`Missing relayer url`);
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

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });
}

export async function setNFTPrice(collection, provider, price) {
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5)
    throw new Error(`Please switch to Goerli for signing`);

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
