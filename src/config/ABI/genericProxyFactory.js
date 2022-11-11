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
            internalType: "bool",
            name: "isCollection",
            type: "bool",
          },
          {
            components: [
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
                ],
                internalType: "struct Config.Deployment",
                name: "deployConfig",
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
                name: "runConfig",
                type: "tuple",
              },
            ],
            internalType: "struct Config.CollectionConfiguration",
            name: "collection",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
        ],
        internalType: "struct Config.CollectionProxy",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "createCollectionProxy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "isDAO",
            type: "bool",
          },
          {
            components: [
              {
                internalType: "address",
                name: "masterCopy",
                type: "address",
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
            name: "dao",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
        ],
        internalType: "struct Config.DaoProxy",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "createDAOProxy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "isCollection",
            type: "bool",
          },
          {
            components: [
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
                ],
                internalType: "struct Config.Deployment",
                name: "deployConfig",
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
                name: "runConfig",
                type: "tuple",
              },
            ],
            internalType: "struct Config.CollectionConfiguration",
            name: "collection",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
        ],
        internalType: "struct Config.CollectionProxy",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "createMembershipProxy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "isRoyalty",
            type: "bool",
          },
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
                internalType: "address payable",
                name: "collection",
                type: "address",
              },
              {
                internalType: "address",
                name: "masterCopy",
                type: "address",
              },
              {
                internalType: "address",
                name: "creator",
                type: "address",
              },
            ],
            internalType: "struct Config.PaymentSplitter",
            name: "royalty",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
        ],
        internalType: "struct Config.RoyaltyProxy",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "createRoyaltyProxy",
    outputs: [],
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
  let chainId = ls_GetChainID();
  let createFactory = NETWORKS?.[chainId]?.genericProxyFacotory;
  return new ethers.Contract(createFactory, abi, provider);
}
