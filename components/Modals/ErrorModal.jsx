import IconError from 'assets/images/modal/error/error_modal_img.svg';
import Link from 'next/link';
import Modal from '../Commons/Modal';
import Image from 'next/image';

const ErrorModal = ({
  handleClose,
  show,
  title,
  message,
  buttomText,
  redirection,
  showCloseIcon = false,
}) => {
  const btnText = buttomText ? buttomText : 'CLOSE';
  const titleMsg = title ? title : 'Sorry, something went wrong.';
  const bodyMsg = message ? message : 'Please try again.';
  return (
    <Modal
      width={400}
      show={show}
      showCloseIcon={showCloseIcon}
      handleClose={() => handleClose(false)}
    >
      <div className='text-center'>
        <Image className='block mx-auto max-h-60	' src={IconError} alt='' />
        <div className='mb-4 text-[16px] font-bold txtblack'>{titleMsg}</div>
        <div className='my-4 font-bold text-[14px] txtblack'>{bodyMsg}</div>
        <div className='flex justify-center mb-4'>
          {redirection ? (
            <Link href={redirection}>
              <button
                type='button'
                className='btn bg-primary-50 text-primary-900 btn-sm'
                onClick={(e) => {
                  handleClose(false);
                }}
              >
                <span>{btnText}</span>
              </button>
            </Link>
          ) : (
            <button
              type='button'
              className='btn bg-primary-50 text-primary-900 btn-sm'
              onClick={(e) => {
                handleClose(false);
              }}
            >
              <span>{btnText}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ErrorModal;
