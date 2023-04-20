/* eslint-disable no-unused-vars */
import { ethers } from 'ethers';
import { NETWORKS } from 'config/networks';
import { ls_GetChainID, ls_GetWalletType } from 'util/ApplicationStorage';
import { etherMagicProvider } from 'config/magicWallet/magic';

let walletType = ls_GetWalletType();

export function createProvider() {
  let chainId = ls_GetChainID();
  return new ethers.providers.JsonRpcProvider(
    NETWORKS?.[chainId]?.quickNodeURL,
    chainId
  );
}

export function createUserProvider() {
  if (walletType === 'metamask') {
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    return userProvider;
  } else if (walletType === 'magicwallet') {
    return etherMagicProvider;
  }
}
