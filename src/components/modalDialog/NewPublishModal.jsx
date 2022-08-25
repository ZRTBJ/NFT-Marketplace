import Publish from "assets/images/images/sure.svg";
import Modal from "../Modal";

const NewPublishModal = ({ handleClose, show, publish }) => {
  return (
    <Modal
      width={600}
      show={show}
      handleClose={() => handleClose(false)}
      showCloseIcon={false}
    >
      <div className="flex items-center flex-col text-center">
        <img src={Publish} alt="Publish" />
        <h3 className="text-[28px] font-black leading-9">
          Once you publish you can’t add member or change the percentage!
        </h3>
        <p className="text-[16px] text-[#7D849D]">
          Do you really want to publish?
        </p>
        <div className="flex mt-4">
          <button
            className="rounded-[4px] contained-button text-white text-[12px] font-bold px-4 py-2"
            onClick={publish}
          >
            Publish Now
          </button>
          <button
            className="ml-[6px] rounded-[4px] bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-bold px-4 py-2"
            onClick={handleClose}
          >
            Back
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NewPublishModal;
