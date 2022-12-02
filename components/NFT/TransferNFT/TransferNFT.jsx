import Modal from "components/Commons/Modal";

const TransferNFT = ({ handleClose, show }) => {
  return (
    <Modal show={show} handleClose={handleClose} width={537}>
      <h3 className="text-[28px] text-black mb-6">Transfer NFT</h3>
      <label for="invite-address" className="text-[14px] text-black-shade-900">
        Add receiver wallet
      </label>
      <input
        id="reciever-address"
        placeholder="Add wallet Address"
        className="text-[14px] block mb-2 py-[10px] pl-[15px] pr-[40px} w-full rounded-[3px] border-[1px] border-divider mt-1"
        value=""
      />
      <button
        onClick={handleClose}
        className="mt-6 bg-primary-900 text-white text-[14px] w-full font-black rounded-[4px] h-[43px]"
      >
        Transfer
      </button>
    </Modal>
  );
};

export default TransferNFT;
