import Modal from 'components/Commons/Modal';
import { useEffect, useState } from 'react';
import { publishProject } from 'services/project/projectService';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationData } from 'redux/notification';
import deploySuccessSvg from 'assets/images/modal/deploySuccessSvg.svg';
import { createDAO } from './deploy-dao';
import { createProvider } from 'util/smartcontract/provider';
import { createInstance } from 'config/ABI/genericProxyFactory';

const DeployingProjectModal = ({
  handleClose,
  show,
  projectId,
  publishStep,
  errorClose,
}) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(publishStep ? publishStep : 0);
  const [statusStep, setStatusStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const projectDeploy = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [deployStatus, setDeployStatus] = useState({
    projectId: '',
    etherscan: '',
    function_uuid: '',
    fn_name: '',
    fn_status: '',
    message: '',
    step: 1,
  });
  const provider = createProvider();
  const dao = createInstance(provider);
  const [txnData, setTxnData] = useState();

  useEffect(() => {
    if (publishStep >= 1) {
      publishThisProject();
    }
  }, []);

  useEffect(() => {
    if (txnData) {
      publishThisProject(txnData);
    }
  }, [txnData]);

  function publishThisProject(transactionData) {
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
              setTxnData();
              errorClose(res?.function?.message);
            }

            dispatch(getNotificationData(deployData));
            setTxnData();
          } else {
            handleSmartContract(
              res?.config?.name,
              res?.config?.treasury_address,
              res?.config?.blockchain
            );
          }
        } else {
          setIsLoading(false);
          setTxnData();
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
      const response = await createDAO(
        dao,
        provider,
        name,
        treasuryAddress,
        chainId
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
            <img
              className='h-[200px] md:w-[300px] mx-auto'
              src={deploySuccessSvg}
              alt=''
            />
            <div className='md:mx-16'>
              <h5>Your DAO is published successfully!</h5>
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
