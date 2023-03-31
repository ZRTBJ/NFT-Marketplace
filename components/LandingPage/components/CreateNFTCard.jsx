import Image from 'next/image';
import React, { useState } from 'react';
import frame from 'assets/images/profile/nftFrame.svg';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import { useSelector } from 'react-redux';
import bg from 'assets/images/profile/bg-gradient.svg';
import { useRouter } from 'next/router';
import CreateNFTModal from 'components/Project/CreateDAOandNFT/components/CreateNFTModal.jsx';
import { getCurrentNetworkId } from 'util/MetaMask';
import { NETWORKS } from 'config/networks';

export default function CreateNFTCard({ size, setSwitchNetwork }) {
  const router = useRouter();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [showWalletConnectModal, setShowWalletConnectModal] = useState(false);
  const [showCreateNFTModal, setShowCreateNFTModal] = useState(false);
  const handelOnClick = async () => {
    let currentNetwork = await getCurrentNetworkId();
    // if (NETWORKS?.[currentNetwork]) {
    router.push(`/collection/create`);
    //   setSwitchNetwork(false);
    // } else {
    //   setSwitchNetwork(true);
    // }
  };
  return (
    <div>
      <p className='textSubtle-100 text-[20px] font-black my-4'>
        NFT Collection
      </p>
      <div
        className={`relative justify-between bg-black flex  items-center gap-x-5 shadow rounded-2xl ${
          size === 'lg'
            ? 'flex-col gap-y-5 rounded-bl-2xl rounded-br-2xl'
            : ' w-[515px] px-[30px] py-5'
        }`}
        style={{
          backgroundImage: `url(${bg.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className={`${
            size === 'lg'
              ? 'bg-white text-black text-center px-4 py-[95px] rounded-bl-2xl rounded-br-2xl w-full'
              : ' text-white'
          }`}
        >
          <p className=' text-[20px] font-black mb-1'>Create NFT Collection</p>
          <p
            className={`mb-4 break-word ${
              size === 'lg' ? 'text-[14px] mb-10 mt-3' : 'max-w-[300px]'
            }`}
          >
            Seamlessly launch your membership NFT, PFP, and generative art with
            DeCir’s no-code interface.{' '}
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
              Create Collection
            </button>
            <a
              href='https://decir.gitbook.io/decir/nft-creation'
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
      {showWalletConnectModal && (
        <WalletConnectModal
          showModal={showWalletConnectModal}
          closeModal={() => setShowWalletConnectModal(false)}
          noRedirection={false}
          navigateToPage={'dashboard?createNFT=true'}
        />
      )}
      {showCreateNFTModal && (
        <CreateNFTModal
          show={showCreateNFTModal}
          handleClose={() => {
            setShowCreateNFTModal(false);
          }}
        />
      )}
    </div>
  );
}
