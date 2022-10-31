import { ethers } from "ethers";
import { NETWORKS } from "config/networks";
import { ls_GetChainID } from "util/ApplicationStorage";

const abi = [
  {
    inputs: [
      {
        internalType: "contract MinimalForwarderUpgradeable",
        name: "_minimalForwarder",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newProxy",
        type: "address"
      }
    ],
    name: "ProxyCreated",
    type: "event"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address[]",
            name: "receivers",
            type: "address[]"
          },
          {
            internalType: "uint256[]",
            name: "shares",
            type: "uint256[]"
          },
          {
            internalType: "address payable",
            name: "collection",
            type: "address"
          },
          {
            internalType: "address",
            name: "masterCopy",
            type: "address"
          },
          {
            internalType: "address",
            name: "creator",
            type: "address"
          },
          {
            internalType: "address",
            name: "forwarder",
            type: "address"
          }
        ],
        internalType: "struct Config.PaymentSplitter",
        name: "_config",
        type: "tuple"
      }
    ],
    name: "createProxyContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address"
      }
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

export function createInstance(provider) {
  let chainId = ls_GetChainID()
  let createRoyaltySplitter = NETWORKS?.[chainId]?.createRoyaltySplitter;
  return new ethers.Contract(createRoyaltySplitter, abi, provider);
}
