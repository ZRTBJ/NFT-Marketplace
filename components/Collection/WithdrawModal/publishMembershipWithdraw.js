import { ethers } from 'ethers';

export async function withdrawMembershipFund(mintContract, provider) {
  if (!window.ethereum) throw new Error(`User wallet not found`);
  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = userProvider.getSigner();
  const from = await signer.getAddress();
  const contract = mintContract.connect(signer);
  const result = await contract.withdraw();
  console.log(result);
  const txReceipt = await provider.waitForTransaction(result.hash);
  console.log(txReceipt);
  return txReceipt;
}
