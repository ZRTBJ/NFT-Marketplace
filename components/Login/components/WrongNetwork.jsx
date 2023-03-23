import Modal from 'components/Commons/Modal';
import { NETWORKS, temporaryBlocked } from 'config/networks';
import { useRouter } from 'next/router';
import { logout } from 'redux/auth';
import { useDispatch } from 'react-redux';
import { omit } from 'lodash';

const NETWORKS_LIST = omit(NETWORKS, temporaryBlocked);

const WrongNetwork = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  let router = useRouter();
  function handleLogout() {
    dispatch(logout());
    // showHideUserPopup();
    router.push('/');
    handleClose();
  }

  const handleOk = () => {
    handleClose();
  };

  let networks = Object.values(NETWORKS_LIST);

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      showCloseIcon={false}
      width={690}
    >
      <div className='text-center'>
        <p className='text-lg word-break'>
          The selected network in your Metamask wallet is not supported by our
          application. Please select any one of the following network in
          Metamask and try again.
        </p>
        <div className='flex items-center justify-center'>
          <ul className='text-left mt-5'>
            {networks &&
              networks.map((network, index) => (
                <li key={index} className='text-[18px] font-bold'>
                  {index + 1}. {network.networkName}
                </li>
              ))}
          </ul>
        </div>
        <button
          onClick={handleOk}
          className='rounded-[4px] bg-primary-900 text-white py-1 px-3 mt-3'
        >
          Ok
        </button>
      </div>
    </Modal>
  );
};

export default WrongNetwork;
