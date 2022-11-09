import Modal from "components/Commons/Modal";
import { NETWORKS } from "config/networks";
import { useHistory } from "react-router-dom";
import { logout } from "redux/auth";
import { useDispatch } from "react-redux";

const WrongNetwork = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  let history = useHistory();
  function handleLogout() {
    dispatch(logout());
    // showHideUserPopup();
    history.push("/");
    handleClose();
    window.location.reload();
  }

  const handleOk = () => {
    handleClose();
  };

  let networks = Object.values(NETWORKS);
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      showCloseIcon={false}
      width={690}
    >
      <div className="text-center">
        <p className="text-lg word-break">
          The selected network in your Metmask wallet is not supported by our
          application. Please select any one of the following network in
          Metamask and try again.
        </p>
        <div className="flex items-center justify-center">
          <ul className="text-left mt-5">
            {networks &&
              networks.map((network, index) => (
                <li key={index} className="text-[18px] font-bold">
                  {index + 1}. {network.networkName}
                </li>
              ))}
          </ul>
        </div>
        <button
          onClick={handleOk}
          className="rounded-[4px] bg-primary-900 text-white py-1 px-3 mt-3"
        >
          Ok
        </button>
      </div>
    </Modal>
  );
};

export default WrongNetwork;
