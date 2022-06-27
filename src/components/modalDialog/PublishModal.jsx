import publishModalSvg from "assets/images/modal/publishModalSvg.png";
import Modal from "../Modal";

const PublishModal = ({ handleClose, show, publishProject }) => {
  return (
    <Modal
      height={480}
      width={800}
      show={show}
      handleClose={() => handleClose(false)}
    >
      <div className="text-center">
        <img
          className="h-[181px] w-[241px] mx-auto"
          src={publishModalSvg}
          alt=""
        />
        <h1> Ready to Publish a project?</h1>
        <div className="text-[#9499AE] mt-[12px]">
          Make sure you already check your project and fill the right data on
          it.
        </div>
        <div className="mt-[12px] max-w-[207px] mx-auto text-[13px] h-[35px]  rounded rounded-[8px] text-[##FFCF52] bg-secondary-100 px-[10px] py-[6px]">
          Polygon might taking some fee
        </div>
        <div className="flex justify-center mt-[30px]">
          <button
            className="btn-primary rounded  px-6 py-2 mr-6"
            onClick={publishProject}
          >
            Publish Project
          </button>
          <button
            className="btn-outline-primary px-6 py-2"
            onClick={() => handleClose(false)}
          >
            Back editing
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PublishModal;
