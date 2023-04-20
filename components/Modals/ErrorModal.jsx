import IconError from 'assets/images/modal/error/error_modal_img.svg';
import IconLock from 'assets/images/profile/lockLayer.svg';
import Link from 'next/link';
import Modal from '../Commons/Modal';
import Image from 'next/image';
import { ls_GetWalletType } from 'util/ApplicationStorage';
import { magic } from 'config/magicWallet/magic';
import { useState } from 'react';
import Spinner from 'components/Commons/Spinner';

const ErrorModal = ({
  handleClose,
  show,
  title,
  message,
  buttomText,
  redirection,
  showCloseIcon = true,
  errorType = '',
}) => {
  const [fundsLoading, setFundsLoading] = useState(false);
  const btnText = buttomText ? buttomText : 'CLOSE';
  const titleMsg = title ? title : 'Sorry, something went wrong.';
  const bodyMsg = message ? message : 'Please try again.';
  let walletType = ls_GetWalletType();

  const handleAddFunds = async () => {
    setFundsLoading(true);
    await magic.wallet.showUI();
    setFundsLoading(false);
  };
  return (
    <Modal
      width={400}
      show={show}
      showCloseIcon={showCloseIcon}
      handleClose={() => handleClose(false)}
    >
      <div className='text-center'>
        <Image
          className={`block mx-auto max-h-60 ${
            errorType === 'user_not_logged_in' ? 'mb-4' : ''
          }`}
          src={errorType === 'user_not_logged_in' ? IconLock : IconError}
          alt=''
        />
        <div className='mb-4 text-[16px] font-bold txtblack'>{titleMsg}</div>
        <div className='my-4 font-bold text-[14px] txtblack max-h-40 overflow-y-auto'>
          {bodyMsg}
        </div>
        {walletType === 'magicwallet' ? (
          <button
            type='button'
            className='contained-button mb-5'
            onClick={handleAddFunds}
          >
            {fundsLoading ? <Spinner /> : <span>Add Funds</span>}
          </button>
        ) : null}
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
