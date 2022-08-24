import publishModalSvg from "assets/images/modal/publishModalSvg.svg";
import Modal from "../Modal";

const PublishModal = ({ handleClose, show, publishProject }) => {
  return (
    <Modal
      height={580}
      width={800}
      show={show}
      handleClose={() => handleClose(false)}
    >
      <div className="text-center">
        <img
          className="h-[200px] w-[300px] mx-auto"
          src={publishModalSvg}
          alt=""
        />
        <div className="mx-16">
          <h1>You can’t Change some Field once you this Publish Collection</h1>
          <div className="text-[#9499AE] mt-[12px]">
            Do you want to publish anyway?
          </div>
          <div className="message-info">
            Once transaction has made, Collection and NFT data will not be
            changeable except benefits fields.
          </div>
          <div className="flex justify-center mt-[30px]">
            <button
              className="btn contained-button btn-sm"
              onClick={publishProject}
            >
              Publish Now
            </button>
            <button
              className="ml-4 bg-primary-900/[0.20] text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]"
              onClick={() => handleClose(false)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PublishModal;
