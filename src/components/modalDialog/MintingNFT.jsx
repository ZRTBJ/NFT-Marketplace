import Modal from "components/Modal";
import deploySuccessSvg from "assets/images/modal/deploySuccessSvg.svg";
import { useHistory } from "react-router-dom";

const MintingNFT = ({
  show,
  handleClose,
  step,
  collectionId,
  handleShowStepClose,
}) => {
  const history = useHistory();
  const handleNavigation = () => {
    history.push(`/royality-management/${collectionId}`);
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
          <div className="mx-4 md:mx-16 text-center">
            <h1 className="text-[24px] md:text-[42px] ">
              Please wait we’re minting your NFT
            </h1>
            <div className="overflow-hidden rounded-full h-4 w-full mt-12 mb-8 relative animated fadeIn">
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
              className="h-[200px] w-[300px] mx-auto"
              src={deploySuccessSvg}
              alt=""
            />
            <div className="mx-4 md:mx-16">
              <h1 className="text-center text-[24px] md:text-[42px]">
                You have successfully Minted your NFT!
              </h1>
              <div className="flex justify-center mt-[30px]">
                <button
                  className="ml-4 bg-primary-900/[0.20] text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]"
                  onClick={handleNavigation}
                >
                  Check now
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default MintingNFT;
