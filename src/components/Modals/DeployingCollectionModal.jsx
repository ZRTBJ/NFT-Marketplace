import ico_gas from "assets/images/projectEdit/ico_gas.svg";
import ico_matic from "assets/images/projectEdit/ico_matic.svg";
import IconSuccess from "assets/images/modal/success/success_modal_img.svg";
import Modal from "../Common/Modal";
import { Step, Stepper } from "react-form-stepper";
import { useEffect, useState } from "react";
import { SendTransactionMetaMask } from "util/metaMaskWallet";
import {
  contractDeploy,
  publishFundTransfer,
} from "services/project/projectService";
import {
  getCollectionDetailsById,
  publishCollection,
} from "services/collection/collectionService";
import { SendTransactionTorus } from "util/Torus";
import { getWalletType } from "util/ApplicationStorage";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useAuthState } from "Context";
import { getNotificationData } from "Slice/notificationSlice";
import deploySuccessSvg from "assets/images/modal/deploySuccessSvg.svg";
import { createProvider } from "eth/logics/provider";
import { createInstance } from "eth/abis/collection-factory";
import { createCollection } from "eth/logics/deploy-collection";
import { NETWORKS } from "config/networks";

const DeployingCollectiontModal = ({
  handleClose,
  errorClose,
  show,
  buttomText,
  tnxData,
  collectionId,
  collectionName,
  collectionSymbol,
  collectionType,
  publishStep,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const btnText = buttomText ? buttomText : "View on Polygonscan";
  const selectedWallet = getWalletType();
  const [isLoading, setIsLoading] = useState(false);
  const context = useAuthState();
  const [userId, setUserId] = useState(context ? context.user : "");
  const [statusStep, setStatusStep] = useState(1);
  const [funcId, setFuncId] = useState("");
  const [step, setStep] = useState(publishStep ? publishStep : 1);
  const [publishedData, setPublishedData] = useState();
  const collectionDeploy = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );

  const [contractAdd, setContractAdd] = useState("");
  const [txnData, setTxnData] = useState();
  const provider = createProvider();
  let chainId = localStorage.getItem("networkChain");
  let createFactoryCollection =
    NETWORKS[Number(chainId)]?.createFactoryCollection;
  let createMembershipFactoryCollection =
    NETWORKS[Number(chainId)]?.createMembershipFactoryCollection;
  const collectionContract = createInstance(
    collectionType === "membership"
      ? createMembershipFactoryCollection
      : createFactoryCollection,
    provider
  );
  const collectionListener = collectionContract.filters.ProxyCreated();

  useEffect(() => {
    if (contractAdd && txnData) {
      publishThisCollection(txnData);
    }
  }, [contractAdd, txnData]);

  useEffect(() => {
    if (step === 1) {
      publishThisCollection();
    }
  }, []);

  function publishThisCollection(data) {
    setIsLoading(true);
    let payload = new FormData();
    if (data) {
      payload.append("transaction_hash", data.transactionHash);
      payload.append("contract_address", contractAdd);
      payload.append("block_number", data.block_number);
    }

    const listener = (args) => {
      console.log(args);
      setContractAdd(args);
    };

    const subscribe = async () => {
      const captured = await collectionContract.queryFilter(collectionListener);

      collectionContract.on(collectionListener, listener);
    };

    subscribe();
    publishCollection(collectionId, txnData ? payload : null)
      .then((res) => {
        setIsLoading(false);
        if (res.code === 0) {
          if (txnData) {
            setStatusStep(2);
            setFuncId(res.function_uuid);
            collectionContract.removeListener(collectionListener, listener);
            if (res?.function?.status === "success") {
              setStep(2);
            } else if (res?.function?.status === "failed") {
              setContractAdd("");
              setTxnData();
              errorClose(res?.function?.message);
            }
          } else {
            handleSmartContract(res.config);
          }
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
          if (collection && collection["status"] === "published") {
            setStep(2);
          }

          if (collection && collection["status"] === "draft") {
            publishThisCollection();
          }
          if (collection && collection["status"] === "publishing") {
            recheckStatus();
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  const handleSmartContract = async (config) => {
    setStatusStep(1);
    try {
      const response = await createCollection(
        collectionContract,
        provider,
        config,
        collectionType
      );
      const hash = response.txReceipt;
      let data = {
        transactionHash: hash.transactionHash,
        block_number: hash.blockNumber,
      };
      setTxnData(data);
    } catch (err) {
      errorClose(err);
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
            <div className="font-black text-[24px] md:text-[42px]">
              Please wait we’re publishing your Collection
            </div>
            <div className="overflow-hidden rounded-full h-4 w-full mt-4  md:mt-12 mb-8 relative animated fadeIn">
              <div className="animated-process-bar"></div>
            </div>
            {statusStep === 1 && (
              <p className="text-center">Creating the contract</p>
            )}
            {statusStep === 2 && (
              <p className="text-center">
                Contract created. Now, we are publishing it.
              </p>
            )}
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
              <div className="font-black text-[24px] md:text-[42px]">
                You have successfully published your collection!
              </div>
              <div className="flex justify-center mt-4 md:mt-[30px]">
                <button
                  className="ml-4 bg-primary-900/[0.20] text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]"
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
