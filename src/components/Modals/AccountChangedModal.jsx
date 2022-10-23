import Modal from "../Common/Modal";
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
    <Modal
      width={400}
      show={show}
      handleClose={handleClose}
      showCloseIcon={false}
    >
      <div className="text-center">
        <h1>
          Your Metamask account has got changed. So, please logout and connect
          again.
        </h1>
        <button
          onClick={handleLogout}
          className="rounded-[4px] bg-primary-900 text-white py-2 px-4 px-3 mt-6"
        >
          Logout
        </button>
      </div>
    </Modal>
  );
};

export default AccountChangedModal;
