import { ethers } from "ethers";
import axios from "axios";
import * as Forwarder from "eth/forwarder";

class RequestSigner {
  constructor(payload) {
    const { provider, from, to, contract, functionName, functionPayload } =
      payload;

    this.signature = null;

    // Signer data
    this._provider = provider;
    this._signer = provider.getSigner();
    // Request data
    this._from = from;
    this._to = to;
    // Functiond data
    this._contract = contract;
    this._functionName = functionName;
    this._functionPayload = functionPayload;

    // Local states
    this._functionData = null;
    this._nonce = null;
    this._forwarder = Forwarder.createInstance(provider);
  }

  get request() {
    return {
      value: 0,
      gas: 1e6,
      nonce: this._nonce?.toString(),
      from: this._from,
      to: this._to,
      data: this._functionData,
    };
  }

  async signRequest() {
    await this._getFromAddress();
    await this._getToAddress();
    await this._getFunctionData();
    await this._signData();
  }

  async _getFromAddress() {
    if (this._from == null) {
      this._from = await this._signer.getAddress();
    }
  }

  async _getToAddress() {
    if (this._to == null) {
      this._to = this._contract.address;
    }
  }

  async _getFunctionData() {
    this._functionData = this._contract.interface.encodeFunctionData(
      this._functionName,
      this._functionPayload
    );
  }

  async _createForwarderData() {
    const chainId = await this._forwarder.provider
      .getNetwork()
      .then((n) => n.chainId);
    this._nonce = await this._forwarder.getNonce(this._from);

    return {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        ForwardRequest: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "gas", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
      },
      domain: {
        chainId,
        name: "MinimalForwarder",
        version: "0.0.1",
        verifyingContract: this._forwarder.address,
      },
      primaryType: "ForwardRequest",
      message: this.request,
    };
  }

  async _signData() {
    try {
      const signData = await this._createForwarderData();
      this.signature = await this._signer.provider.send(
        "eth_signTypedData_v4",
        [this._from, JSON.stringify(signData)]
      );
    } catch (err) {
      console.error(err);
    }
  }
}

export default function useSendTransaction() {
  const getProvider = async () => {
    if (!window.ethereum) {
      throw new Error(`User wallet not found`);
    }

    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    return provider;
  };

  const signRequest = async (payload) => {
    const { from, to, contract, functionName, functionPayload } = payload;

    const provider = await getProvider();
    const requestSigner = new RequestSigner({
      provider,
      from,
      to,
      contract,
      functionName,
      functionPayload,
    });
    await requestSigner.signRequest();

    return {
      signature: requestSigner.signature,
      request: requestSigner.request,
    };
  };

  const sendToRelayer = async ({ request, signature }) => {
    const response = await axios.post(process.env.REACT_APP_WEBHOOK_URL, {
      request,
      signature,
    });
    const transaction = JSON.parse(response.result);
    return transaction;
  };

  const waitTransactionResult = async (transaction) => {
    const provider = await getProvider();
    return provider.waitForTransaction(transaction.txHash);
  };

  const sendTransaction = async (payload) => {
    const { request, signature } = await signRequest(payload);
    return sendToRelayer({ request, signature });
  };

  return { sendTransaction, waitTransactionResult };
}
