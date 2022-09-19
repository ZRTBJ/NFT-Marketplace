import "../assets/css/Modal.css";
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
          " modal-main bg-white rounded-3xl relative txtblack px-4 py-6"
        }
      >
        {showCloseIcon && (
          <i
            className="fa fa-xmark cursor-pointer text-xl absolute top-10 right-8 text-black"
            onClick={handleClose}
          ></i>
        )}
        <div className="mt-10">{children}</div>
      </section>
    </div>
  );
};

export default Modal;
