import { ethers } from 'ethers';
import { createInstance } from 'config/ABI/forwarder';
import { erc721ProxyInstance } from 'config/ABI/erc721ProxyFactory';
import { erc1155ProxyInstance } from 'config/ABI/erc1155ProxyFactory';
import { signMetaTxRequest } from 'util/smartcontract/signer';
import { NETWORKS } from 'config/networks';
import { ls_GetChainID, ls_GetWalletType } from 'util/ApplicationStorage';
import { etherMagicProvider } from 'config/magicWallet/magic';
import { address } from 'config/contractAddresses';

async function sendMetaTx(
  collection,
  provider,
  signer,
  config,
  type,
  productPrice
) {
  const from = await signer.getAddress();

  let chainId = ls_GetChainID();
  let minimalForwarder = NETWORKS[chainId]?.forwarder;
  let masterCopyCollection = NETWORKS[chainId]?.masterCopyCollection;
  let masterMembershipCollection =
    NETWORKS[Number(chainId)]?.masterMembershipCollection;
  let ERC721MasterCopy =
    NETWORKS[chainId]?.CreateCollectionERC721MasterCopyMumbai;
  let ERC1155MasterCopy =
    NETWORKS[chainId]?.CreateCollectionERC1155MasterCopyMumbai;
  let discount = NETWORKS[Number(chainId)]?.discount;
  let treasury = NETWORKS[Number(chainId)]?.decirTreasury;
  let platformFeeManager = NETWORKS[Number(chainId)]?.PlatformFeeManager;

  const metaArgs = {
    metadata: {
      defaultAdmin: from,
      name: config?.deploymentConfig?.name,
      symbol: config?.deploymentConfig?.symbol,
      contractURI: '',
      baseURI: config?.runtimeConfig?.baseURI,
      royaltyRecipient: config?.runtimeConfig?.royaltiesAddress,
      royaltyBps: config?.runtimeConfig?.royaltiesBps,
      primarySaleRecipient: config?.runtimeConfig?.royaltiesAddress,
      floorPrice: ethers.utils.parseUnits(
        config?.runtimeConfig?.basePrice?.toString(),
        'ether'
      ),
      maxSupply: config?.runtimeConfig?.totalSupply,
      platformFeeManager: platformFeeManager,
    },
    masterCopy:
      config?.deploymentConfig?.collection_standard === 'ERC721'
        ? ERC721MasterCopy
        : ERC1155MasterCopy,
  };
  console.log(metaArgs);
  const data = collection.interface.encodeFunctionData(
    'DeployERC721',
    metaArgs
  );
  const to = collection.address;

  const request = await signMetaTxRequest(signer.provider, collection, {
    to,
    from,
    data,
  });

  return fetch(webhook, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function createCollection(
  collection,
  provider,
  config,
  type,
  productPrice
) {
  let walletType = await ls_GetWalletType();
  let signer;
  if (walletType === 'metamask') {
    if (!window.ethereum) throw new Error(`User wallet not found`);
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    signer = userProvider.getSigner();
  } else if (walletType === 'magicwallet') {
    signer = etherMagicProvider.getSigner();
  }

  let output;
  const result = await sendMetaTx(
    collection,
    provider,
    signer,
    config,
    type,
    productPrice
  );
  await result.json().then(async (response) => {
    if (response.status === 'success') {
      const tx = JSON.parse(response.result);
      const txReceipt = await provider.waitForTransaction(tx.txHash);
      output = { txReceipt };
    } else {
      output = response.message;
    }
  });

  return output;
}

export async function createCollectionByCaller(collection, config) {
  let walletType = await ls_GetWalletType();
  let signer;
  if (walletType === 'metamask') {
    if (!window.ethereum) throw new Error(`User wallet not found`);
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    signer = userProvider.getSigner();
  } else if (walletType === 'magicwallet') {
    signer = etherMagicProvider.getSigner();
  }
  const from = await signer.getAddress();

  let chainId = ls_GetChainID();
  NETWORKS[Number(chainId)]?.masterMembershipCollection;
  let ERC721MasterCopy = NETWORKS[chainId]?.CreateCollectionERC721MasterCopy;
  let ERC1155MasterCopy = NETWORKS[chainId]?.CreateCollectionERC1155MasterCopy;
  let platformFeeManager = NETWORKS[Number(chainId)]?.PlatformFeeManager;
  console.log(config);
  const metaArgs = {
    metadata: {
      defaultAdmin: from,
      name: config?.deploymentConfig?.name,
      symbol: config?.deploymentConfig?.symbol,
      contractURI: '',
      baseURI: config?.runtimeConfig?.nftFolderHash
        ? `${config?.runtimeConfig?.baseURI}${config?.runtimeConfig?.nftFolderHash}`
        : '',
      royaltyRecipient: config?.runtimeConfig?.royaltiesAddress,
      royaltyBps: config?.runtimeConfig?.royaltiesBps,
      primarySaleRecipient: from,
      ...(config?.deploymentConfig?.collection_standard === 'ERC721' && {
        floorPrice: ethers.utils.parseUnits(
          config?.runtimeConfig?.basePrice?.toString(),
          'ether'
        ),
        maxSupply: config?.runtimeConfig?.totalSupply,
        initialSupply: config?.runtimeConfig?.numberOfNFTNow
          ? config?.runtimeConfig?.numberOfNFTNow
          : 0,
      }),
      platformFeeManager: platformFeeManager,
    },
    masterCopy:
      config?.deploymentConfig?.collection_standard === 'ERC721'
        ? ERC721MasterCopy
        : ERC1155MasterCopy,
  };
  console.log(metaArgs);
  let response;

  let tx;
  tx =
    config?.deploymentConfig?.collection_standard === 'ERC721'
      ? await collection.connect(signer)?.DeployERC721(metaArgs)
      : await collection.connect(signer)?.DeployERC1155(metaArgs);
  response = await tx.wait(1);
  // }
  console.log('Res: ', response);
  return {
    txReceipt: {
      blockNumber: response.blockNumber,
      transactionHash: response.transactionHash,
    },
  };
}
