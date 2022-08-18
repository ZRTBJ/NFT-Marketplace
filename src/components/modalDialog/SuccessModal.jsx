import IconSuccess from "assets/images/modal/success/success_modal_img.svg";
import Modal from "../Modal";

const SuccessModal = ({
  handleClose,
  show,
  message,
  buttomText,
  secondaryMessage,
}) => {
  const btnText = buttomText ? buttomText : "CLOSE";
  const bodyMsg = message ? message : "Successfully saved.";
  return (
    <Modal
      height={500}
      width={800}
      show={show}
      handleClose={() => handleClose(false)}
    >
      <div className="text-center mt-2">
        <img className="block mx-auto" src={IconSuccess} alt="" />
        <div className="my-4 text-xl font-bold  txtblack dark:text-white">
          {bodyMsg}
        </div>
        {secondaryMessage && (
          <div className="my-4 text-sm  text-textSubtle">
            {secondaryMessage}
          </div>
        )}
        <div className="flex justify-center">
          <button
            type="button"
            className="btn-outline-primary-gradient w-[100px] h-[38px]"
            onClick={(e) => {
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
