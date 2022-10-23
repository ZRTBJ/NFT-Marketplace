import Modal from "../Common/Modal";
import polygon from "assets/images/transection.svg";
import eth from "assets/images/eth.svg";
const TransactionModal = ({
  handleClose,
  show,
  nftName,
  collectionName,
  address,
  blockChain,
  price,
  gasFee,
  handleNext,
}) => {
  return (
    <Modal
      width={532}
      show={show}
      handleClose={() => handleClose(false)}
      showCloseIcon={true}
    >
      <div className="mt-2">
        <div className="font-black text-[24px] md:text-[42px]">Transaction</div>
        <p className=" mt-3 text-textSubtle">
          You are about to purchase a{" "}
          <span className="font-black">{nftName}</span> from{" "}
          <span className="font-black">{collectionName}</span>
        </p>
        <div className="mt-6 mb-6 bg-primary-50 md:h-[83px] rounded-[12px] p-4 flex flex-wrap items-center">
          <div className="flex items-center">
            <img src={eth} alt="Eth" className="w-[46px] h-[46px]" />
            <div className="ml-3">
              <p className="text-[18px] font-black">
                {address?.slice(0, 15)}...
              </p>
              <p>{blockChain}</p>
            </div>
          </div>
          <div className="font-bold mt-4 md:mt-0  px-3 py-1 ml-auto rounded bg-success-900/[0.2] text-success-900">
            Connected
          </div>
        </div>
        <div className="mb-6">
          <div className="flex flex-wrap items-center border-b-[1px] border-b-[#C7CEE6] pb-3">
            <p className="font-black text-[14px]">Price</p>
            <p className=" ml-auto text-[14px]">{price} ETH</p>
          </div>
          {/* <div className="mt-4  flex flex-wrap items-center">
                <p className="font-black text-[14px]">Gas Fee</p>
                <p className=" ml-auto text-[14px]">{gasFee} MATIC</p>
            </div> */}
        </div>
        <button
          className="w-full text-[16px] h-[44px] contained-button "
          onClick={handleNext}
        >
          Proceed to payment
        </button>
      </div>
    </Modal>
  );
};

export default TransactionModal;
