import "./index.css";
import { useDetectClickOutside } from "react-detect-click-outside";
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

  const ref = useDetectClickOutside({ onTriggered: handleClose });
  return (
    <div
      data-toggle="modal"
      data-backdrop="static"
      data-keyboard="false"
      className={`${show ? "modal display-block" : "modal display-none"
        } z-[99] `}
    >
      <section
        ref={ref}
        style={styleObj}
        className={
          " modal-main bg-white rounded-3xl relative txtblack px-4 py-6"
        }
      >
        {showCloseIcon && (
          <i
            className="fa fa-xmark cursor-pointer text-xl absolute top-8 right-8 text-black"
            onClick={handleClose}
          ></i>
        )}
        <div className="mt-0">{children}</div>
      </section>
    </div>
  );
};

export default Modal;
