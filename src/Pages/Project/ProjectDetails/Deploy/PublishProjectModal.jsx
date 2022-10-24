import publishModalSvg from "assets/images/modal/publishModalSvg.svg";
import Modal from "components/Commons/Modal";

const PublishProjectModal = ({ handleClose, show, publishProject, type }) => {
  return (
    <Modal
      height={580}
      width={800}
      show={show}
      handleClose={() => handleClose(false)}
    >
      <div className="text-center">
        <img
          className="h-[200px] md:w-[300px] mx-auto"
          src={publishModalSvg}
          alt=""
        />
        <div className="md:mx-16">
          <div className="font-black text-[24px] md:text-[32px]">
            You can’t Change some Field once you Publish this {type}
          </div>
          <div className="text-[#9499AE] mt-[12px]">
            Do you want to publish anyway?
          </div>
          {type !== "DAO" && (
            <div className="message-info">
              Once transaction has made, Collection and NFT data will not be
              changeable except benefits fields.
            </div>
          )}
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

export default PublishProjectModal;
