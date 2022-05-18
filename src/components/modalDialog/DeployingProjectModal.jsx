import ico_gas from "assets/images/projectEdit/ico_gas.svg";
import ico_matic from "assets/images/projectEdit/ico_matic.svg";
import Modal from "../Modal";
import { Step, Stepper } from "react-form-stepper";
import { useState } from "react";
import { produceWithPatches } from "immer";
import { SendTransactionMetaMask } from "util/metaMaskWallet";
import {
  contractDeploy,
  publishFundTransfer,
  publishProject,
} from "services/project/projectService";
import { useAuthState } from "Context";
import { SendTransactionTorus } from "util/Torus";

const DeployingProjectModal = ({
  handleClose,
  show,
  buttomText,
  tnxData,
  projectId,
}) => {
  const btnText = buttomText ? buttomText : "VIEW on ETHERSCAN";
  const context = useAuthState();
  const [selectedWallet, setSelectedWallet] = useState(
    context ? context.wallet : ""
  );
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tnxHash, setTnxHash] = useState("");

  async function sendFund() {
    let txnHash = "";
    setIsLoading(true);
    if (selectedWallet === "metamask") {
      txnHash = await SendTransactionMetaMask(tnxData);
    } else {
      txnHash = await SendTransactionTorus(tnxData);
    }
    const jsonTnxData = JSON.stringify(tnxData);
    if (txnHash && txnHash.length > 5) {
      setTnxHash(txnHash);
      const request = new FormData();
      request.append("status", "success");
      request.append("hash", txnHash);
      request.append("data", jsonTnxData);

      publishFundTransfer(projectId, request)
        .then((res) => {
          setIsLoading(false);
          if (res.code === 0) {
            setStep(1);
            projectContractDeploy();
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

  function projectContractDeploy() {
    setIsLoading(true);
    contractDeploy(projectId)
      .then((res) => {
        setIsLoading(false);
        if (res.code === 0) {
          console.log(res);
        } else {
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  function publishThisProject() {
    setIsLoading(true);
    publishProject(projectId)
      .then((res) => {
        setIsLoading(false);
        if (res.code === 0) {
        } else {
        }
      })
      .catch((err) => {
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
                <Step label="Deployment Smartcontract">
                  {step === 1 ? (
                    <i className="fa fa-hourglass" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  )}
                </Step>
                <Step label="Set up project data">
                  {step === 2 ? (
                    <i className="fa fa-hourglass" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  )}
                </Step>
                <Step label="Completed">
                  {step === 3 ? (
                    <i className="fa fa-hourglass" aria-hidden="true"></i>
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
                <div className="py-8 mx-64 flex flex-row p-6 w-2/3 ">
                  <div className="text-center my-4">
                    <ul className="stepper stepper-vertical">
                      <li className="stepper-step stepper-active">
                        <div className="stepper-head">
                          <span className="stepper-head-icon">
                            {" "}
                            <i
                              className="fa fa-check"
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                          <span className="stepper-head-text text-sm">
                            {" "}
                            MainContract Deployment{" "}
                          </span>
                        </div>
                      </li>
                      <li className="stepper-step stepper-failed">
                        <div className="stepper-head">
                          <span className="stepper-head-icon">
                            {" "}
                            <i
                              className="fa fa-times"
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                          <span className="stepper-head-text text-sm">
                            {" "}
                            Comp Deployment{" "}
                          </span>
                        </div>
                      </li>
                      <li className="stepper-step">
                        <div className="stepper-head">
                          <span className="stepper-head-icon">
                            {" "}
                            <i
                              className="fa fa-check"
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                          <span className="stepper-head-text text-sm">
                            {" "}
                            Timelock Deployment{" "}
                          </span>
                        </div>
                      </li>
                    </ul>
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
              sendFund();
            }}
          >
            <span className="m-2 px-8">Transfer</span>
          </button>
        )}
        {step === 1 && (
          <div className="flex justify-center">
            <button
              type="button"
              className="h-12 bg-[#0AB4AF] rounded text-white mr-4"
              onClick={() => {
                window.open(
                  `https://mumbai.polygonscan.com/tx/${tnxHash ? tnxHash : ""}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <span className="mx-4 my-2">{btnText}</span>
            </button>
            <button
              type="button"
              className="h-12 w-24 bg-[#0AB4AF] rounded text-white"
            >
              <span className="mx-4 my-2">Retry</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeployingProjectModal;
