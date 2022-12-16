import Modal from 'components/Commons/Modal';
import deploySuccessSvg from 'assets/images/modal/deploySuccessSvg.svg';
import { useRouter } from 'next/router';
import Image from 'next/image';

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
  const router = useRouter();
  const handleNavigation = () => {
    router.push(`/collection/${collectionId}`);
    handleShowStepClose();
  };
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      width={550}
      showCloseIcon={false}
    >
      <div>
        {step === 1 && (
          <div className='mx-4 md:mx-16'>
            <div className='font-black text-[20px]'>
              Please wait we’re uploading. It may take a while.
            </div>
            {fileSize && uploadedPercent !== 100 ? (
              <div className='font-black text-[18px] text-center mt-6'>
                {sizeUploaded}kb of {fileSize}kb | {uploadedPercent}%
              </div>
            ) : null}
            {uploadedPercent === 100 ? (
              <div className='font-black text-[18px] text-center mt-6'>
                File uploaded successfully. We are{' '}
                {mode === 'create' ? 'creating ' : 'updating '} the Product NFT
                now
              </div>
            ) : null}
            <div className='overflow-hidden rounded-full h-4 w-full mt-8 mb-8 relative animated fadeIn'>
              <div className='animated-process-bar'></div>
            </div>
          </div>
        )}
        {step === 2 && (
          <>
            <Image
              className='h-[200px] md:w-[300px] mx-auto'
              src={deploySuccessSvg}
              alt='success svg'
              height={200}
              width={300}
            />
            <div className='mx-4 text-center'>
              <div className='font-black text-[18px]'>
                You successfully {mode === 'create' ? 'Created a ' : 'Update '}{' '}
                Product NFT!
              </div>
              <div className='flex justify-center mt-[30px]'>
                <button
                  className='ml-4 bg-primary-900/[0.20] text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]'
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
