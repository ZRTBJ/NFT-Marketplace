import React from 'react';
import thumbIcon from 'assets/images/profile/card.svg';
import Link from 'next/link';
import Image from 'next/image';

export default function TokenGatedProjectCard({ tokenGatedProject }) {
  return (
    <div className='md:min-h-[390px] '>
      <Link href={`/token-gated/${tokenGatedProject?.id}`}>
        <Image
          className='w-full h-[156px] rounded-xl md:h-[276px] object-cover'
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

      <div className='p-5'>
        <div className='flex items-center justify-between'>
          <h3 className='pb-2 text-txtblack truncate text-[18px] md:text-[24px]'>
            {tokenGatedProject?.title}
          </h3>
          <i className='fa-solid fa-ellipsis-vertical cursor-pointer'></i>
        </div>
        <p className='mb-3 text-textSubtle text-[13px]'>
          {tokenGatedProject?.description &&
          tokenGatedProject?.description?.length > 70
            ? tokenGatedProject?.description.substring(0, 67) + '...'
            : tokenGatedProject?.description}
        </p>
      </div>
    </div>
  );
}
