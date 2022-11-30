import Modal from 'components/Commons/Modal';
import { useRouter } from 'next/router';
import { logout } from 'redux/auth';
import { useDispatch } from 'react-redux';

const AccountChangedModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  let router = useRouter();

  function handleLogout() {
    dispatch(logout());
    router.push('/');
    handleClose();
    window?.location.reload();
  }

  return (
    <Modal
      width={400}
      show={show}
      handleClose={handleClose}
      showCloseIcon={false}
    >
      <div className='text-center'>
        <h1>Your Metamask account has got changed. Please login again.</h1>
        <button
          onClick={handleLogout}
          className='rounded-[4px] bg-primary-900 text-white py-2 px-4 px-3 mt-6'
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default AccountChangedModal;
