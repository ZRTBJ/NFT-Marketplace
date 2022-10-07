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
    name: "NewClone",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "address",
        name: "_safeFactory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_singleton",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_setupData",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "_nonce",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_hasTreasury",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_treasuryAddress",
        type: "address",
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
  return new ethers.Contract(address.CreatorDAOFactory, abi, provider);
}
