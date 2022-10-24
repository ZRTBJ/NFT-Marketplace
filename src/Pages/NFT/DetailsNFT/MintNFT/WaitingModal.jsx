import Modal from "components/Common/Modal";
import Lottie from "react-lottie";
import lottieJson from "assets/lottieFiles/nft-minting-process";
const WaitingModal = ({ handleClose, show }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieJson,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Modal
      width={532}
      show={show}
      handleClose={() => handleClose(false)}
      showCloseIcon={false}
    >
      <div className="text-center mt-2">
        <div className="font-black text-[24px] md:text-[23px]">
          Your transaction is in progress
        </div>
        <Lottie options={defaultOptions} height={305} width={305} />
        <p className="mt-4 mb-6">it might take a time, please wait and don't close the popup</p>
      </div>
    </Modal>
  );
};

export default WaitingModal;
