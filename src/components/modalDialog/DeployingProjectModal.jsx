import ico_gas from "assets/images/projectEdit/ico_gas.svg";
import ico_matic from "assets/images/projectEdit/ico_matic.svg";
import Modal from "../Modal";
import { Step, Stepper } from "react-form-stepper";
import { useState } from "react";
import { produceWithPatches } from "immer";
import { SendTransactions } from "util/metaMaskWallet";
import {
  publishFundTransfer,
  publishProject,
} from "services/project/projectService";

const DeployingProjectModal = ({
  handleClose,
  show,
  buttomText,
  tnxData,
  projectId,
}) => {
  const btnText = buttomText ? buttomText : "VIEW on ETHERSCAN";
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [tnxHash, setTnxHash] = useState("");

  async function sendFund() {
    setIsLoading(true);
    const txnHash = await SendTransactions(tnxData);
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
            // publishThisProject(); // to-do: wait for websocket response of success then call this api
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
                <div className="py-8 mx-64 flex flex-row p-6 w-1/3 ">
                  <div className="text-center my-4">
                    <ul class="stepper stepper-vertical">
                      <li class="stepper-step stepper-active">
                        <div class="stepper-head">
                          <span class="stepper-head-icon">
                            {" "}
                            <i
                              className="fa fa-check"
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                          <span class="stepper-head-text"> step1 </span>
                        </div>
                      </li>
                      <li class="stepper-step stepper-failed">
                        <div class="stepper-head">
                          <span class="stepper-head-icon">
                            {" "}
                            <i
                              className="fa fa-times"
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                          <span class="stepper-head-text"> step2 </span>
                        </div>
                      </li>
                      <li class="stepper-step">
                        <div class="stepper-head">
                          <span class="stepper-head-icon">
                            {" "}
                            <i
                              className="fa fa-check"
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                          <span class="stepper-head-text"> step3 </span>
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
          <button
            type="button"
            className="h-12 bg-[#0AB4AF] rounded text-white"
            onClick={() => {
              window.open(
                `https://mumbai.polygonscan.com/tx/${tnxHash ? tnxHash : ""}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            <span className="m-2">{btnText}</span>
          </button>
        )}
      </div>
    </Modal>
  );
};

export default DeployingProjectModal;
