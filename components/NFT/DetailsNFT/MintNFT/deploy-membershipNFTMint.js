import { ethers } from 'ethers';
import { ls_GetWalletType } from 'util/ApplicationStorage';
import { etherMagicProvider } from 'config/magicWallet/magic';

export async function createMembershipMintNFT(
  mintContract,
  url,
  tier,
  provider,
  value
) {
  if (!window.ethereum) throw new Error(`User wallet not found`);
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
  const contract = mintContract.connect(signer);
  try {
    const result = await contract.mintToCaller(from, url, tier, {
      value: ethers.utils.parseEther(value.toString()),
    });
    const txReceipt = await provider.waitForTransaction(result.hash);
    return txReceipt;
  } catch (err) {
    throw new Error(err);
  }
}
