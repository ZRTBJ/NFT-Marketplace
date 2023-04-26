import Modal from 'components/Commons/Modal';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import lottieJson from 'assets/lottieFiles/nft-minting-process';

const steps = [
  { title: 'Publishing Royalty Splitter' },
  { title: 'Deploying NFT to IPFS' },
  { title: 'Deploying Collection' },
  { title: 'Done' },
];

const PublishingModal = ({ handleClose, show }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieJson,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    handleStatus();
  }, []);

  const handleStatus = () => {
    if (currentStep < 5) {
      let interval = setInterval(() => {
        setCurrentStep((prevState) => prevState + 1);
      }, 3000);
    }
  };

  console.log(currentStep);
  return (
    <Modal width={600} show={show} handleClose={() => handleClose(false)}>
      <h2>Publishing NFT</h2>
      <p className='mt-2'>
        Please do not close this screen and sign transation when needed
      </p>
      <div className='flex items-center'>
        <div className='mt-8 ml-6'>
          <div className='relative text-gray-500 border-l border-l-4 border-gray-200 '>
            {steps?.map((step, index) => (
              <div className='mb-16 ml-6' key={index}>
                <div
                  className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-[18px] ${
                    currentStep >= index + 1 ? 'bg-green-200' : 'bg-gray-200'
                  }`}
                >
                  {currentStep === index ? (
                    <i class='fa-sharp fa-regular fa-arrows-rotate animate-spin'></i>
                  ) : currentStep >= index + 1 ? (
                    <svg
                      aria-hidden='true'
                      className='w-5 h-5 text-green-500 dark:text-green-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                  ) : (
                    <p className='text-txtblack'>{index + 1}</p>
                  )}
                </div>
                <p
                  className={`${
                    currentStep >= index + 1
                      ? 'text-txtblack'
                      : 'text-textSubtle'
                  }`}
                >
                  {step?.title}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Lottie options={defaultOptions} height={300} width={300} />
      </div>
    </Modal>
  );
};

export default PublishingModal;
