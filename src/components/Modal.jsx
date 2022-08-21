import "../assets/css/Modal.css";
import ModalCloseLogo from "assets/images/modal/ico_closemodal.png";
const Modal = ({
  handleClose,
  show,
  children,
  height,
  width,
  overflow,
  showCloseIcon = true,
}) => {
  let styleObj = {
    height: height ? height + "px" : "",
    width: width ? width + "px" : "",
    overflow: overflow ? overflow : "hidden",
  };

  const modalBodyClicked = (e) => {
    // e.preventDefault();
    e.stopPropagation();
    // e.stopImmediatePropagation();
  };
  return (
    <div
      data-toggle="modal"
      data-backdrop="static"
      data-keyboard="false"
      className={`${
        show ? "modal display-block" : "modal display-none"
      } z-[99] `}
    >
      <section
        onClick={(e) => modalBodyClicked(e)}
        style={styleObj}
        className={
          " modal-main bg-light-background rounded-3xl relative txtblack dark:text-white p-11"
        }
      >
        {showCloseIcon && (
          <i
            className="fa fa-xmark cursor-pointer text-xl absolute top-12 right-8 text-black"
            onClick={handleClose}
          ></i>
        )}
        <div className="">{children}</div>
      </section>
    </div>
  );
};

export default Modal;
