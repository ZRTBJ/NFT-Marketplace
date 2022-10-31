import { ethers } from "ethers";

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
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bool",
            name: "tokensBurnable",
            type: "bool",
          },
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
        ],
        internalType: "struct Config.Deployment",
        name: "_deployConfig",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "baseURI",
            type: "string",
          },
          {
            internalType: "bool",
            name: "metadataUpdatable",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "tokensTransferable",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isRoyaltiesEnabled",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "royaltiesBps",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "royaltyAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "creatorDAO",
            type: "address",
          },
        ],
        internalType: "struct Config.Runtime",
        name: "_runConfig",
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

export function createInstance(address, provider) {
  return new ethers.Contract(address, abi, provider);
}
