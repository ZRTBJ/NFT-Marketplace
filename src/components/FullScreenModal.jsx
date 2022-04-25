import "../assets/css/Modal.css";
const FullScreenModal = ({ children }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-[100%] h-[100%]  block z-10`}
      style={{ background: "rgba(255,255,255,0.9 )" }}
    >
      <section className={"modal-main"}>{children}</section>
    </div>
  );
};

export default FullScreenModal;
