import Modal from "components/Commons/Modal";
import InviteImage from "assets/images/invitebox.svg";
import WalletConnectModal from "Pages/User/Login/WalletConnectModal";
import { useState, useEffect } from "react";
import { mintRANFT } from "services/nft/nftService";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "redux/notification";
import MintingNFT from "Pages/NFT/DetailsNFT/MintNFT/MintingNFT";
import ErrorModal from "components/Modals/ErrorModal";

const InviteModal = ({
  show,
  handleClose,
  collectionName,
  isAuthenticated,
  nftId,
  collectionId,
  assetImage,
}) => {
  const [showLogin, setShowLogin] = useState(false);
  const [mintData, setMintData] = useState();
  const [funcId, setFuncId] = useState("");
  const [showSteps, setShowSteps] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const inviteData = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const mintDataStatus = inviteData.find((x) => x.function_uuid === funcId);
    console.log(mintDataStatus);
    if (mintDataStatus && mintDataStatus.data) {
      const data = JSON.parse(mintDataStatus.data);
      if (data?.fn_status === "success") {
        setMintData(data);
        setStep(2);
        setErrorMsg("");
      } else {
        let message = data?.fn_response_data?.ErrorReason;
        let errorMessage = message && JSON.parse(message);
        setErrorMsg(errorMessage?.reason);
      }
    } else {
      let message = mintDataStatus?.data?.fn_response_data?.ErrorReason;
      let errorMessage = message && JSON.parse(message);
      setErrorMsg(errorMessage?.reason);
    }
  }, [inviteData]);

  const handleClaim = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
    } else {
      setShowSteps(true);
      mintNFT();
    }
  };

  const mintNFT = () => {
    mintRANFT(nftId)
      .then((resp) => {
        if (resp.code === 0) {
          const deployData = {
            function_uuid: resp.function_uuid,
            data: "",
          };
          setFuncId(resp.function_uuid);
          dispatch(getNotificationData(deployData));
          setErrorMsg("");
        } else {
          setErrorMsg(resp.message);
          setShowSteps(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowSteps(false);
      });
  };

  const handleShowStepClose = () => {
    setShowSteps(false);
  };

  return (
    <Modal show={show} handleClose={handleClose} width={580}>
      {showLogin && (
        <WalletConnectModal
          showModal={showLogin}
          closeModal={() => setShowLogin(false)}
          noRedirection={true}
        />
      )}
      {errorMsg && (
        <ErrorModal
          title={"Minting NFT failed !"}
          message={`${errorMsg}`}
          handleClose={() => {
            setErrorMsg("");
          }}
          show={errorMsg}
        />
      )}
      {showSteps && (
        <MintingNFT
          handleShowStepClose={handleShowStepClose}
          show={showSteps}
          step={step}
          collectionId={collectionId}
        />
      )}
      <h3 className="text-[24px] font-bold ">
        You’ve been Invited to become contributor.
      </h3>

      <p className="text-[#7D849D] text-[18px] break-normal mt-3">
        You’ve been invited to become contributor at {collectionName}.
      </p>

      <img
        src={assetImage ? assetImage : InviteImage}
        alt="Invite box"
        className="mt-6 w-[320] h-[150]  md:w-[443px] md:h-[443px] rounded-[12px] mx-auto object-cover"
      />

      <p className="text-[18px] text-center my-6">
        Claim the NFT to get your royalties
      </p>
      <button
        onClick={handleClaim}
        className="rounded-[4px] bg-[#199BD8] text-[14px] font-black text-white w-full py-3"
      >
        Claim NFT
      </button>
    </Modal>
  );
};
export default InviteModal;
