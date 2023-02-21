import Image from 'next/image';
import React from 'react';
import frame from 'assets/images/profile/daoFrame.svg';

export default function BuildDaoCard() {
  return (
    <div>
      <p className='textSubtle-100 text-[20px] font-black my-4'>
        DAO Community
      </p>
      <div className='rounded-4 w-[515px] justify-between py-5 px-[30px] bg-white flex items-center gap-x-5 drop-shadow-xl rounded-lg'>
        <div>
          <p className='text-black text-[20px] font-black mb-1'>
            Build DAO community
          </p>
          <p className='text-textSubtle-200 mb-4 max-w-[300px]'>
            Lorem Ipsum is simply dummy text of the printing and Ipsum has been{' '}
          </p>
          <div className='flex items-center'>
            <button className='gradient-text-deep-pueple font-black border w-[170px] h-[40px] rounded-lg border-secondary-900'>
              Create DAO
            </button>
            <div className=' ml-4 text-black font-black text-[14px]'>
              Learn more{' '}
              <i className='ml-2 fa-sharp fa-solid fa-arrow-right text-textSubtle-200 font-medium'></i>
            </div>
          </div>
        </div>
        <div>
          <Image alt='nft frame' src={frame} height={129} width={113}></Image>
        </div>
      </div>
    </div>
  );
}
