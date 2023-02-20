import Modal from 'components/Commons/Modal';
import { useEffect, useState } from 'react';
import {
  getCollectionDetailsById,
  publishCollection,
} from 'services/collection/collectionService';
import { useDispatch, useSelector } from 'react-redux';
import deploySuccessSvg from 'assets/images/modal/deploySuccessSvg.svg';
import { createProvider } from 'util/smartcontract/provider';
import { createInstance } from 'config/ABI/genericProxyFactory';
import { createCollection } from './deploy-collection';
import Image from 'next/image';
import { event } from "nextjs-google-analytics";

const DeployingCollectiontModal = ({
  handleClose,
  errorClose,
  show,
  buttomText,
  tnxData,
  collectionId,
  collectionName,
  collectionSymbol,
  collectionType,
  publishStep,
  productPrice,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusStep, setStatusStep] = useState(1);
  const [funcId, setFuncId] = useState('');
  const [step, setStep] = useState(publishStep ? publishStep : 1);

  const [txnData, setTxnData] = useState();

  useEffect(() => {
    if (txnData) {
      publishThisCollection(txnData);
    }
  }, [txnData]);

  useEffect(() => {
    if (step === 1) {
      publishThisCollection();
    }
  }, []);

  function publishThisCollection(data) {
    event("publish_collection", { category: "collection" });
    setIsLoading(true);
    let payload = new FormData();
    if (data) {
      payload.append('transaction_hash', data.transactionHash);
    }

    publishCollection(collectionId, txnData ? payload : null)
      .then((res) => {
        setIsLoading(false);
        if (res.code === 0) {
          if (txnData) {
            setStatusStep(2);
            setFuncId(res.function_uuid);
            if (res?.function?.status === 'success') {
              setStep(2);
            } else if (res?.function?.status === 'failed') {
              setTxnData();
              errorClose(res?.function?.message);
            }
          } else {
            handleSmartContract(res.config);
          }
        } else {
          errorClose(res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        errorClose('Failed to publish collection. Please try again later');
      });
  }

  function recheckStatus() {
    setTimeout(() => {
      getCollectionDetail();
    }, 25000);
  }

  function getCollectionDetail() {
    setIsLoading(true);
    getCollectionDetailsById({ id: collectionId })
      .then((res) => {
        if (res.code === 0) {
          const collection = res.collection;
          if (collection && collection['status'] === 'published') {
            setStep(2);
          }

          if (collection && collection['status'] === 'draft') {
            publishThisCollection();
          }
          if (collection && collection['status'] === 'publishing') {
            recheckStatus();
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  const handleSmartContract = async (config) => {
    setStatusStep(1);
    try {
      const provider = createProvider();
      const collectionContract = createInstance(provider);
      const response = await createCollection(
        collectionContract,
        provider,
        config,
        collectionType,
        productPrice
      );
      let hash;
      if (response?.txReceipt) {
        hash = response.txReceipt;
        let data = {
          transactionHash: hash.transactionHash,
          block_number: hash.blockNumber,
        };
        setTxnData(data);
      } else {
        errorClose(response);
      }
    } catch (err) {
      errorClose(err.message);
    }
  };

  return (
    <Modal
      width={600}
      show={show}
      showCloseIcon={false}
      handleClose={() => handleClose(false)}
    >
      <div className={`text-center md:my-6 ${isLoading ? 'loading' : ''}`}>
        {step === 1 && (
          <div className='md:mx-16'>
            <div className='font-black text-[16px]'>
              Please wait we’re publishing your Collection
            </div>
            <div className='overflow-hidden rounded-full h-4 w-full mt-4  md:mt-12 mb-8 relative animated fadeIn'>
              <div className='animated-process-bar'></div>
            </div>
            {statusStep === 1 && (
              <p className='text-center'>Creating the contract</p>
            )}
            {statusStep === 2 && (
              <p className='text-center'>
                Contract created. Now, we are publishing it.
              </p>
            )}
          </div>
        )}
        {step === 2 && (
          <>
            <Image
              className='h-[200px] md:w-[300px] mx-auto'
              src={deploySuccessSvg}
              alt=''
              width={300}
              height={200}
            />
            <div className='md:mx-16'>
              <div className='font-black text-[16px]'>
                You have successfully published your collection!
              </div>
              <div className='flex justify-center mt-4 md:mt-[30px]'>
                <button
                  className='ml-4 bg-primary-900/[0.20] text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]'
                  onClick={() => handleClose(false)}
                >
                  Back
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DeployingCollectiontModal;
