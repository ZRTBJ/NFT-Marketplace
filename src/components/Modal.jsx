import "../assets/css/Modal.css";
import ModalCloseLogo from "assets/images/modal/ico_closemodal.png";
const Modal = ({ handleClose, show, children, height, width, overflow }) => {
  let styleObj = {
    height: height ? height + "px" : "",
    width: width ? width + "px" : "",
    overflow: overflow ? overflow : "hidden",
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
        className={
          " modal-main bg-dark-background rounded-3xl relative text-white p-11"
        }
      >
        {/* <img
          alt=""
          src={ModalCloseLogo}
          onClick={handleClose}
          className="cursor-pointer ml-auto mt-[26px] mr-[26px] h-[20px] w-[20px]"
        /> */}
        <i
          class="fa-light fa-square-xmark cursor-pointer text-2xl absolute top-12 right-8"
          onClick={handleClose}
        ></i>
        <div className="">{children}</div>
      </section>
    </div>
  );
};

export default Modal;
