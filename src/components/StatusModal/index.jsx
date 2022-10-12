import Modal from "../Modal";
import deploySuccessSvg from "assets/images/modal/deploySuccessSvg.svg";

const StatusModal = (props) => {
  const { isVisible, isLoading, status, onRequestClose } = props;

  return (
    <Modal
      width={800}
      show={isVisible}
      showCloseIcon={false}
      handleClose={onRequestClose}
    >
      <div className={"text-center md:my-6"}>
        {isLoading
          ? (
            <div className="md:mx-16">
              <div className="font-black text-[24px] md:text-[42px]">
                Please wait we’re publishing your Collection
              </div>
              <div className="overflow-hidden rounded-full h-4 w-full mt-4  md:mt-12 mb-8 relative animated fadeIn">
                <div className="animated-process-bar"></div>
              </div>
              <p className="text-center">{status}</p>
            </div>
          )
          : (
          <>
            <img
              className="h-[200px] md:w-[300px] mx-auto"
              src={deploySuccessSvg}
              alt=""
            />
            <div className="md:mx-16">
              <div className="font-black text-[24px] md:text-[42px]">
                {status}
              </div>
              <div className="flex justify-center mt-4 md:mt-[30px]">
                <button
                  className="ml-4 bg-primary-900/[0.20] text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]"
                  onClick={onRequestClose}
                >
                  Back
                </button>
              </div>
            </div>
          </>
          )}
      </div>
    </Modal>
  );
};

export default StatusModal;
