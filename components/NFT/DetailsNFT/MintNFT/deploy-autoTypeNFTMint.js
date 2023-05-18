import { ethers } from 'ethers';
import { ls_GetWalletType } from 'util/ApplicationStorage';
import { etherMagicProvider } from 'config/magicWallet/magic';

export async function createAutoTypeMintNFT(
  type,
  mintContract,
  token_id,
  price,
  provider
) {
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
  let result = '';
  if (type === 'ERC1155') {
    result = await contract.mint(token_id, 1, {
      // in erc 1155, mint function requires token id and quantity. so 1 means quantity.
      value: ethers.utils.parseEther(price.toString()),
    });
    // ERC721
  } else if (type === 'ERC721') {
    result = await contract.mint(token_id, {
      value: ethers.utils.parseEther(price.toString()),
    });
  }
  console.log(result);
  const txReceipt = await provider.waitForTransaction(result.hash);
  return txReceipt;
}
