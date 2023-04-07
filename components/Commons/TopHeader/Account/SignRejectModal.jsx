import Modal from 'components/Commons/Modal';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logout } from 'redux/auth';

const SignRejectionModal = ({ show, closeModal, handleTryAgain }) => {
  let router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    window?.location.reload();
  };
  return (
    <Modal
      width={500}
      show={show}
      handleClose={() => closeModal()}
      gradientBg={true}
      showCloseIcon={false}
    >
      <div className='text-center'>
        <h2>Signature Rejected</h2>
        <p className='mt-4 text-[18px]'>
          {' '}
          You have rejected the metamask signing.
        </p>
        <div className='flex items-center justify-center mt-4'>
          <button
            className='contained-button-new mr-2'
            onClick={() => handleTryAgain(null, '')}
          >
            Try again
          </button>
          <button
            className='gradient-border-new p-2 ml-2 font-bold'
            onClick={handleLogout}
          >
            Disconnect
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SignRejectionModal;
