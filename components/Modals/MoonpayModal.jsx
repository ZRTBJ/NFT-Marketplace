import { useEffect, useState } from 'react';
import IconError from 'assets/images/modal/error/error_modal_img.svg';
import Link from 'next/link';
import Modal from '../Commons/Modal';
import Image from 'next/image';
import {
  getPersonalSign,
  isWalletConnected,
  getWalletAccount,
} from 'util/MetaMask';

const MoonpayModal = ({
  handleClose,
  show,
}) => {
  const [account, setAccount] = useState("")
  useEffect(() => {
    fetchAccount()
  }, [])

  const fetchAccount = async () => {
    const address = await getWalletAccount();
    setAccount(address)
  }
  const src = `https://buy-staging.moonpay.io?baseCurrencyCode=USD&apiKey=pk_test_AG2hCibtgtMgggMKhLh7ijwaNKw6Mwy&currencyCode=eth&walletAddress=${account}`
  console.log("SRC", src)
  return (
    <Modal width={400} height={620} show={show} handleClose={() => handleClose(false)}>
      <div className='text-center' style={{marginTop: 30}}>
        <iframe
          allow="accelerometer; autoplay; camera; gyroscope; payment"
          frameborder="0"
          height="550px"
          src={src}
          width="100%"
        >
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    </Modal>
  );
};

export default MoonpayModal;
