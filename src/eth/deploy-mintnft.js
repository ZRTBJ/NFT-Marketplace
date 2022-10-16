import { ethers } from "ethers";

export async function createMintNFT(mintContract, url, price, provider) {
  if (!window.ethereum) throw new Error(`User wallet not found`);
  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5)
    throw new Error(`Please switch to Goerli for signing`);

  const signer = userProvider.getSigner();

  const from = await signer.getAddress();
  const contract = mintContract.connect(signer);
  const result = await contract.mintToCaller(from, url, {
    //TODO: Need to pass the price dynamically
    value: ethers.utils.parseEther("0.00001"),
  });
  const txReceipt = await provider.waitForTransaction(result.hash);
  console.log(txReceipt);
  return txReceipt;
}
