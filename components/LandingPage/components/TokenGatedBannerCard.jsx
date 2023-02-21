import Image from 'next/image';
import React from 'react';
import wave from 'assets/images/profile/multipleWeb.svg';
import lockLayer from 'assets/images/profile/lockLayer.svg';

export default function TokenGatedBannerCard() {
  return (
    <div>
      <p className='textSubtle-100 text-[20px] font-black my-4'>Token Gated</p>
      <div className='rounded-2xl bg-white drop-shadow-xl px-6 '>
        <div className='grid grid-cols-1 md:grid-cols-2 relative'>
          <div className='break-all'>
            {' '}
            <p className='text-black font-black text-[24px] md:text-[28px] mt-5'>
              Create Token Gated
            </p>
            <p className='mb-6 text-[14px]'>
              Lorem Ipsum is simply dummy text of the printing and Ipsum has
              been{' '}
            </p>
            <div className='flex flex-wrap items-center gap-4'>
              <button className='gradient-text-deep-pueple font-black border w-[228px] h-[40px] rounded-lg border-secondary-900'>
                Launch Membership NFT
              </button>
              <div className=' text-black font-black text-[14px] pb-4 md:pb-0'>
                How it work{' '}
                <i className='ml-2 fa-sharp fa-solid fa-arrow-right text-textSubtle-200 font-medium'></i>
              </div>
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
    </div>
  );
}
