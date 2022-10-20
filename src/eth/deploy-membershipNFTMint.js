import { ethers } from "ethers";

export async function createMembershipMintNFT(
  mintContract,
  url,
  tier,
  provider
) {
  if (!window.ethereum) throw new Error(`User wallet not found`);
  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5)
    throw new Error(`Please switch to Goerli for signing`);

  const signer = userProvider.getSigner();

  const from = await signer.getAddress();
  const contract = mintContract.connect(signer);
  const result = await contract.mintToCaller(from, url, tier);
  const txReceipt = await provider.waitForTransaction(result.hash);
  return txReceipt;
}
