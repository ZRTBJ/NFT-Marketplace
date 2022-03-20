import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";
let torusAccount = null;
const torus = new Torus({});

export async function torusWalletLogin(e) {
  e.preventDefault();
  await torus.login();
  const web3 = new Web3(torus.provider);
  const address = (await web3.eth.getAccounts())[0];
  const balance = await web3.eth.getBalance(address);
  const userinfo = await torus.getUserInfo();
  return (torusAccount = { address, balance, ...userinfo });
}
export async function torusLogout() {
  await torus.logout();
  torusAccount = null;
}

export async function torusInit() {
  await torus.init({
    enableLogging: false,
    //   network:'',
    //   buildEnv:'production',
    showTorusButton: false,
  });
  const web3 = new Web3(torus.provider);
  const address = (await web3.eth.getAccounts())[0];
  console.log(address);

  if (address !== undefined) {
    const balance = await web3.eth.getBalance(address);
    const userinfo = await torus.getUserInfo();
    return (torusAccount = { address, balance, ...userinfo });
  }
}
export { torusAccount };
