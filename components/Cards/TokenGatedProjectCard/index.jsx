import React from 'react';
import thumbIcon from 'assets/images/profile/card.svg';
import Link from 'next/link';
import Image from 'next/image';

export default function TokenGatedProjectCard({ tokenGatedProject }) {
  return (
    <div className='md:min-h-[390px] '>
      <Link href={`/token-gated/${tokenGatedProject?.id}`}>
        <Image
          className='w-full h-[156px] rounded md:h-[276px] object-cover'
          src={
            tokenGatedProject &&
            tokenGatedProject?.assets &&
            tokenGatedProject?.assets[0]
              ? tokenGatedProject?.assets[0]?.path
              : thumbIcon
          }
          alt=''
          width={400}
          height={276}
        />
      </Link>

      <div className='pt-4 px-2'>
        <div className=''>
          <p className='text-txtblack font-black truncate text-[18px] '>
            {tokenGatedProject?.title}
          </p>
          <p className='text-txtSubtle text-[14px]'>
            {tokenGatedProject?.total_content} Content
          </p>
          <Link href={`/token-gated/${tokenGatedProject?.id}`}>
            <p className='cursor-pointer text-[#30A5DC] font-bold text-[14px]'>
              See Detail
              <span>
                <i className='ml-2 fa-solid fa-right-long'></i>
              </span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
