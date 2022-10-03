import Modal from "components/Modal";
import deploySuccessSvg from "assets/images/modal/deploySuccessSvg.svg";
import { useHistory } from "react-router-dom";

const PublishingProductNFT = ({
  show,
  handleClose,
  step,
  collectionId,
  handleShowStepClose,
  fileSize,
  sizeUploaded,
  uploadedPercent,
  mode,
}) => {
  const history = useHistory();
  const handleNavigation = () => {
    history.push(`/collection-details/${collectionId}`);
    handleShowStepClose();
  };
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      width={700}
      showCloseIcon={false}
    >
      <div>
        {step === 1 && (
          <div className="mx-4 md:mx-16">
            <div className="font-black text-[24px] md:text-[42px]">
              Please wait we’re uploading. It may take a while.
            </div>
            {fileSize && uploadedPercent !== 100 ? (
              <div className="font-black text-[22px] md:text-[28px] md:leading-[42px] text-center mt-6">
                {sizeUploaded}kb of {fileSize}kb | {uploadedPercent}%
              </div>
            ) : null}
            {uploadedPercent === 100 ? (
              <div className="font-black text-[22px] md:text-[28px] md:leading-[42px] text-center mt-6">
                File uploaded successfully. We are{" "}
                {mode === "create" ? "creating " : "updating "} the Product NFT
                now
              </div>
            ) : null}
            <div className="overflow-hidden rounded-full h-4 w-full mt-8 mb-8 relative animated fadeIn">
              <div className="animated-process-bar"></div>
            </div>
            {/* {deployStatus.step === 1 && (
              <div className='text-center'>Erc20 Deployment</div>
            )}
            {deployStatus.step === 2 && (
              <div className='text-center'>ProjectToken Deployment</div>
            )} */}
            {/* <div className='flex justify-center mt-[30px]'>
              <button
                className='btn text-white-shade-900 bg-primary-900 btn-sm'
                onClick={() => handleClose(false)}
              >
                Cancel Minting
              </button>
            </div> */}
          </div>
        )}
        {step === 2 && (
          <>
            <img
              className="h-[200px] md:w-[300px] mx-auto"
              src={deploySuccessSvg}
              alt=""
            />
            <div className="mx-4 text-center">
              <div className="font-black text-[22px] md:text-[42px]">
                You successfully {mode === "create" ? "Created a " : "Update "}{" "}
                Product NFT!
              </div>
              {/* <p>Do you want to create New NFT? if yes let’s go!</p> */}
              <div className="flex justify-center mt-[30px]">
                <button
                  className="ml-4 bg-primary-900/[0.20] text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]"
                  onClick={handleNavigation}
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PublishingProductNFT;
