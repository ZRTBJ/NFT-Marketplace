import Image from 'next/image';
import React, { useState } from 'react';
import frame from 'assets/images/profile/daoFrame.svg';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
export default function BuildDaoCard({ size }) {
  const router = useRouter();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [showWalletConnectModal, setShowWalletConnectModal] = useState(false);
  const handelOnClick = async () => {
    // if (userinfo?.id) {
    router.push(`/dao/create`);
    // } else {
    //   setShowWalletConnectModal(true);
    // }
  };
  return (
    <div>
      <p className='textSubtle-100 text-[20px] font-black my-4'>
        DAO Community
      </p>
      <div
        className={`relative justify-between bg-white flex  items-center gap-x-5 shadow rounded-2xl ${
          size === 'lg'
            ? 'flex-col gap-y-5 rounded-bl-2xl rounded-br-2xl'
            : ' w-[515px] px-[30px] py-5'
        }`}
      >
        <div
          className={`${
            size === 'lg'
              ? 'bg-white text-black text-center px-4 py-[95px] rounded-bl-2xl rounded-br-2xl w-full border-t'
              : ' text-black'
          }`}
        >
          <p className=' text-[20px] font-black mb-1'>Build DAO community</p>
          <p
            className={`mb-4 break-word ${
              size === 'lg'
                ? 'text-[14px] mb-10 mt-3'
                : 'max-w-[300px] text-textSubtle-200 pb-1'
            }`}
          >
            Build a vibrant web3 community designed for mutual benefits and
            shared prosperity.{' '}
          </p>
          <div
            className={`flex items-center ${
              size === 'lg' ? 'flex-col gap-y-6' : ''
            }`}
          >
            <button
              onClick={() => handelOnClick()}
              className='gradient-text-deep-pueple font-black border w-[170px] h-[40px] rounded-lg border-secondary-900'
            >
              Create DAO
            </button>
            <a
              href='https://decir.gitbook.io/decir/dao-establishment'
              target='_blank'
              className='!no-underline ml-4  font-black text-[14px]'
              rel='noreferrer'
            >
              Learn more{' '}
              <i className='ml-2 fa-sharp fa-solid fa-arrow-right font-medium'></i>
            </a>
          </div>
        </div>
        <div className={`${size === 'lg' ? 'order-first' : ''}`}>
          <Image
            alt='nft frame'
            className={`${size === 'lg' ? 'h-[254px]' : ''}`}
            src={frame}
            height={129}
            width={113}
          ></Image>
        </div>
      </div>
      <WalletConnectModal
        showModal={showWalletConnectModal}
        closeModal={() => setShowWalletConnectModal(false)}
        noRedirection={false}
        navigateToPage={'dao/create'}
      />
    </div>
  );
}
