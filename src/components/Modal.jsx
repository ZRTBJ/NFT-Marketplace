import "../assets/css/Modal.css";
import ModalCloseLogo from "assets/images/modal/ico_closemodal.png";
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
      className={`${show ? "modal display-block" : "modal display-none"} z-10 `}
    >
      <section
        onClick={(e) => modalBodyClicked(e)}
        style={styleObj}
        className={" modal-main bg-[#161423] rounded-3xl"}
      >
        <img
          alt=""
          src={ModalCloseLogo}
          onClick={handleClose}
          className="cursor-pointer ml-auto mt-[26px] mr-[26px] h-[20px] w-[20px]"
        />
        <div className="">{children}</div>
      </section>
    </div>
  );
};

export default Modal;
