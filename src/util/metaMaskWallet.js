import Config from "../config/config";
import MetaMaskOnboarding from "@metamask/onboarding";
import { ethers } from "ethers";
import Web3 from "web3";

const currentUrl = new URL(window.location.href);
const forwarderOrigin =
  currentUrl.hostname === "localhost" ? "http://localhost:3000" : undefined;
let onboarding = new MetaMaskOnboarding({ forwarderOrigin });

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
    onBoardBrowserPlugin();
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
      alert(error.message);
      return;
    }
  } else {
    onBoardBrowserPlugin();
    return;
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
    onBoardBrowserPlugin();
    return false;
  }
}

export function registerChainChnageEvent() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed
      window.ethereum.on("chainChanged", (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    onBoardBrowserPlugin();
  }
}

export async function getPersonalSign() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    let signedResult = "";
    try {
      signedResult = await window.ethereum.request({
        method: "personal_sign",
        params: [
          "You're signing to the decir.io",
          window.ethereum.selectedAddress,
        ],
      });
    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        window.alert("Please connect to MetaMask.");
      } else {
        console.error(error.message);
      }
    }
    return signedResult;
  } else {
    onBoardBrowserPlugin();
    return;
  }
}

export async function getTransactionSign(amount) {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    let signedResult = "";
    const account = await getWalletAccount();
    // get the count
    try {
      signedResult = await window.ethereum.request({
        method: "eth_getTransactionCount",
        params: [account, "latest"],
      });
    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        window.alert("Please connect to MetaMask.");
      } else {
        console.error(error.message);
      }
    }

    const txsCount = ethers.BigNumber.from(signedResult);
    const tx = {
      to: "0x0174965F7ad2442bd158408749138b037A1B98F9",
      nonce: txsCount.toNumber(),
      gasLimit: ethers.BigNumber.from("60000"),
      gasPrice: ethers.BigNumber.from(amount),
      value: ethers.BigNumber.from(0),
      chainId: 1,
    };
    const serializedTxHash = ethers.utils.keccak256(
      ethers.utils.serializeTransaction(tx)
    );
    // get the sign
    try {
      signedResult = await window.ethereum.request({
        method: "eth_sign",
        params: [account, serializedTxHash],
      });
    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        window.alert("Please connect to MetaMask.");
      } else {
        console.error(error.message);
      }
    }

    return signedResult;
  } else {
    onBoardBrowserPlugin();
    return;
  }
}

export async function SendTransactionMetaMask(tnxData) {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    let tnxHash = "";
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    const params = {
      gasPrice: tnxData.gasPrice.toString(), // "0x107f947c30", // customizable by user during MetaMask confirmation.
      to: tnxData.toEoa, // "0xDD09F730D4e17Cb147bb9d19bC9A2e3c6566B48F",
      from: account,
      value: ethers.BigNumber.from(Web3.utils.toWei("0.0001", "ether"))._hex, // "0x09184e72a000",
      chainId: Config.CHAIN_ID,
    };
    try {
      tnxHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [params],
      });
    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        window.alert("userRejectedRequest.");
      } else {
        console.error(error.message);
      }
    }

    return tnxHash;
  } else {
    onBoardBrowserPlugin();
    return;
  }
}

function onBoardBrowserPlugin() {
  try {
    onboarding.startOnboarding();
  } catch (error) {
    console.error(error);
  }
  if (onboarding) {
    onboarding.stopOnboarding();
  }
}
