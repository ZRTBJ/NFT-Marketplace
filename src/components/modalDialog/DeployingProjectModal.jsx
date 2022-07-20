import ico_gas from "assets/images/projectEdit/ico_gas.svg";
import ico_matic from "assets/images/projectEdit/ico_matic.svg";
import IconSuccess from "assets/images/modal/success/success_modal_img.svg";
import Modal from "../Modal";
import { Step, Stepper } from "react-form-stepper";
import { useEffect, useState } from "react";
import { produceWithPatches } from "immer";
import { SendTransactionMetaMask } from "util/metaMaskWallet";
import {
  contractDeploy,
  getProjectDetailsById,
  publishFundTransfer,
  publishProject,
} from "services/project/projectService";
import { SendTransactionTorus } from "util/Torus";
import { getWalletType } from "util/ApplicationStorage";
import { useDispatch, useSelector } from "react-redux";
import { getProjectDeploy } from "Slice/projectSlice";
import { useHistory } from "react-router-dom";
import { useAuthState } from "Context";

const DeployingProjectModal = ({
  handleClose,
  show,
  buttomText,
  tnxData,
  projectId,
  publishStep,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const btnText = buttomText ? buttomText : "View on Polygonscan";
  const selectedWallet = getWalletType();
  const [step, setStep] = useState(publishStep ? publishStep : 0);
  const [isLoading, setIsLoading] = useState(false);
  const [tnxHash, setTnxHash] = useState("");
  const context = useAuthState();
  const [userId, setUserId] = useState(context ? context.user : "");
  const projectDeploy = useSelector((state) =>
    state?.projects?.projectDeploy ? state?.projects?.projectDeploy : []
  );
  const [deployStatus, setDeployStatus] = useState({
    projectId: "",
    etherscan: "",
    function_uuid: "",
    fn_name: "",
    fn_status: "",
    message: "",
    step: 0,
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
        fn_name: statusData["fn_name"],
        fn_status: statusData["fn_status"],
        message: statusData["fn_response_data"]["message"],
        step: statusData["fn_response_data"]["step"],
      };

      setDeployStatus(status);
      if (statusData["fn_status"] === "success") {
        setStep(2);
      }
    } else if (projectDeployStatus && projectDeployStatus.projectId) {
      const status = {
        projectId: projectDeployStatus.projectId,
        etherscan: projectDeployStatus.etherscan,
        function_uuid: projectDeployStatus.function_uuid,
        fn_name: "",
        fn_status: "pending",
        message: "",
        step: 0,
      };
      setDeployStatus(status);
    } else {
      const status = {
        projectId: "",
        etherscan: "",
        function_uuid: "",
        fn_name: "",
        fn_status: "pending",
        message: "",
        step: 0,
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
    let transactionHash = "";
    setIsLoading(true);
    if (selectedWallet === "metamask") {
      transactionHash = await SendTransactionMetaMask(tnxData);
    } else if (selectedWallet === "torus") {
      transactionHash = await SendTransactionTorus(tnxData);
    } else {
      alert("Something went wrong. Please logout and login again...");
    }
    const jsonTnxData = JSON.stringify(tnxData);
    if (transactionHash && transactionHash.length > 5) {
      setTnxHash(transactionHash);
      const request = new FormData();
      request.append("status", "success");
      request.append("hash", transactionHash);
      request.append("data", jsonTnxData);

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
            data: "",
          };
          dispatch(getProjectDeploy(deployData));
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
        if (res.code === 0) {
          console.log(res);
          const deployData = {
            projectId: projectId,
            etherscan: etherscan ? etherscan : tnxHash,
            function_uuid: res.function_uuid,
            data: "",
          };
          dispatch(getProjectDeploy(deployData));
          recheckStatus();
        } else {
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
                projectId: "",
                etherscan: "",
                function_uuid: "",
                fn_name: "",
                fn_status: "",
                message: "",
                step: 0,
              };
              for (let deploy of project.deploys) {
                if (deploy.type === "fund_transfer") {
                  if (deploy.hash && deploy.hash.length > 2) {
                    setTnxHash(deploy.hash);
                  }
                } else if (deploy.type === "publish") {
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
                    if (deploy.status === "success") {
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
          if (project && project["project_status"] === "publishing") {
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
    <Modal width={800} show={show} handleClose={() => handleClose(false)}>
      <div className={`text-center my-6 ${isLoading ? "loading" : ""}`}>
        <div className="md:mx-4">
          <div className=" md:hidden">
            {step === 0 && (
              <h1>Deplyoing Project...</h1>
            )}

            {step === 1 && (
              <h1>Deploying smartcontract...</h1>
            )}

            {step === 2 && (
              <h1>Done!</h1>
            )}
          </div>
          <div className="hidden md:flex justify-center">
            <div>
              <i className="fa fa-check-square fa-xl" aria-hidden="true"></i>
              <p className="mt-4 text-xs">Fund transfer</p>
            </div>
            <div className="h-4 w-36 bg-[#232032]  mt-1"></div>
            <div>
              <i
                className={`fa fa-check-square fa-xl ${step >= 1 ? "text-white" : "text-gray-700"
                  }`}
                aria-hidden="true"
              ></i>
              <p className="mt-4 text-xs">Smartcontrat deployment</p>
            </div>

            <div className="h-4 w-36 bg-[#232032] mt-1"></div>
            <div>
              <i
                className={`fa fa-check-square fa-xl ${step >= 2 ? "text-white" : "text-gray-700"
                  }`}
                aria-hidden="true"
              ></i>
              <p className="mt-4 text-xs">Completed</p>
            </div>
          </div>
          <div>
            {step === 0 && (
              <div className="py-8">
                <img className="block mx-auto" src={ico_gas} alt="" />
                <div className="text-center my-4">
                  Estimation of total gas required for these transactions.
                </div>
                <div className="my-4 bg-[#232032] md:mx-48 flex flex-row p-6">
                  <div className="mx-2">
                    <img className="block mx-auto" src={ico_matic} alt="" />
                  </div>
                  <div>Complete Deposit</div>
                  <div className="ml-8">
                    <span className="float-right">
                      {tnxData.amount ? tnxData.amount : 0} MATIC
                    </span>
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="py-8 flex justify-center">
                <div className="text-center my-4">
                  <ul className="stepper stepper-vertical">
                    <li
                      className={`stepper-step ${deployStatus.step >= 0
                        ? deployStatus.step === 1 &&
                          deployStatus.fn_status === "failed"
                          ? "stepper-failed"
                          : "stepper-active"
                        : ""
                        }`}
                    >
                      <div className="stepper-head hover:!bg-transparent">
                        <span className="stepper-head-icon">
                          {" "}
                          <i
                            className={`fa ${deployStatus.step === 1 &&
                              deployStatus.fn_status === "failed"
                              ? "fa-times"
                              : deployStatus.step === 0
                                ? "fa-hourglass"
                                : "fa-check"
                              }`}
                            aria-hidden="true"
                          ></i>{" "}
                        </span>
                        <span className="stepper-head-text text-sm">
                          {" "}
                          Erc20 Deployment{" "}
                        </span>
                      </div>
                    </li>
                    <li
                      className={`stepper-step ${deployStatus.step >= 1
                        ? deployStatus.step === 2 &&
                          deployStatus.fn_status === "failed"
                          ? "stepper-failed"
                          : "stepper-active"
                        : ""
                        }`}
                    >
                      <div className="stepper-head hover:!bg-transparent">
                        <span className="stepper-head-icon">
                          {" "}
                          <i
                            className={`fa ${deployStatus.step === 2 &&
                              deployStatus.fn_status === "failed"
                              ? "fa-times"
                              : deployStatus.step === 1
                                ? "fa-hourglass"
                                : "fa-check"
                              }`}
                            aria-hidden="true"
                          ></i>{" "}
                        </span>
                        <span className="stepper-head-text text-sm">
                          {" "}
                          ProjectToken Deployment{" "}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="py-8 flex justify-center">
                <div className="text-center mt-12">
                  <img className="block mx-auto" src={IconSuccess} alt="" />
                  <div className="my-4 text-xl font-bold  draftModalText">
                    Congratulation! you success creating project!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {step === 0 && (
          <button
            type="button"
            className="btn-outline-primary-gradient w-[100px] h-[38px]"
            disabled={isLoading}
            onClick={() => {
              transferFund();
            }}
          >
            <span>Transfer</span>
          </button>
        )}
        {step >= 1 && (
          <div className="flex justify-center">
            <button
              type="button"
              className="btn btn-outline-primary-gradient btn-md cursor-pointer disabled:opacity-50 disabled:bg-gray-500 mr-4"
              onClick={() => {
                window.open(
                  `https://mumbai.polygonscan.com/tx/${tnxHash ? tnxHash : ""}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              disabled={tnxHash && tnxHash.length > 1 ? false : true}
            >
              <span className="px-4">{btnText}</span>
            </button>
            {step === 1 && (
              <button
                type="button"
                className="btn-outline-primary-gradient h-[38px] cursor-pointer disabled:opacity-50 disabled:bg-gray-500"
                disabled={
                  deployStatus && deployStatus.fn_status === "failed"
                    ? false
                    : true
                }
                onClick={() => {
                  publishThisProject(tnxHash);
                }}
              >
                <span>&nbsp;&nbsp;Retry&nbsp;&nbsp;</span>
              </button>
            )}
            {step === 2 && (
              <button
                type="button"
                className="btn-outline-primary-gradient h-[38px] cursor-pointer disabled:opacity-50 disabled:bg-gray-500"
                onClick={() => history.push(`/profile/${userId ? userId : ""}`)}
              >
                <span>&nbsp;&nbsp;Back to Profile&nbsp;&nbsp;</span>
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeployingProjectModal;
