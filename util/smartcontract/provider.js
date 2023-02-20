/* eslint-disable no-unused-vars */
import { ethers } from "ethers";
import { NETWORKS } from "config/networks";
import { ls_GetChainID } from "util/ApplicationStorage";

export function createProvider() {
  let chainId = ls_GetChainID()
  return new ethers.providers.JsonRpcProvider(
    NETWORKS?.[chainId]?.quickNodeURL,
    chainId
  );
}

export function createUserProvider() {
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  return userProvider
}
