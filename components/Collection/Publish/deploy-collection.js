import { ethers } from 'ethers';
import { createInstance } from 'config/ABI/forwarder';
import { signMetaTxRequest } from 'util/smartcontract/signer';
import { NETWORKS } from 'config/networks';
import { ls_GetChainID } from 'util/ApplicationStorage';

async function sendMetaTx(
  collection,
  provider,
  signer,
  config,
  type,
  productPrice
) {
  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  let chainId = ls_GetChainID();
  let minimalForwarder = NETWORKS[chainId]?.forwarder;
  let masterCopyCollection = NETWORKS[chainId]?.masterCopyCollection;
  let masterMembershipCollection =
    NETWORKS[Number(chainId)]?.masterMembershipCollection;

  let webhook = NETWORKS[Number(chainId)]?.webhook;

  const args = {
    isCollection: true,
    collection: {
      deployConfig: {
        name: config?.deploymentConfig?.name,
        symbol: config?.deploymentConfig?.symbol,
        owner: from,
        masterCopy:
          type === 'membership'
            ? masterMembershipCollection
            : masterCopyCollection,
      },
      runConfig: {
        baseURI: config?.runtimeConfig?.baseURI,
        royaltiesBps: config?.runtimeConfig?.royaltiesBps,
        royaltyAddress: config?.runtimeConfig?.royaltiesAddress,
        maxSupply: type === 'product' ? config?.runtimeConfig?.totalSupply : 0,
        floorPrice: ethers.utils.parseUnits(
          type === 'product' ? productPrice.toString() : '0',
          'ether'
        ),
      },
    },
    forwarder: minimalForwarder,
  };

  const data = collection.interface.encodeFunctionData(
    type === 'membership' ? 'createMembershipProxy' : 'createCollectionProxy',
    [args]
  );
  const to = collection.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
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
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = userProvider.getSigner();

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
