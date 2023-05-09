import { ethers } from 'ethers';

const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'newProxy',
        type: 'address',
      },
    ],
    name: 'ProxyCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'defaultAdmin',
                type: 'address',
              },
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'symbol',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'contractURI',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'baseURI',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'royaltyRecipient',
                type: 'address',
              },
              {
                internalType: 'uint128',
                name: 'royaltyBps',
                type: 'uint128',
              },
              {
                internalType: 'address',
                name: 'primarySaleRecipient',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'platformFeeManager',
                type: 'address',
              },
            ],
            internalType: 'struct Config.ERC1155Params',
            name: 'metadata',
            type: 'tuple',
          },
          {
            internalType: 'address',
            name: 'masterCopy',
            type: 'address',
          },
        ],
        internalType: 'struct Config.ERC1155DeployRequest',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'DeployERC1155',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export function erc1155ProxyInstance(address, provider) {
  return new ethers.Contract(address, abi, provider);
}
