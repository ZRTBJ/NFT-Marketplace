import Modal from "../Modal";
import { useEffect, useState } from "react";
import { publishProject } from "services/project/projectService";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "Slice/notificationSlice";
import deploySuccessSvg from "assets/images/modal/deploySuccessSvg.svg";
import { createDAO } from "eth/deploy-dao";
import { createProvider } from "eth/provider";
import { createInstance } from "eth/dao-factory";

const DeployingProjectModal = ({
  handleClose,
  show,
  projectId,
  publishStep,
  errorClose,
}) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(publishStep ? publishStep : 0);
  const [isLoading, setIsLoading] = useState(false);
  const projectDeploy = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [deployStatus, setDeployStatus] = useState({
    projectId: "",
    etherscan: "",
    function_uuid: "",
    fn_name: "",
    fn_status: "",
    message: "",
    step: 1,
  });
  const provider = createProvider();
  const dao = createInstance(provider);
  const [contractAdd, setContractAdd] = useState("");
  const [txnData, setTxnData] = useState();

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
        message: statusData?.fn_response_data?.message,
        step: statusData?.fn_response_data?.step,
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
        step: 1,
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
        step: 1,
      };
      setDeployStatus(status);
    }
  }, [projectDeploy]);

  useEffect(() => {
    if (publishStep >= 1) {
      publishThisProject();
    }
  }, []);

  useEffect(() => {
    if (contractAdd && txnData) {
      publishThisProject(txnData);
    }
  }, [contractAdd, txnData]);

  function publishThisProject(transactionData) {
    setIsLoading(true);
    let payload = new FormData();
    if (transactionData) {
      payload.append("transaction_hash", transactionData.transactionHash);
      payload.append("contract_address", contractAdd);
      payload.append("block_number", transactionData.block_number);
    }

    const filter = dao.filters.NewClone();

    const listener = (args) => {
      setContractAdd(args);
    };

    const subscribe = async () => {
      const captured = await dao.queryFilter(filter);

      dao.on(filter, listener);
    };

    subscribe();

    publishProject(projectId, transactionData ? payload : null)
      .then((res) => {
        setIsLoading(false);
        if (res && res?.code === 0) {
          if (transactionData) {
            const deployData = {
              projectId: projectId,
              etherscan: transactionData,
              function_uuid: res.function_uuid,
              data: "",
            };
            const filter = dao.filters.NewClone();
            dao.removeListener(filter);
            dispatch(getNotificationData(deployData));
            setContractAdd("");
            setTxnData();
          } else {
            handleSmartContract(
              res?.config?.name,
              res?.config?.treasury_address
            );
          }
        } else {
          setContractAdd("");
          setTxnData();
          errorClose(res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  const handleSmartContract = async (name, treasuryAddress) => {
    try {
      const response = await createDAO(dao, provider, name, treasuryAddress);
      const hash = response.txReceipt;
      let data = {
        transactionHash: hash.transactionHash,
        block_number: hash.blockNumber,
      };
      setTxnData(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      width={800}
      show={show}
      showCloseIcon={false}
      handleClose={() => handleClose(false)}
    >
      <div className={`text-center md:my-6 ${isLoading ? "loading" : ""}`}>
        {step === 1 && (
          <div className="md:mx-16">
            <h1>Please wait we’re publishing your DAO</h1>
            <div className="overflow-hidden rounded-full h-4 w-full mt-12 mb-8 relative animated fadeIn">
              <div className="animated-process-bar"></div>
            </div>
            {deployStatus.step === 1 && (
              <p className="text-center">Deployment</p>
            )}
            {deployStatus.step === 2 && (
              <p className="text-center">ProjectToken Deployment</p>
            )}
            <div className="flex justify-center mt-[30px]">
              <button
                className="btn bg-primary-50 text-primary-900 btn-sm"
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
              className="h-[200px] md:w-[300px] mx-auto"
              src={deploySuccessSvg}
              alt=""
            />
            <div className="md:mx-16">
              <h1>Your DAO published Successfully!</h1>
              <p className="text-[#9499AE] mt-[12px]">
                Now you can publish your collection!
              </p>
              <div className="flex justify-center mt-4 md:mt-[30px]">
                <button
                  className="btn contained-button btn-sm"
                  onClick={() => handleClose(false)}
                >
                  Publish Collection
                </button>
                <button
                  className="ml-4 bg-primary-50 text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]"
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
