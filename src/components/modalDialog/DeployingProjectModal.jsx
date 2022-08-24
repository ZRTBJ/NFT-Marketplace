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
  getProjectDetailsById,
  publishFundTransfer,
  publishProject,
} from 'services/project/projectService';
import { SendTransactionTorus } from 'util/Torus';
import { getWalletType } from 'util/ApplicationStorage';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAuthState } from 'Context';
import { getNotificationData } from 'Slice/notificationSlice';
import deploySuccessSvg from 'assets/images/modal/deploySuccessSvg.svg';

const DeployingProjectModal = ({
  handleClose,
  errorClose,
  show,
  buttomText,
  tnxData,
  projectId,
  publishStep,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const btnText = buttomText ? buttomText : 'View on Polygonscan';
  const selectedWallet = getWalletType();
  const [step, setStep] = useState(publishStep ? publishStep : 0);
  const [isLoading, setIsLoading] = useState(false);
  const [tnxHash, setTnxHash] = useState('');
  const context = useAuthState();
  const [userId, setUserId] = useState(context ? context.user : '');
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

  useEffect(() => {
    const projectDeployStatus = projectDeploy.find(
      (x) => x.projectId === projectId
    );
    if (
      projectDeployStatus &&
      projectDeployStatus.projectId &&
      projectDeployStatus.data &&
      projectDeployStatus.data.length > 5
    ) {
      const statusData = JSON.parse(projectDeployStatus.data);
      const status = {
        projectId: projectDeployStatus.projectId,
        etherscan: projectDeployStatus.etherscan,
        function_uuid: projectDeployStatus.function_uuid,
        fn_name: statusData['fn_name'],
        fn_status: statusData['fn_status'],
        message: statusData?.fn_response_data?.message,
        step: statusData?.fn_response_data?.step,
      };

      setDeployStatus(status);
      if (statusData['fn_status'] === 'success') {
        setStep(2);
      }
    } else if (projectDeployStatus && projectDeployStatus.projectId) {
      const status = {
        projectId: projectDeployStatus.projectId,
        etherscan: projectDeployStatus.etherscan,
        function_uuid: projectDeployStatus.function_uuid,
        fn_name: '',
        fn_status: 'pending',
        message: '',
        step: 1,
      };
      setDeployStatus(status);
    } else {
      const status = {
        projectId: '',
        etherscan: '',
        function_uuid: '',
        fn_name: '',
        fn_status: 'pending',
        message: '',
        step: 1,
      };
      setDeployStatus(status);
    }
  }, [projectDeploy]);

  useEffect(() => {
    if (publishStep >= 1) {
      projectDetails();
    }
  }, []);

  async function transferFund() {
    let transactionHash = '';
    setIsLoading(true);
    if (selectedWallet === 'metamask') {
      transactionHash = await SendTransactionMetaMask(tnxData);
    } else if (selectedWallet === 'torus') {
      transactionHash = await SendTransactionTorus(tnxData);
    } else {
      alert('Something went wrong. Please logout and login again...');
    }
    const jsonTnxData = JSON.stringify(tnxData);
    if (transactionHash && transactionHash.length > 5) {
      setTnxHash(transactionHash);
      const request = new FormData();
      request.append('status', 'success');
      request.append('hash', transactionHash);
      request.append('data', jsonTnxData);

      publishFundTransfer(projectId, request)
        .then((res) => {
          setIsLoading(false);
          if (res.code === 0) {
            setStep(1);
            publishThisProject(transactionHash);
          } else {
          }
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }

  function projectContractDeploy(etherscan) {
    setIsLoading(true);
    contractDeploy(projectId)
      .then((res) => {
        setIsLoading(false);
        if (res.code === 0) {
          console.log(res);
          const deployData = {
            projectId: projectId,
            etherscan: etherscan ? etherscan : tnxHash,
            function_uuid: res.function_uuid,
            data: '',
          };
          dispatch(getNotificationData(deployData));
          recheckStatus();
        } else {
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  function publishThisProject(etherscan) {
    setIsLoading(true);
    publishProject(projectId)
      .then((res) => {
        setIsLoading(false);
        if (res && res.code && res.code === 0) {
          const deployData = {
            projectId: projectId,
            etherscan: etherscan ? etherscan : tnxHash,
            function_uuid: res.function_uuid,
            data: '',
          };
          dispatch(getNotificationData(deployData));
          recheckStatus();
        } else {
          try {
            errorClose(res.message);
          } catch {}
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  function recheckStatus() {
    setTimeout(() => {
      if (deployStatus && deployStatus.step === 0) {
        projectDetails();
      }
    }, 45000);
  }

  function projectDetails() {
    setIsLoading(true);
    getProjectDetailsById({ id: projectId })
      .then((res) => {
        if (res.code === 0) {
          const project = res.project;
          if (project && project.deploys && project.deploys.length > 0) {
            try {
              let projectDstatus = {
                projectId: '',
                etherscan: '',
                function_uuid: '',
                fn_name: '',
                fn_status: '',
                message: '',
                step: 1,
              };
              for (let deploy of project.deploys) {
                if (deploy.type === 'fund_transfer') {
                  if (deploy.hash && deploy.hash.length > 2) {
                    setTnxHash(deploy.hash);
                  }
                } else if (deploy.type === 'publish') {
                  projectDstatus = {
                    projectId: project.id,
                    etherscan: tnxHash,
                    function_uuid: deploy.fn_uuid,
                    fn_name: deploy.type,
                    fn_status: deploy.status,
                    message: deploy.message,
                    step: deploy.step,
                  };
                  if (deploy.step === 2) {
                    if (deploy.status === 'success') {
                      setStep(2);
                    }
                    break;
                  }
                }
              }

              setDeployStatus({
                ...deployStatus,
                projectId: projectDstatus.projectId,
                fn_name: projectDstatus.fn_name,
                fn_status: projectDstatus.fn_status,
                step: projectDstatus.step,
              });
            } catch (ex) {
              // debugger;
            }
          }
          if (project && project['project_status'] === 'draft') {
            publishThisProject('noscan');
          }
          if (project && project['project_status'] === 'publishing') {
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
            <h1>Please wait we’re publishing your DAO</h1>
            <div className='overflow-hidden rounded-full h-4 w-full mt-12 mb-8 relative animated fadeIn'>
              <div className='animated-process-bar'></div>
            </div>
            {deployStatus.step === 1 && (
              <div className='text-center'>Erc20 Deployment</div>
            )}
            {deployStatus.step === 2 && (
              <div className='text-center'>ProjectToken Deployment</div>
            )}
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
              <h1>You finish publishing your DAO!</h1>
              <div className='text-[#9499AE] mt-[12px]'>
                Now you can publish your collection!
              </div>
              <div className='flex justify-center mt-[30px]'>
                <button
                  className='btn text-white-shade-900 bg-primary-900 btn-sm'
                  onClick={() => handleClose(false)}
                >
                  Publish Collection
                </button>
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

export default DeployingProjectModal;
