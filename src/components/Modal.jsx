import "../assets/css/Modal.css";
const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const modalBodyClicked = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // e.stopImmediatePropagation();
  };
  return (
    <div className={showHideClassName} onClick={handleClose}>
      <section onClick={(e) => modalBodyClicked(e)} className="modal-main">
        {children}
      </section>
    </div>
  );
};

export default Modal;
