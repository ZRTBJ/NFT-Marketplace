import { ethers } from "ethers";

export async function createMembershipMintNFT(
  mintContract,
  url,
  tier,
  provider,
  value
) {
  if (!window.ethereum) throw new Error(`User wallet not found`);
  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = userProvider.getSigner();

  const from = await signer.getAddress();
  const contract = mintContract.connect(signer);
  const result = await contract.mintToCaller(from, url, tier, {
    value: ethers.utils.parseEther(value.toString()),
  });
  const txReceipt = await provider.waitForTransaction(result.hash);
  return txReceipt;
}
