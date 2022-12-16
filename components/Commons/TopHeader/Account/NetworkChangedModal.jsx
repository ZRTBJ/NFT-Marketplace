import Modal from 'components/Commons/Modal';
import { NETWORKS } from 'config/networks';
import { useRouter } from 'next/router';
import { logout } from 'redux/auth';
import { useDispatch } from 'react-redux';

const NetworkChangedModal = ({ show, handleClose, networkId }) => {
  const dispatch = useDispatch();
  let router = useRouter();

  function handleLogout() {
    dispatch(logout());
    router.push('/');
    handleClose();
    window?.location.reload();
  }

  const handleOk = () => {
    window.location.reload();
    handleClose();
  };
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      showCloseIcon={false}
      width={650}
    >
      <div className='text-center'>
        <h3>
          Your network got changed to{' '}
          {NETWORKS[networkId]
            ? NETWORKS[networkId].networkName
            : 'unsupported network. Please logout and connect to supported networks'}
          .
        </h3>
        {NETWORKS[networkId] ? (
          <button
            onClick={handleOk}
            className='rounded-[4px] bg-primary-900 text-white py-1 px-3 mt-3'
          >
            Ok
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className='rounded-[4px] bg-primary-900 text-white py-1 px-3 mt-3'
          >
            Logout
          </button>
        )}
      </div>
    </Modal>
  );
};

export default NetworkChangedModal;
