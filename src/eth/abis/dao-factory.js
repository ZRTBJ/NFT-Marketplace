import { ethers } from "ethers";
import { NETWORKS } from "config/networks";
import { ls_GetChainID } from "util/ApplicationStorage";

const abi = [
  {
    inputs: [
      {
        internalType: "contract MinimalForwarderUpgradeable",
        name: "_minimalForwarder",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newProxy",
        type: "address",
      },
    ],
    name: "ProxyCreated",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "masterCopy",
            type: "address",
          },
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "safeFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "singleton",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "setupData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "hasTreasury",
            type: "bool",
          },
          {
            internalType: "address",
            name: "safeProxy",
            type: "address",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct Config.DAOConfig",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "createProxyContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export function createInstance(provider) {
  let chainId = ls_GetChainID()
  let createFactoryDAO = NETWORKS?.[chainId]?.createFactoryDAO;
  return new ethers.Contract(createFactoryDAO, abi, provider);
}
