import publishModalSvg from 'assets/images/modal/publishModalSvg.svg';
import Modal from 'components/Commons/Modal';
import Image from 'next/image';
import { useState } from 'react';

const PublishRoyaltyConfirmModal = ({ handleClose, show, publishProject }) => {
  const [agree, setAgree] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleAgree = (e) => {
    e.preventDefault();
    if (agree) {
      publishProject();
      setShowError(false);
    } else {
      setShowError(true);
    }
  };
  return (
    <Modal
      width={500}
      show={show}
      overflow='auto'
      handleClose={() => handleClose(false)}
    >
      <div className='text-center'>
        <Image
          className='h-[200px] md:w-[300px] mx-auto'
          src={publishModalSvg}
          alt='Publish modal svg'
          height={200}
          width={200}
        ></Image>
        <div className='md:mx-16'>
          <div className='font-black text-[28px] font-black'>
            Are you sure want to lock the splitter?
          </div>
          <div className='text-[#9499AE] mt-[12px]'>
            By creating this splitter, you agree that following fees will be
            deducted from your royalties when it will be collected.
          </div>
          <div className='text-[#9499AE] text-[14px] mt-[12px] flex items-center justify-between border-b-[1px] pb-2'>
            <span>Platform Fee</span> <span>2.5%</span>
          </div>
          <div className='text-[#9499AE] text-[14px] mt-[12px] flex items-center justify-between border-b-[1px] pb-2'>
            <span>Tax Fee</span> <span>1%</span>
          </div>
          <div className='text-[#000] text-[14px] font-black mt-[12px] flex items-center justify-between pb-2'>
            <span>Total</span> <span>3.5%</span>
          </div>
          <label htmlFor='agree-terms' className='flex mt-3'>
            <input
              type='checkbox'
              value={agree}
              id='agree-terms'
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <p className='text-[14px] text-[#303548] ml-2'>
              I Agree with{' '}
              <a
                href='https://www.decir.io/termsandcondition'
                target='_blank'
                rel='noreferrer'
              >
                terms and conditions
              </a>{' '}
              about sales.
            </p>
          </label>
          <div className='mt-[5px]'>
            {showError && !agree && (
              <p className='text-red-500 text-sm text-left mb-3 font-medium'>
                Please agree to terms and conditions
              </p>
            )}
            <button
              className='btn contained-button btn-sm w-full font-black text-[14px]'
              onClick={handleAgree}
            >
              I agree
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PublishRoyaltyConfirmModal;
