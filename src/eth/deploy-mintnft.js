import { ethers } from "ethers";
import { createInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";
import { createMintInstance } from "./mint-nft";

// const TOKEN_COUNTER_CONTRACT = "0x60761e680fafa77f5c2fe5533800255cddb36b47";
// const IPFS_BASE_URL = "https://gateway.pinata.cloud/ipfs/";
// const DEFAULT_ROYALTY_BIPS = 250;
// const treasury = "0x6de0f93032a1c7775f90ff94cde91c604d976661";
// async function sendMetaTx(
//   collection,
//   provider,
//   signer,
//   collectionName,
//   symbol
// ) {
//   console.log(`Sending register meta-tx to set name=${collectionName}`);
//   const url = process.env.REACT_APP_WEBHOOK_URL;
//   if (!url) throw new Error(`Missing relayer url`);

//   const forwarder = createInstance(provider);
//   const from = await signer.getAddress();

//   const args = {
//     deployConfig: {
//       name: collectionName,
//       symbol: symbol,
//       owner: from,
//       tokensBurnable: false,
//       tokenCounter: TOKEN_COUNTER_CONTRACT,
//     },
//     runConfig: {
//       baseURI: IPFS_BASE_URL,
//       metadataUpdatable: true,
//       tokensTransferable: true,
//       isRoyaltiesEnabled: true,
//       royaltiesBps: DEFAULT_ROYALTY_BIPS,
//       royaltyAddress: ethers.constants.AddressZero,
//       primaryMintPrice: ethers.utils.parseEther("0.2"),
//       treasuryAddress: treasury,
//     },
//   };

//   console.log(JSON.stringify(args));

//   // This is called from factory method
//   const data = collection.interface.encodeFunctionData("cloneContract", [
//     args.deployConfig,
//     args.runConfig,
//   ]);
//   const to = collection.address;

//   const request = await signMetaTxRequest(signer.provider, forwarder, {
//     to,
//     from,
//     data,
//   });

//   return fetch(url, {
//     method: "POST",
//     body: JSON.stringify(request),
//     headers: { "Content-Type": "application/json" },
//   });
// }

export async function createMintNFT(mintContract, url) {
  if (!window.ethereum) throw new Error(`User wallet not found`);
  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5)
    throw new Error(`Please switch to Goerli for signing`);

  const signer = userProvider.getSigner();

  const from = await signer.getAddress();
  const contract = mintContract.connect(signer);
  const result = await contract.mintToCaller(from, "url", {
    value: ethers.utils.parseEther("0.2"),
  });
  return result.hash;
}
