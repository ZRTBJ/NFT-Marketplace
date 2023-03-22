import Modal from '../Commons/Modal';
import deploySuccessSvg from 'assets/images/modal/deploySuccessSvg.svg';
import Image from 'next/image';
import Link from 'next/link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const StatusModal = (props) => {
  const {
    isVisible,
    isLoading,
    loadingMessage,
    successMessage,
    status,
    onRequestClose,
    contractAddress,
  } = props;

  return (
    <Modal
      width={600}
      show={isVisible}
      showCloseIcon={false}
      handleClose={onRequestClose}
      overflow='auto'
    >
      <div className={'text-center md:my-6'}>
        {isLoading ? (
          <div className='md:mx-16'>
            <div className='font-black text-[16px]'>{loadingMessage}</div>
            <div className='overflow-hidden rounded-full h-4 w-full mt-4  md:mt-12 mb-8 relative animated fadeIn'>
              <div className='animated-process-bar'></div>
            </div>
            <p className='text-center'>{status}</p>
          </div>
        ) : (
          <>
            <Image
              className='h-[200px] md:w-[320px] mx-auto'
              src={deploySuccessSvg}
              alt=''
            />
            <div className='md:mx-16'>
              <div className='font-black text-[16px]'>{successMessage}</div>
              {contractAddress ? (
                <div>
                  <p className='text-md font-bold'>Contract Address</p>
                  <div className='flex items-center'>
                    <p className='bg-primary-100 px-3 text-sm text-primary-900 rounded-xl'>
                      {contractAddress}
                    </p>
                    <CopyToClipboard text={contractAddress}>
                      <button className='ml-1 w-[32px] h-[32px] rounded-[4px] flex items-center justify-center cursor-pointer text-[#A3D7EF] active:text-black'>
                        <FontAwesomeIcon className='' icon={faCopy} />
                      </button>
                    </CopyToClipboard>
                  </div>
                  <p className='text-sm'>
                    Next, Go to other marketplaces and update the creator
                    royalty address. Click below for more details
                  </p>
                  <Link
                    href='https://decir.gitbook.io/whitepaper/royalty-splitter/how-to-create-the-royalty-splitter.'
                    passHref
                    target='_blank'
                  >
                    <button className='bg-primary-900 text-white text-lg px-6 py-1 rounded-xl mt-1'>
                      How to
                    </button>
                  </Link>
                  <p className='mt-4'>OR</p>
                </div>
              ) : null}
              <div className='flex justify-center mt-4 md:mt-[10px]'>
                <button
                  className='bg-primary-900/[0.20] text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]'
                  onClick={onRequestClose}
                >
                  Go Back
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
