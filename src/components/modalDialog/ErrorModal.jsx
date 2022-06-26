import IconErrorText from "assets/images/modal/error/icon_error_text.svg";
import IconError from "assets/images/modal/error/ico_failure.svg";
import Modal from "../Modal";

const ErrorModal = ({ handleClose, show, title, message, buttomText }) => {
  const btnText = buttomText ? buttomText : "CLOSE";
  const titleMsg = title ? title : "Sorry, something went wrong.";
  const bodyMsg = message ? message : "Please try again.";
  return (
    <Modal
      height={450}
      width={800}
      show={show}
      handleClose={() => handleClose(false)}
    >
      <div className="text-center mt-12">
        <img className="block mx-auto" src={IconErrorText} alt="" />
        <img className="block mx-auto" src={IconError} alt="" />
        <div className="my-8 text-xl font-bold  draftModalText">{titleMsg}</div>
        <div className="my-8 font-bold  draftModalText">{bodyMsg}</div>
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

export default ErrorModal;
