import { useEffect, useMemo, useRef, useState } from 'react';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import * as collectionService from "services/collection/collectionService";
import * as RoyaltySplitter from 'eth/royalty-splitter';
import useSendTransaction from "./useSendTransaction";
import { selectNotificationByUuid } from 'store/selector';
import {getNotificationData} from 'Slice/notificationSlice';

/**
 * @param {object} payload - Hook payload
 * @param {object} payload.collection - Collection data
 * @param {object} payload.provider - ethers.js Web3Provider
 */
export default function usePublishRoyaltySplitter(payload = {}) {
  const {
    collection,
    splitters,
    onUpdateStatus = () => {},
  } = payload;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(1);
  const [functionUuid, setFunctionUuid] = useState();
  const provider = useRef();
  const contract = useRef();
  const transaction = useRef();
  // Global states
  const notificationData = useSelector(selectNotificationByUuid(functionUuid));
  // Transaction result states
  const txReceipt = useRef();
  const royaltySplitterContractAddress = useRef();
  const listener = useRef();
  const { sendTransaction, waitTransactionResult } = useSendTransaction();

  useEffect(() => {
    const init = async () => {
      provider.current = await getProvider();
      contract.current = RoyaltySplitter.createInstance(provider.current);
    };

    init();
  }, []);

  useEffect(() => {
    if (notificationData == null || notificationData.data == null) {
      return;
    }

    const eventData = JSON.parse(notificationData.data);
    onUpdateStatus(eventData.fn_status);
    setIsLoading(false);
  }, [onUpdateStatus, notificationData]);

  const getProvider = async () => {
    if (!window.ethereum) {
      throw new Error(`User wallet not found`);
    };

    await window.ethereum.enable();
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const userNetwork = await newProvider.getNetwork();

    if (userNetwork.chainId !== 5) {
      throw new Error(`Please switch to Goerli for signing`);
    }

    return newProvider;
  };

  const canPublish = useMemo(() => {
    if (collection == null) {
      return false;
    }

    return (
      collection.status === 'published'
      && collection.royalty_splitter.status !== 'published'
    );
  }, [collection]);

  const canCallPublishApi = () => {
    return collection.royalty_splitter.status === 'draft';
  }

  const callPublishApi = async () => {
    if (!canCallPublishApi()) {
      return;
    }

    const royaltySplitterId = collection.royalty_splitter.id;
    await collectionService.publishRoyaltySplitter(royaltySplitterId);
  };

  const subscribeOnChainEvent = async () => {
    return new Promise((resolve, reject) => {
      listener.current = async (args) => {
        try {
          // NOTE: this is a hack, don't ask me, ask our current "Application Lead"
          if (transaction.current == null) {
            return;
          }

          royaltySplitterContractAddress.current = args;
          resolve();
        } catch(err) {
          reject(err);
        }
      }

      contract.current.on(contract.current.filters.SplitterCreated(), listener.current);
    });
  }

  const updateOffChainData = async () => {
    const royaltySplitterId = collection.royalty_splitter.id;
    const payload = new FormData();
    payload.append('transaction_hash', txReceipt.current.transactionHash);
    payload.append('contract_address', royaltySplitterContractAddress.current);
    payload.append('block_number', txReceipt.current.blockNumber)
    return collectionService.publishRoyaltySplitter(royaltySplitterId, payload);
  };

  const sendOnChainTransaction = async () => {
    const functionPayload = [
      {
        receivers: splitters.map((spliter) => spliter.user_eoa),
        shares: splitters.map((splitter) => splitter.royalty_percent),
        collection: collection.contract_address,
      }
    ];
    return sendTransaction({
      contract: contract.current,
      functionName: 'cloneContract',
      functionPayload,
    });
  };

  const cleanUp = () => {
    contract.current.off('SplitterCreated', listener.current);
  }

  const subscribeWebsocket = (response) => {
    setFunctionUuid(response.function_uuid);
    dispatch(getNotificationData({
      projectId: collection.project_uid,
      function_uuid: response.function_uuid,
    }));
  };

  const publish = async () => {
    try {
      if (!canPublish) {
        return;
      }

      setIsLoading(true);
      await callPublishApi();
      const subscribeEventPromise = subscribeOnChainEvent();
      transaction.current = await sendOnChainTransaction();
      txReceipt.current = await waitTransactionResult(transaction.current);
      await subscribeEventPromise;
      const publishResponse = await updateOffChainData();
      setStatus(2);
      subscribeWebsocket(publishResponse);
    } catch (err) {
      setIsLoading(false);
      setStatus(1);
      throw err;
    } finally {
      cleanUp();
    }
  };

  return {
    status,
    isLoading,
    canPublish,
    publish,
  };
}
