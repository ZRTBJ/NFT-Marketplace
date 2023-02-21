import React from 'react';

export default function NFTUseCase() {
  return (
    <div className='bg-white rounded-2xl'>
      <div className='gradient-card-bg border border-2 border-secondary-900 rounded-2xl drop-shadow-xl p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10'>
          <div>
            <p className='text-black text-[24px] md:text-[32px] leading-relaxed font-black'>
              Use case of <br /> NFTs
            </p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and Ipsum has
              been{' '}
            </p>
            <div className=' mt-[52px] text-black font-black text-[14px]'>
              Learn more{' '}
              <i className='ml-2 fa-sharp fa-solid fa-arrow-right text-textSubtle-200 font-medium'></i>
            </div>
          </div>
          <div className='text-center'>
            <div className='bg-color-gray-dark h-[88px] w-[88px] mx-auto shadow rounded-lg'></div>
            <p className='text-black font-bold mt-4'>
              STEP 1 <br /> Title / headline
            </p>
            <p className='text-textSubtle-100'>
              Lorem Ipsum is simply dummy text of the printing and Ipsum has
              been text of the printing and Ipsum has{' '}
            </p>
          </div>{' '}
          <div className='text-center'>
            <div className='bg-color-gray-dark h-[88px] w-[88px] mx-auto shadow rounded-lg'></div>
            <p className='text-black font-bold mt-4'>
              STEP 2 <br /> Title / headline
            </p>
            <p className='text-textSubtle-100'>
              Lorem Ipsum is simply dummy text of the printing and Ipsum has
              been text of the printing and Ipsum has{' '}
            </p>
          </div>{' '}
          <div className='text-center'>
            <div className='bg-color-gray-dark h-[88px] w-[88px] mx-auto shadow rounded-lg'></div>
            <p className='text-black font-bold mt-4'>
              STEP 3 <br /> Title / headline
            </p>
            <p className='text-textSubtle-100'>
              Lorem Ipsum is simply dummy text of the printing and Ipsum has
              been text of the printing and Ipsum has{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
