import { ethers } from 'ethers';

export async function withdrawFund(mintContract, provider) {
  if (!window.ethereum) throw new Error(`User wallet not found`);
  await window.ethereum.enable();
  try {
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const contract = mintContract.connect(signer);
    const result = await contract.withdraw();
    const txReceipt = await provider.waitForTransaction(result?.hash);
    return txReceipt;
  } catch (err) {
    return err.message;
  }
}
