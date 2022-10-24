// 0x7A18eD040cC4E4f2774658651beDaC0A96ba0cb3

import { ethers } from "ethers";
import { createInstance } from "eth/abis/forwarder";
import { signMetaTxRequest } from "eth/utils/signer";
import { NETWORKS } from "config/networks";

async function sendMetaTx(contract, provider, signer, nftInfo) {
  const forwarder = createInstance(provider);
  try {
    const from = await signer.getAddress();
    const data = contract.interface.encodeFunctionData("updateTokenUri", [
      nftInfo.token_id,
      nftInfo.metadata_url,
      true,
    ]);
    const to = contract.address;

    const request = await signMetaTxRequest(signer.provider, forwarder, {
      to,
      from,
      data,
    });
    console.log(request);

    let chainId = localStorage.getItem("networkChain");
    let webhook = NETWORKS[Number(chainId)]?.webhook;

    return fetch(webhook, {
      method: "POST",
      body: JSON.stringify(request),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) { }
}

export async function updateMetadata(collection, provider, nftInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      let tnxHash = "";
      let output;
      if (!window.ethereum) {
        reject("User wallet not found");
      }
      await window.ethereum.enable();
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = userProvider.getSigner();
      const result = await sendMetaTx(collection, provider, signer, nftInfo);
      if (result) {
        await result.json().then(async (response) => {
          tnxHash = JSON.parse(response.result);
        });
        if (tnxHash !== "") {
          await provider.waitForTransaction(tnxHash.txHash);
          output = tnxHash.txHash;
          resolve(output);
        } else {
          reject("Could not found the Transaction Hash");
        }
      } else if (!result) {
        reject("User canceled the event");
      }
    } catch (error) {
      reject(error);
    }
  });
}
