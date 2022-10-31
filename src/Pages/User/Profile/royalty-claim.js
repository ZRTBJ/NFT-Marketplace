import { ethers } from "ethers";
import { signMetaTxRequest } from "util/smartcontract/signer";
import { createInstance } from "config/ABI/forwarder";
import { RoyaltyInstance } from "config/ABI/royalty-claim-contract";
import { NETWORKS } from "config/networks";
import { ls_GetChainID } from "util/ApplicationStorage";

async function sendMetaTx(provider, signer, config) {
  try {
    const forwarder = createInstance(provider);
    const deployedAddress = config.royalty_contract_address;

    // royalty splitter contract address,
    //! Address of cloned splitter contract

    const splitterInstance = await RoyaltyInstance(provider, deployedAddress);

    const from = await signer.getAddress();
    //  const from = config.user_eoa;
    const data = splitterInstance.interface.encodeFunctionData("release", [
      // from,
      config.user_eoa,
    ]);
    const to = splitterInstance.address;

    const request = await signMetaTxRequest(signer.provider, forwarder, {
      to,
      from,
      data,
    });

    let chainId = ls_GetChainID()
    let webhook = NETWORKS[chainId]?.webhook;

    return fetch(webhook, {
      method: "POST",
      body: JSON.stringify(request),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) { }
}

export async function royaltyClaim(provider, config) {
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

      const result = await sendMetaTx(provider, signer, config);

      if (result) {
        await result.json().then(async (response) => {
          tnxHash = JSON.parse(response.result);
        });
        if (tnxHash !== "") {
          // console.log(tnxHash);
          const txReceipt = await provider.waitForTransaction(tnxHash.txHash);
          output = tnxHash.txHash;
          console.log(txReceipt);
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
