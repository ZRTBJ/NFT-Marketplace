import Modal from 'components/Commons/Modal';
import { useEffect, useState } from 'react';
import { publishProject } from 'services/project/projectService';
import deploySuccessSvg from 'assets/images/modal/deploySuccessSvg.svg';
import { createDAO, createDAOByCaller } from './deploy-dao';
import { createProvider } from 'util/smartcontract/provider';
import { createInstance } from 'config/ABI/genericProxyFactory';
import Image from 'next/image';
import { event } from 'nextjs-google-analytics';
import Config from 'config/config';
import TagManager from 'react-gtm-module';

const DeployingProjectModal = ({
  handleClose,
  show,
  projectId,
  publishStep,
  errorClose,
}) => {
  const [step, setStep] = useState(publishStep ? publishStep : 0);
  const [statusStep, setStatusStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const provider = createProvider();
  const dao = createInstance(provider);
  const gaslessMode = Config.GASLESS_ENABLE;

  useEffect(() => {
    if (publishStep >= 1) {
      console.log(publishStep);
      publishThisProject();
    }
  }, [publishStep]);

  function publishThisProject(transactionData) {
    event('publish_dao', { category: 'dao' });

    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'dao',
        pageTitle: 'publish_dao',
      },
    });

    setIsLoading(true);
    let payload = new FormData();
    if (transactionData) {
      payload.append('transaction_hash', transactionData.transactionHash);
    }

    publishProject(projectId, transactionData ? payload : null)
      .then((res) => {
        setIsLoading(false);
        if (res && res?.code === 0) {
          if (transactionData) {
            setStatusStep(2);
            const deployData = {
              projectId: projectId,
              etherscan: transactionData,
              function_uuid: res.function_uuid,
              data: '',
            };
            if (res?.function?.status === 'success') {
              setStep(2);
            } else if (res?.function?.status === 'failed') {
              errorClose(res?.function?.message);
            }
          } else {
            handleSmartContract(
              res?.config?.name,
              res?.config?.treasury_address,
              res?.config?.blockchain
            );
          }
        } else {
          setIsLoading(false);
          errorClose(res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        errorClose('Failed to publish project. Please try agaon later');
      });
  }

  const handleSmartContract = async (name, treasuryAddress, chainId) => {
    setStatusStep(1);
    try {
      let response;
      if (gaslessMode === 'true') {
        response = await createDAO(
          dao,
          provider,
          name,
          treasuryAddress,
          chainId
        );
      } else {
        response = await createDAOByCaller(
          dao,
          provider,
          name,
          treasuryAddress,
          chainId
        );
      }

      let hash;
      if (response?.txReceipt) {
        hash = response.txReceipt;
        let data = {
          transactionHash: hash.transactionHash,
          block_number: hash.blockNumber,
        };
        publishThisProject(data);
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
            <h5>Please wait we’re publishing your DAO</h5>
            <div className='overflow-hidden rounded-full h-4 w-full mt-12 mb-8 relative animated fadeIn'>
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
            />
            <div className='md:mx-16'>
              <p className='text-[20px] font-bold text-txtblack'>
                Your DAO is published successfully!
              </p>
              <p className='text-[#9499AE] mt-[12px]'>
                Now you can publish your collection!
              </p>
              <div className='flex justify-center mt-4 md:mt-[30px]'>
                <button
                  className='btn contained-button btn-sm'
                  onClick={() => handleClose(false)}
                >
                  Publish Collection
                </button>
                <button
                  className='ml-4 bg-primary-50 text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]'
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

export default DeployingProjectModal;
