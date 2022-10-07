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
    name: "NewCollection",
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
            name: "tokenCounter",
            type: "address",
          },
        ],
        internalType: "struct Config.Deployment",
        name: "deploymentConfig",
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
            internalType: "uint256",
            name: "primaryMintPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "treasuryAddress",
            type: "address",
          },
        ],
        internalType: "struct Config.Runtime",
        name: "runtimeConfig",
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
  return new ethers.Contract(address.CreateCollectionFacotory, abi, provider);
}
