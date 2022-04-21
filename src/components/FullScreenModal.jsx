import "../assets/css/Modal.css";
const FullScreenModal = ({ children }) => {
  return (
    <div className={`modal display-block z-10   `}>
      <section className={"modal-main  h-full "}>{children}</section>
    </div>
  );
};

export default FullScreenModal;
