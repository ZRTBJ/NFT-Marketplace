import Modal from "../Modal";
import waiting from "assets/images/modal/waiting.svg";
const WaitingModal = ({ handleClose, show }) => {
  return (
    <Modal
      width={532}
      show={show}
      handleClose={() => handleClose(false)}
      showCloseIcon={false}
    >
      <div className="text-center mt-2">
        <h2 className="mb-6">Your transaction is on progress</h2>
        <img src={waiting} alt="waiting" className="w-[409px] h-[274px]" />
        <p className="mt-4 mb-6">it might take a time, please wait</p>
        <button
          className="w-full font-bold text-[16px] h-[44px] bg-primary-50 text-primary-900 "
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default WaitingModal;
