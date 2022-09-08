import Modal from "../Modal";
import { NETWORK_CHAIN } from "data/networkChain";
import { useHistory } from "react-router-dom";
import { logout, useAuthDispatch } from "Context";

const NetworkChangedModal = ({ show, handleClose, networkId }) => {
  const dispatch = useAuthDispatch();
  let history = useHistory();
  function handleLogout() {
    logout(dispatch);
    // showHideUserPopup();
    history.push("/");
    handleClose();
    window.location.reload();
  }
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      showCloseIcon={false}
      width={650}
    >
      <div className="text-center">
        <h3>
          Your network got changed to{" "}
          {NETWORK_CHAIN[networkId]
            ? NETWORK_CHAIN[networkId].networkName
            : "unsupported network. Please logout and connect to supported networks"}
          .
        </h3>
        {NETWORK_CHAIN[networkId] ? (
          <button
            onClick={handleClose}
            className="rounded-[4px] bg-primary-900 text-white py-1 px-3 mt-3"
          >
            Ok
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="rounded-[4px] bg-primary-900 text-white py-1 px-3 mt-3"
          >
            Logout
          </button>
        )}
      </div>
    </Modal>
  );
};

export default NetworkChangedModal;
