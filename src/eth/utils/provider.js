/* eslint-disable no-unused-vars */
import { ethers } from "ethers";
import { NETWORKS } from "config/networks";

export function createProvider() {
  let id = localStorage.getItem("networkChain");
  let chainId = Number(id);
  return new ethers.providers.JsonRpcProvider(
    NETWORKS?.[chainId]?.quickNodeURL,
    chainId
  );
}
