import Modal from '../Modal';

const ConfirmationModal = ({ show, handleClose, handleApply, message }) => {
  return (
    <Modal show={show} handleClose={handleClose} showCloseIcon={false}>
      <div>
        <p>{message}</p>
        <div className='flex items-center justify-end w-full mt-4'>
          <button
            className='rounded-[4px] px-4 py-2 bg-primary-50 text-primary-900 text-[12px] font-black'
            onClick={() => handleClose(false)}
          >
            No
          </button>
          <button
            className='rounded-[4px] bg-primary-900 text-white text-[12px] font-bold px-4 py-2 ml-2'
            onClick={handleApply}
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
