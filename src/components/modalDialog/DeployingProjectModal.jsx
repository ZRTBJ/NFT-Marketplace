import ico_gas from "assets/images/projectEdit/ico_gas.svg";
import ico_matic from "assets/images/projectEdit/ico_matic.svg";
import Modal from "../Modal";
import { Step, Stepper } from "react-form-stepper";
import { useState } from "react";

const DeployingProjectModal = ({ handleClose, show, buttomText }) => {
  const btnText = buttomText ? buttomText : "VIEW on ETHERSCAN";
  const [step, setStep] = useState(1);
  return (
    <Modal width={800} show={show} handleClose={() => handleClose(false)}>
      <div className="text-center my-6">
        <div className="mx-4 divide-y divide-solid divide-gray-400">
          <div className="text-center font-semibold my-4">
            Deploying Project
          </div>
          <div>
            <div>
              <Stepper
                activeStep={step}
                styleConfig={{
                  completedBgColor: "#0AB4AF",
                  inactiveBgColor: "#B9CCD5",
                  labelFontSize: "1em",
                  fontWeight: "600",
                }}
              >
                <Step label="Fund Transfer">
                  {step === 1 ? (
                    <i className="fa fa-hourglass" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  )}
                </Step>
                <Step label="Deployment Smartcontract">
                  {step === 2 ? (
                    <i className="fa fa-hourglass" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  )}
                </Step>
                <Step label="Set up project data">
                  {step === 3 ? (
                    <i className="fa fa-hourglass" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  )}
                </Step>
                <Step label="Completed">
                  {step === 4 ? (
                    <i className="fa fa-hourglass" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  )}
                </Step>
              </Stepper>
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
                    <span className="float-right"> ~ 2.1 MATIC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="w-44 h-12 bg-[#0AB4AF] rounded text-white"
          onClick={() => handleClose(false)}
        >
          {btnText}
        </button>
      </div>
    </Modal>
  );
};

export default DeployingProjectModal;
