import dynamic from 'next/dynamic';
import MetaMaskOnboarding from '@metamask/onboarding';
import { ethers } from 'ethers';

const Web3 = dynamic(() => import('web3'), {
  suspense: true,
});

const currentUrl =
  typeof window !== 'undefined' && new URL(window.location.href);
const forwarderOrigin =
  currentUrl?.hostname === 'localhost' ? 'http://localhost:3000' : undefined;
let onboarding =
  typeof window !== 'undefined' && new MetaMaskOnboarding({ forwarderOrigin });

export async function getWalletAccount() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (typeof window !== 'undefined') {
    if (window.ethereum) {
      try {
        // check if the chain to connect to is installed
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const account = accounts[0];
        return account;
      } catch (error) {
        console.log(error.message);
        return;
      }
    } else {
      onBoardBrowserPlugin();
      return;
    }
  }
}

export async function isWalletConnected() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (typeof window !== 'undefined') {
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
}

/** Sign metamask to verify account */
export async function getPersonalSign() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (typeof window !== 'undefined') {
    if (window.ethereum) {
      let signedResult = '';
      try {
        signedResult = await window.ethereum.request({
          method: 'personal_sign',
          params: [
            "You're signing to the decir.io",
            window.ethereum.selectedAddress,
          ],
        });
      } catch (error) {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          window.alert('Please connect to MetaMask.');
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
}

/** Tell user to install metamask if not installed */
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

//To get current Metamask wallet network ID
export const getCurrentNetworkId = async () => {
  if (typeof window !== 'undefined') {
    if (window.ethereum) {
      let network = window.ethereum?.networkVersion;
      return Number(network);
    } else {
      onBoardBrowserPlugin();
      return;
    }
  }
};

//To Switch network
export const handleSwitchNetwork = async (projectNetwork) => {
  if (typeof window !== 'undefined') {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3.utils.toHex(projectNetwork) }],
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      onBoardBrowserPlugin();
      return;
    }
  }
};

//To get balance
export const getAccountBalance = async () => {
  if (typeof window !== 'undefined') {
    if (window.ethereum) {
      try {
        let accountAddress = await getWalletAccount();
        let balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accountAddress, 'latest'],
        });
        return ethers.utils.formatEther(balance);
      } catch (error) {
        console.log(error.message);
        return;
      }
    } else {
      onBoardBrowserPlugin();
      return;
    }
  }
};
