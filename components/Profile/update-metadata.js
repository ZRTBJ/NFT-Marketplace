import { ethers } from 'ethers';
import { createInstance } from 'config/ABI/forwarder';
import { signMetaTxRequest } from 'util/smartcontract/signer';
import { NETWORKS } from 'config/networks';
import { ls_GetChainID, ls_GetWalletType } from 'util/ApplicationStorage';
import { etherMagicProvider } from 'config/magicWallet/magic';

async function sendMetaTx(contract, provider, signer, nftInfo) {
  const forwarder = createInstance(provider);
  try {
    const from = await signer.getAddress();
    const data = contract.interface.encodeFunctionData('updateTokenUri', [
      nftInfo.token_id,
      nftInfo.metadata_url,
      true,
    ]);
    const to = contract.address;

    const request = await signMetaTxRequest(signer.provider, forwarder, {
      to,
      from,
      data,
    });

    let chainId = ls_GetChainID();
    let webhook = NETWORKS[chainId]?.webhook;

    return fetch(webhook, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {}
}

export async function updateMetadata(
  collection,
  provider,
  nftInfo,
  wagmiSigner
) {
  return new Promise(async (resolve, reject) => {
    try {
      let tnxHash = '';
      let output;
      let walletType = await ls_GetWalletType();
      let signer;
      if (walletType === 'metamask') {
        if (!window.ethereum) throw new Error(`User wallet not found`);
        await window.ethereum.enable();
        const userProvider = new ethers.providers.Web3Provider(window.ethereum);
        signer = userProvider.getSigner();
      } else if (walletType === 'magicwallet') {
        signer = etherMagicProvider.getSigner();
      } else if (walletType === 'walletconnect') {
        signer = wagmiSigner;
      }
      const result = await sendMetaTx(collection, provider, signer, nftInfo);
      if (result) {
        await result.json().then(async (response) => {
          tnxHash = JSON.parse(response.result);
        });
        if (tnxHash !== '') {
          await provider.waitForTransaction(tnxHash.txHash);
          output = tnxHash.txHash;
          resolve(output);
        } else {
          reject('Could not found the Transaction Hash');
        }
      } else if (!result) {
        reject('User canceled the event');
      }
    } catch (error) {
      reject(error);
    }
  });
}
