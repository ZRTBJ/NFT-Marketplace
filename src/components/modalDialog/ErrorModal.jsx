import IconError from "assets/images/modal/error/error_modal_img.svg";
import { Link } from "react-router-dom";
import Modal from "../Modal";

const ErrorModal = ({
  handleClose,
  show,
  title,
  message,
  buttomText,
  redirection,
}) => {
  const btnText = buttomText ? buttomText : "CLOSE";
  const titleMsg = title ? title : "Sorry, something went wrong.";
  const bodyMsg = message ? message : "Please try again.";
  return (
    <Modal
      height={480}
      width={800}
      show={show}
      handleClose={() => handleClose(false)}
    >
      <div className="text-center">
        <img className="block mx-auto" src={IconError} alt="" />
        <div className="my-4 text-xl font-bold txtblack">{titleMsg}</div>
        <div className="my-4 font-bold txtblack">{bodyMsg}</div>
        <div className="flex justify-center mb-4">
          {redirection ? (
            <Link to={redirection}>
              <button
                type="button"
                className="btn bg-primary-50 text-primary-900 btn-sm"
                onClick={(e) => {
                  handleClose(false);
                }}
              >
                <span>{btnText}</span>
              </button>
            </Link>
          ) : (
            <button
              type="button"
              className="btn bg-primary-50 text-primary-900 btn-sm"
              onClick={(e) => {
                handleClose(false);
              }}
            >
              <span>{btnText}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ErrorModal;
