import Config from "../config";
import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";
import { ethers } from "ethers";
let torusAccount = null;
const torus = new Torus({});

export async function torusWalletLogin() {
  await torus.login();
  const web3 = new Web3(torus.provider);
  const address = (await web3.eth.getAccounts())[0];
  const balance = await web3.eth.getBalance(address);
  const userinfo = await torus.getUserInfo();
  return new Promise((resolve, reject) => {
    torus.ethereum
      .request({
        method: "personal_sign",
        params: [
          "This is Creabo sign message.",
          torus.ethereum.selectedAddress,
        ],
      })
      .then((signedResult) => {
        try {
          if (signedResult !== undefined) {
            let signature = signedResult;
            torusAccount = { address, balance, ...userinfo, signature };
            resolve(torusAccount);
          }
        } catch (error) {
          reject(error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export async function torusLogout() {
  await torus.logout();
  torusAccount = null;
}

export async function torusInit() {
  await torus.init({
    enableLogging: false,
    network: {
      chainId: Config.CHAIN_ID, // default: 1
    },
    showTorusButton: false,
  });
  const web3 = new Web3(torus.provider);
  const address = (await web3.eth.getAccounts())[0];
  if (address !== undefined) {
    const balance = await web3.eth.getBalance(address);
    const userinfo = await torus.getUserInfo();
    return (torusAccount = { address, balance, ...userinfo });
  }
}

export async function SendTransactionTorus(tnxData) {
  let txnHash = "";
  const web3 = new Web3(torus.provider);
  const address = (await web3.eth.getAccounts())[0];
  const txnParams = {
    from: address,
    to: tnxData.toEoa,
    value: ethers.BigNumber.from(
      Web3.utils.toWei(tnxData.amount.toString(), "ether")
    )._hex,
    chainId: Config.CHAIN_ID,
  };
  const tHash = await torus.ethereum.request({
    method: "eth_sendTransaction",
    params: [txnParams],
  });
  txnHash = tHash ? tHash : "";
  return txnHash;
}

export { torusAccount };
