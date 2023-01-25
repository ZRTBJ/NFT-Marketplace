import IconSuccess from 'assets/images/modal/success/success_modal_img.svg';
import Modal from '../Commons/Modal';
import NewSuccess from 'assets/images/success-new.svg';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from 'react-toastify';

const SuccessModal = ({
  handleClose,
  show,
  message,
  subMessage,
  buttonText,
  redirection = '',
  showCloseIcon = false,
  link = '',
}) => {
  const router = useRouter();

  const btnText = buttonText ? buttonText : 'CLOSE';
  const bodyMsg = message ? message : 'Successfully saved.';

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success(`Link successfully copied`);
    }
  };
  return (
    <Modal
      width={500}
      show={show}
      handleClose={() => handleClose(false)}
      showCloseIcon={showCloseIcon}
    >
      <div className='text-center mt-2'>
        <Image className='block mx-auto h-[300px]' src={NewSuccess} alt='' />
        <div className='mb-4 text-[24px]  font-black txtblack md:w-[350px] mx-auto'>
          {bodyMsg}
        </div>
        <p className='text-[#7D849D] text-[14px] mb-2'>{subMessage}</p>
        {link ? (
          <div
            className='w-fit flex items-center rounded'
            style={{
              background:
                'linear-gradient(0deg, rgba(18, 36, 120, 0.05), rgba(18, 36, 120, 0.05)), #FFFFFF',
            }}
          >
            <div className='p-3 text-[#7D849D]'>
              <span className='font-black  mr-2'>{link}</span>
            </div>
            <div className='text-[#7D849D] p-3'>
              <i
                className='fa-regular fa-copy text-lg cursor-pointer'
                onClick={() => copyToClipboard()}
              ></i>
            </div>
          </div>
        ) : null}
        {link ? (
          <div className='flex justify-center'>
            <button
              type='button'
              className='rounded-[4px] contained-button mt-8 w-full text-[14px] font-black'
              onClick={(e) => {
                if (redirection) {
                  router.push(redirection);
                }
                handleClose(false);
              }}
            >
              <span>Finish</span>
            </button>
          </div>
        ) : (
          <div className='flex justify-center'>
            <button
              type='button'
              className='rounded-[4px] py-2 mt-2 mb-4 px-4 bg-primary-50 text-primary-900 min-w-[125px] text-[14px] font-black'
              onClick={(e) => {
                if (redirection) {
                  router.push(redirection);
                }
                handleClose(false);
              }}
            >
              <span>{btnText}</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SuccessModal;
