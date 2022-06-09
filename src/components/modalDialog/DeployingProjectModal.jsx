import ico_gas from "assets/images/projectEdit/ico_gas.svg";
import ico_matic from "assets/images/projectEdit/ico_matic.svg";
import IconCongratulationText from "assets/images/modal/success/icon_congratulation_text.svg";
import IconSuccess from "assets/images/modal/success/icon_success.svg";
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
  const btnText = buttomText ? buttomText : "VIEW on ETHERSCAN";
  const selectedWallet = getWalletType();
  const [step, setStep] = useState(publishStep ? publishStep : 0);
  const [isLoading, setIsLoading] = useState(false);
  const [tnxHash, setTnxHash] = useState("");
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
        <div className="mx-4 divide-y divide-solid divide-gray-400">
          <div className="text-center font-semibold my-4">
            Deploying Project
          </div>
          <div>
            <div>
              <Stepper
                activeStep={step}
                styleConfig={{
                  connectorStateColors: true,
                  completedBgColor: "#0AB4AF",
                  inactiveBgColor: "#B9CCD5",
                  labelFontSize: "1em",
                  fontWeight: "600",
                }}
                connectorStyleConfig={{
                  activeColor: "#0AB4AF",
                  completedColor: "#0AB4AF",
                  size: 2,
                  stepSize: "1em",
                }}
              >
                <Step label="Fund Transfer">
                  {step === 0 ? (
                    <i className="fa fa-hourglass" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  )}
                </Step>
                <Step label="Set up project data">
                  {step === 1 ? (
                    <i className="fa fa-hourglass" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  )}
                </Step>
                <Step label="Completed">
                  {step === 2 ? (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  )}
                </Step>
              </Stepper>
              {step === 0 && (
                <div className="py-8">
                  <img className="block mx-auto" src={ico_gas} alt="" />
                  <div className="text-center my-4">
                    Estimation of total gas required for these transactions.
                  </div>
                  <div className="my-4 bg-gray-100 mx-48 flex flex-row p-6">
                    <div className="mx-2">
                      <img className="block mx-auto" src={ico_matic} alt="" />
                    </div>
                    <div>Complete Deposit</div>
                    <div className="ml-8">
                      <span className="float-right">
                        {" "}
                        ~ {tnxData.amount ? tnxData.amount : 0} MATIC
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="py-8 flex flex justify-center">
                  <div className="text-center my-4">
                    <ul className="stepper stepper-vertical">
                      <li
                        className={`stepper-step ${
                          deployStatus.step >= 0
                            ? deployStatus.step === 1 &&
                              deployStatus.fn_status === "failed"
                              ? "stepper-failed"
                              : "stepper-active"
                            : ""
                        }`}
                      >
                        <div className="stepper-head">
                          <span className="stepper-head-icon">
                            {" "}
                            <i
                              className={`fa ${
                                deployStatus.step === 1 &&
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
                        className={`stepper-step ${
                          deployStatus.step >= 1
                            ? deployStatus.step === 2 &&
                              deployStatus.fn_status === "failed"
                              ? "stepper-failed"
                              : "stepper-active"
                            : ""
                        }`}
                      >
                        <div className="stepper-head">
                          <span className="stepper-head-icon">
                            {" "}
                            <i
                              className={`fa ${
                                deployStatus.step === 2 &&
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
                <div className="py-8 flex flex justify-center">
                  <div className="text-center mt-12">
                    <img
                      className="block mx-auto"
                      src={IconCongratulationText}
                      alt=""
                    />
                    <img className="block mx-auto" src={IconSuccess} alt="" />
                    <div className="my-4 text-xl font-bold  draftModalText">
                      Your project already Establish!!
                    </div>
                    <p>Let’s look your project page.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {step === 0 && (
          <button
            type="button"
            className="h-12 bg-[#0AB4AF] rounded text-white"
            disabled={isLoading}
            onClick={() => {
              transferFund();
            }}
          >
            <span className="m-2 px-8">Transfer</span>
          </button>
        )}
        {step >= 1 && (
          <div className="flex justify-center">
            <button
              type="button"
              className="h-12 bg-[#0AB4AF] rounded text-white mr-4 cursor-pointer disabled:opacity-50 disabled:bg-gray-500"
              onClick={() => {
                window.open(
                  `https://mumbai.polygonscan.com/tx/${tnxHash ? tnxHash : ""}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              disabled={tnxHash && tnxHash.length > 1 ? false : true}
            >
              <span className="mx-4 my-2">{btnText}</span>
            </button>
            {step === 1 && (
              <button
                type="button"
                className="h-12 w-24 bg-[#0AB4AF] rounded text-white cursor-pointer disabled:opacity-50 disabled:bg-gray-500"
                disabled={
                  deployStatus && deployStatus.fn_status === "failed"
                    ? false
                    : true
                }
                onClick={() => {
                  publishThisProject(tnxHash);
                }}
              >
                <span className="mx-4 my-2">Retry</span>
              </button>
            )}
            {step === 2 && (
              <button
                type="button"
                className="h-12 bg-[#0AB4AF] rounded text-white cursor-pointer disabled:opacity-50 disabled:bg-gray-500"
                onClick={() =>
                  history.push(
                    `/project-edit/${projectId ? projectId : "0"}/project-top`
                  )
                }
              >
                <span className="mx-4 my-2">PROJECT</span>
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeployingProjectModal;
