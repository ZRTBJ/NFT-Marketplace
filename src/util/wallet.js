import Config from "../config";

export async function connectWallet() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Config.CHAIN_ID }], // chainId must be in hexadecimal numbers
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: Config.CHAIN_ID,
                // rpcUrl: Config.RPC_URL,
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  } else {
    // if no window.ethereum then MetaMask is not installed
  }
}

export async function getWalletAccount() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      return account;
    } catch (error) {
      console.error(error);
    }
  }
}

export async function isWalletConnected() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed
      const isConnected = await window.ethereum.isConnected();
      return isConnected;
    } catch (error) {
      console.error(error);
    }
  } else {
    // if no window.ethereum then MetaMask is not installed
    // alert(
    //   "MetaMask is not installed. Please consider installing it: https://metamask.io/download.html"
    // );
    return false;
  }
}
