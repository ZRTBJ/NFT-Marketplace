import { ethers } from 'ethers';
import { ls_GetWalletType } from 'util/ApplicationStorage';
import { etherMagicProvider } from 'config/magicWallet/magic';

export async function createMintNFT(mintContract, url, price, provider) {
  let walletType = await ls_GetWalletType();
  let signer;
  if (walletType === 'metamask') {
    if (!window.ethereum) throw new Error(`User wallet not found`);
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    signer = userProvider.getSigner();
  } else if (walletType === 'magicwallet') {
    signer = etherMagicProvider.getSigner();
  }

  const from = await signer.getAddress();
  const contract = mintContract.connect(signer);
  const result = await contract.mintToCaller(from, url, {
    value: ethers.utils.parseEther(price.toString()),
  });
  const txReceipt = await provider.waitForTransaction(result.hash);
  return txReceipt;
}
