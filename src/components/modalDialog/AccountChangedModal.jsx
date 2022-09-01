import Modal from "../Modal";
import { useHistory } from "react-router-dom";
import { logout, useAuthDispatch } from "Context";

const AccountChangedModal = ({ show, handleClose }) => {
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
    <Modal show={show} handleClose={handleClose} showCloseIcon={false}>
      <div className="text-center">
        <h3>
          Your Metamask account has got changed. So, please logout and connect
          again.
        </h3>
        <button
          onClick={handleLogout}
          className="rounded-[4px] bg-primary-900 text-white py-1 px-3 mt-3"
        >
          Logout
        </button>
      </div>
    </Modal>
  );
};

export default AccountChangedModal;
