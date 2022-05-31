import "../assets/css/Modal.css";
import ModalCloseLogo from "assets/images/projectCreate/ico_closemodal.svg";
const Modal = ({ handleClose, show, children, height, width }) => {
  let styleObj = {
    height: height ? height + "px" : "",
    maxWidth: width ? width + "px" : "",
  };

  const modalBodyClicked = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // e.stopImmediatePropagation();
  };
  return (
    <div
      data-toggle="modal"
      data-backdrop="static"
      data-keyboard="false"
      className={`${show ? "modal display-block" : "modal display-none"} z-10`}
    >
      <section
        onClick={(e) => modalBodyClicked(e)}
        style={styleObj}
        className={" modal-main"}
      >
        <img
          alt=""
          src={ModalCloseLogo}
          onClick={handleClose}
          className="absolute right-[-16px]  cursor-pointer ml-auto h-[35px] w-[35px] mt-[-15px]"
        />
        {children}
      </section>
    </div>
  );
};

export default Modal;
