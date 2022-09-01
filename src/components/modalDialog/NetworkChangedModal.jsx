import Modal from "../Modal";
import { NETWORK_CHAIN } from "data/networkChain";

const NetworkChangedModal = ({ show, handleClose, networkId }) => {
  return (
    <Modal show={show} handleClose={handleClose} showCloseIcon={false}>
      <div className="text-center">
        <h3>
          Your network got changed to{" "}
          {NETWORK_CHAIN[networkId]
            ? NETWORK_CHAIN[networkId]
            : "unsupported network"}
          .
        </h3>
        <button
          onClick={handleClose}
          className="rounded-[4px] bg-primary-900 text-white py-1 px-3 mt-3"
        >
          Ok
        </button>
      </div>
    </Modal>
  );
};

export default NetworkChangedModal;
