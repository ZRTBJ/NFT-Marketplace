import ico_gas from 'assets/images/projectEdit/ico_gas.svg';
import ico_matic from 'assets/images/projectEdit/ico_matic.svg';
import IconSuccess from 'assets/images/modal/success/success_modal_img.svg';
import Modal from '../Modal';
import { Step, Stepper } from 'react-form-stepper';
import { useEffect, useState } from 'react';
import { produceWithPatches } from 'immer';
import { SendTransactionMetaMask } from 'util/metaMaskWallet';
import {
  contractDeploy,
  publishFundTransfer,
} from 'services/project/projectService';
import {
  getCollectionDetailsById,
  publishCollection,
} from 'services/collection/collectionService';
import { SendTransactionTorus } from 'util/Torus';
import { getWalletType } from 'util/ApplicationStorage';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAuthState } from 'Context';
import { getNotificationData } from 'Slice/notificationSlice';
import deploySuccessSvg from 'assets/images/modal/deploySuccessSvg.svg';

const DeployingCollectiontModal = ({
  handleClose,
  errorClose,
  show,
  buttomText,
  tnxData,
  collectionId,
  publishStep,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const btnText = buttomText ? buttomText : 'View on Polygonscan';
  const selectedWallet = getWalletType();
  const [isLoading, setIsLoading] = useState(false);
  const [tnxHash, setTnxHash] = useState('');
  const context = useAuthState();
  const [userId, setUserId] = useState(context ? context.user : '');
  const [funcId, setFuncId] = useState('');
  const [step, setStep] = useState(publishStep ? publishStep : 1);
  const [publishedData, setPublishedData] = useState();
  const collectionDeploy = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );

  useEffect(() => {
    const collectionDeployStatus = collectionDeploy.find(
      (x) => x.function_uuid === funcId
    );

    if (
      collectionDeployStatus &&
      collectionDeployStatus.function_uuid &&
      collectionDeployStatus.data
    ) {
      const statusData = JSON.parse(collectionDeployStatus.data);
      setPublishedData(statusData);

      if (statusData['fn_status'] === 'success') {
        setStep(2);
      } else {
        recheckStatus();
      }
    }
  }, [collectionDeploy]);

  useEffect(() => {
    if (step === 1) {
      publishThisCollection();
    }
  }, []);

  // async function transferFund() {
  //   let transactionHash = '';
  //   setIsLoading(true);
  //   if (selectedWallet === 'metamask') {
  //     transactionHash = await SendTransactionMetaMask(tnxData);
  //   } else if (selectedWallet === 'torus') {
  //     transactionHash = await SendTransactionTorus(tnxData);
  //   } else {
  //     alert('Something went wrong. Please logout and login again...');
  //   }
  //   const jsonTnxData = JSON.stringify(tnxData);
  //   if (transactionHash && transactionHash.length > 5) {
  //     setTnxHash(transactionHash);
  //     const request = new FormData();
  //     request.append('status', 'success');
  //     request.append('hash', transactionHash);
  //     request.append('data', jsonTnxData);

  //     publishFundTransfer(collectionId, request)
  //       .then((res) => {
  //         setIsLoading(false);
  //         if (res.code === 0) {
  //           setStep(1);
  //           publishThisCollection(transactionHash);
  //         } else {
  //         }
  //       })
  //       .catch((err) => {
  //         setIsLoading(false);
  //       });
  //   } else {
  //     setIsLoading(false);
  //   }
  // }

  // function projectContractDeploy(etherscan) {
  //   setIsLoading(true);
  //   contractDeploy(collectionId)
  //     .then((res) => {
  //       setIsLoading(false);
  //       if (res.code === 0) {
  //         console.log(res);
  //         const deployData = {
  //           collectionId: collectionId,
  //           etherscan: etherscan ? etherscan : tnxHash,
  //           function_uuid: res.function_uuid,
  //           data: '',
  //         };
  //         dispatch(getNotificationData(deployData));
  //         recheckStatus();
  //       } else {
  //       }
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //     });
  // }

  function publishThisCollection() {
    setIsLoading(true);
    publishCollection(collectionId)
      .then((res) => {
        setIsLoading(false);
        if (res.code === 0) {
          console.log(res);
          const deployData = {
            function_uuid: res.function_uuid,
            data: '',
          };
          setFuncId(res.function_uuid);
          dispatch(getNotificationData(deployData));
        } else {
          errorClose(res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
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

  return (
    <Modal
      width={800}
      show={show}
      showCloseIcon={false}
      handleClose={() => handleClose(false)}
    >
      <div className={`text-center my-6 ${isLoading ? 'loading' : ''}`}>
        {step === 1 && (
          <div className='mx-16'>
            <h1>Please wait we’re publishing your Collection</h1>
            <div className='overflow-hidden rounded-full h-4 w-full mt-12 mb-8 relative animated fadeIn'>
              <div className='animated-process-bar'></div>
            </div>
            {/* {deployStatus.step === 1 && (
              <div className='text-center'>Erc20 Deployment</div>
            )}
            {deployStatus.step === 2 && (
              <div className='text-center'>ProjectToken Deployment</div>
            )} */}
            <div className='flex justify-center mt-[30px]'>
              <button
                className='btn text-white-shade-900 bg-primary-900 btn-sm'
                onClick={() => handleClose(false)}
              >
                Cancel Publishing
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <>
            <img
              className='h-[200px] w-[300px] mx-auto'
              src={deploySuccessSvg}
              alt=''
            />
            <div className='mx-16'>
              <h1>You have successfully published your collection!</h1>
              <div className='flex justify-center mt-[30px]'>
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
