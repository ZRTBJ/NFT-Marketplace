import IconSuccessText from "assets/images/modal/success/icon_success_text.svg";
import IconSuccess from "assets/images/modal/success/icon_success.svg";
import Modal from "../Modal";

const SuccessModal = ({ handleClose, show, message, buttomText }) => {
  const btnText = buttomText ? buttomText : "CLOSE";
  const bodyMsg = message ? message : "Successfully saved.";
  return (
    <Modal
      height={450}
      width={800}
      show={show}
      handleClose={() => handleClose(false)}
    >
      <div className="text-center mt-12">
        <img className="block mx-auto" src={IconSuccessText} alt="" />
        <img className="block mx-auto" src={IconSuccess} alt="" />
        <div className="my-8 text-xl font-bold  draftModalText">{bodyMsg}</div>
        <button
          className="btn-outline-primary h-[35px] px-4"
          onClick={() => handleClose(false)}
        >
          {btnText}
        </button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
