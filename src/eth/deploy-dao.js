import { ethers } from "ethers";
import { createInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";
import { createDAOInstance } from "./dao-contract";
// import { createInstance } from "eth/registry";

// async function sendTx(dao, name) {
//   console.log(`Sending register tx to set name=${name}`);

//   // add gnosis safe wallet creation logic here
//   // const safeInfo = await createSafe(from);
//   // console.log(`Safe will be created with ${safeInfo}`);

//   return dao.cloneContract(name);
// }

async function sendMetaTx(dao, provider, signer, name, treasuryAddress) {
  console.log(`Sending register meta-tx to set name=${name}`);
  const url = process.env.REACT_APP_WEBHOOK_URL;
  if (!url) throw new Error(`Missing relayer url`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  const setupData =
    "0xb63e800d00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000037326336386244616244393439383139463131390000000000000000000000000000000000000000000000000000000000000000";
  const data = dao.interface.encodeFunctionData("cloneContract", [
    name,
    process.env.REACT_APP_SAFE_PROXY_ADDRESS,
    process.env.REACT_APP_SAFE_SINGLETON_ADDRESS,
    setupData,
    new Date().getTime(),
    treasuryAddress ? true : false,
    treasuryAddress ? treasuryAddress : from,
  ]);
  const to = dao.address;

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

export async function createDAO(dao, provider, name, treasuryAddress) {
  if (!name) throw new Error(`Name cannot be empty`);
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5)
    throw new Error(`Please switch to Goerli for signing`);
  console.log(dao, provider, name);
  const signer = userProvider.getSigner();
  // const from = await signer.getAddress();
  // const balance = await provider.getBalance(from);

  // const canSendTx = balance.gt(1e15);
  // if (canSendTx) return sendTx(dao.connect(signer), name, from);

  let output;
  const result = await sendMetaTx(dao, provider, signer, name, treasuryAddress);

  await result.json().then(async (response) => {
    const tx = JSON.parse(response.result);
    const txReceipt = await provider.waitForTransaction(tx.txHash);
    console.log(txReceipt);
    output = { txReceipt };
  });

  // //TODO: REFACTOR
  // dao.on("NewClone", async (address) => {
  //   console.log(`Clone created at following address ${address}`);
  //   const deployedDAO = createDAOInstance(provider, address);
  //   localStorage.setItem("CurrentContractAddress", address);
  //   const treasuryAddress = await deployedDAO.functions.getTreasury();
  //   console.log(`treasury is deployed to ${treasuryAddress}`);
  // });

  return output;
}
