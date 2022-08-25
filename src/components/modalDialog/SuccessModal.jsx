import IconSuccess from "assets/images/modal/success/success_modal_img.svg";
import Modal from "../Modal";
import NewSuccess from "assets/images/new-success.svg";
import { Link, useHistory } from "react-router-dom";

const SuccessModal = ({
  handleClose,
  show,
  message,
  subMessage,
  buttonText,
  redirection = "",
  showCloseIcon = false,
}) => {
  const history = useHistory();

  const btnText = buttonText ? buttonText : "CLOSE";
  const bodyMsg = message ? message : "Successfully saved.";
  return (
    <Modal
      width={800}
      show={show}
      handleClose={() => handleClose(false)}
      showCloseIcon={showCloseIcon}
    >
      <div className='text-center mt-2'>
        <img className='block mx-auto' src={NewSuccess} alt='' />
        <div className='mb-2 text-[28px] font-black txtblack w-[350px] mx-auto'>
          {bodyMsg}
        </div>
        <p className="text-[#7D849D] text-[16px] mb-2">{subMessage}</p>
        <div className="flex justify-center">
          <button
            type="button"
            className="rounded-[4px] py-2 mt-2 mb-4 px-4 bg-primary-50 text-primary-900 w-[125px] text-[14px] font-black"
            onClick={(e) => {
              if (redirection) {
                history.push(redirection);
              }
              handleClose(false);
            }}
          >
            <span>{btnText}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
