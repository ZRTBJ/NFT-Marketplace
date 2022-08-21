import Modal from '../Modal';

const ConfirmationModal = ({ show, handleClose, handleApply }) => {
  return (
    <Modal show={show} handleClose={handleClose} showCloseIcon={false}>
      <div>
        <p>
          This will apply royalty percentage to all the members equally. Are you
          sure, you want to proceed?
        </p>
        <div className='flex items-center justify-end w-full mt-4'>
          <button
            className='rounded-[4px] px-4 py-2 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-black'
            onClick={() => handleClose(false)}
          >
            Cancel
          </button>
          <button
            className='rounded-[4px] bg-[#9A5AFF] text-white text-[12px] font-bold px-4 py-2 ml-2'
            onClick={handleApply}
          >
            Proceed
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
