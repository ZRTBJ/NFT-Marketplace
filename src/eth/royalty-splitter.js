import { ethers } from "ethers";
import address from "../deploy.json";

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_impl",
        type: "address",
      },
      {
        internalType: "contract MinimalForwarder",
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
        internalType: "address",
        name: "_clone",
        type: "address",
      },
    ],
    name: "SplitterCreated",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address[]",
            name: "receivers",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "shares",
            type: "uint256[]",
          },
          {
            internalType: "address",
            name: "collection",
            type: "address",
          },
        ],
        internalType: "struct Config.PaymentSplitter",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "cloneContract",
    outputs: [
      {
        internalType: "address",
        name: "instance",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "impl",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
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
  return new ethers.Contract(address.RoyaltySplitterFactory, abi, provider);
}
