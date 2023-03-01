import Image from 'next/image';
import React, { useState } from 'react';
import wave from 'assets/images/profile/multipleWeb.svg';
import lockLayer from 'assets/images/profile/lockLayer.svg';
import { useSelector } from 'react-redux';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import { createTokenGatedProject } from 'services/tokenGated/tokenGatedService';
import Spinner from 'components/Commons/Spinner';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
export default function TokenGatedBannerCard() {
  const router = useRouter();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [showWalletConnectModal, setShowWalletConnectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handelOnClick = async () => {
    if (userinfo?.id) {
      setIsLoading(true);
      const title = `Unnamed Project ${new Date().toISOString()}`;
      await createTokenGatedProject(title)
        .then((res) => {
          setIsLoading(false);
          if (res.code === 0) {
            router.push(`/token-gated/${res?.token_gate_project?.id}`);
          } else {
            toast.error(`Failed, ${res?.message}`);
          }
        })
        .catch((err) => {
          toast.error(`Failed, ${err}`);
          setIsLoading(false);
        });
    } else {
      setShowWalletConnectModal(true);
    }
  };
  return (
    <div>
      <p className='textSubtle-100 text-[20px] font-black my-4'>Token Gated</p>
      <div className='rounded-2xl bg-white drop-shadow-xl px-6 pt-5 pb-4 md:pb-0 border border-secondary-900'>
        <div className='grid grid-cols-1 md:grid-cols-2 relative'>
          <div className='break-all'>
            {' '}
            <p className='gradient-text-deep-pueple font-black text-[24px] md:text-[28px] mt-5 break-word'>
              Create Token Gated Experience
            </p>
            <p className='mb-6 text-[14px] break-word'>
              Curate exclusive gated content for your users and sell your NFTs
              as access.{' '}
            </p>
            <div className='flex flex-wrap items-center gap-4'>
              <button
                disabled={isLoading}
                onClick={() => handelOnClick()}
                className='gradient-text-deep-pueple font-black border w-[160px] text-center h-[40px] rounded-lg border-secondary-900'
              >
                {isLoading ? <Spinner forButton={true} /> : `Get started`}
              </button>
              <a
                href='https://decir.gitbook.io/decir/token-gated-contents/how-it-works'
                target='_blank'
                className='!no-underline text-black font-black text-[14px] cursor-pointer'
                rel='noreferrer'
              >
                How it works{' '}
                <i className='ml-2 fa-sharp fa-solid fa-arrow-right text-textSubtle-200 font-medium'></i>
              </a>
            </div>
          </div>
          <div className='hidden md:block'>
            <Image
              alt=''
              src={wave}
              height={180}
              width={200}
              className='h-[180px] w-full'
            ></Image>
            <Image
              alt=''
              src={lockLayer}
              height={157}
              width={200}
              className='w-[161px] h-[157px] absolute right-0 top-3'
            ></Image>
          </div>
        </div>
      </div>
      <WalletConnectModal
        showModal={showWalletConnectModal}
        closeModal={() => setShowWalletConnectModal(false)}
        noRedirection={true}
      />
    </div>
  );
}
