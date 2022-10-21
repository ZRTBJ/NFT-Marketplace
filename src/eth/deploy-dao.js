import { ethers } from "ethers";
import { createInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";
import { createDAOInstance } from "./dao-contract";
import { addressGnosisSetup } from "services/project/projectService";
import address from "../deploy.json";
import { NETWORKS } from "config/networks";

// import { createInstance } from "eth/registry";

// async function sendTx(dao, name) {
//   console.log(`Sending register tx to set name=${name}`);

//   // add gnosis safe wallet creation logic here
//   // const safeInfo = await createSafe(from);
//   // console.log(`Safe will be created with ${safeInfo}`);

//   return dao.cloneContract(name);
// }

async function sendMetaTx(
  dao,
  provider,
  signer,
  name,
  treasuryAddress,
  chainId
) {
  console.log(`Sending register meta-tx to set name=${name}`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  let formData = new FormData();
  formData.append("addresses", from);
  formData.append("blockchain", chainId);
  const setupData = await addressGnosisSetup(formData);
  let minimalForwarder = NETWORKS?.[Number(chainId)]?.forwarder;
  let masterCopy = NETWORKS?.[Number(chainId)]?.masterCopyDAO;
  let webhook = NETWORKS?.[Number(chainId)]?.webhook;
  let args = {
    masterCopy: masterCopy,
    forwarder: minimalForwarder,
    name,
    safeFactory: process.env.REACT_APP_SAFE_PROXY_ADDRESS,
    singleton: process.env.REACT_APP_SAFE_SINGLETON_ADDRESS,
    setupData: `0x${setupData.call_data}`,
    nonce: new Date().getTime(),
    hasTreasury: treasuryAddress ? true : false,
    safeProxy: treasuryAddress ? treasuryAddress : ethers.constants.AddressZero,
    creator: from,
  };

  const data = dao.interface.encodeFunctionData("createProxyContract", [args]);
  const to = dao.address;

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

export async function createDAO(dao, provider, name, treasuryAddress, chainId) {
  if (!name) throw new Error(`Name cannot be empty`);
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = userProvider.getSigner();

  let output;
  const result = await sendMetaTx(
    dao,
    provider,
    signer,
    name,
    treasuryAddress,
    chainId
  );

  await result.json().then(async (response) => {
    const tx = JSON.parse(response.result);
    const txReceipt = await provider.waitForTransaction(tx.txHash);
    output = { txReceipt };
  });

  return output;
}
