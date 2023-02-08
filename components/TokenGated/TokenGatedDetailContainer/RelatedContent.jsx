import Right from 'assets/images/arr-right.svg';
import Image from 'next/image';
import { useState } from 'react';
import AllTab from '../public/components/Tab/AllTab';

const RelatedContent = ({ projectId }) => {
  return (
    <div
      className='bg-[#303548] offcanvas offcanvas-end fixed bottom-0 flex flex-col max-w-full bg-white invisible bg-clip-padding shadow-sm outline-none transition duration-300 ease-in-out text-gray-700 top-0 right-0 border-none w-96'
      tabIndex='-1'
      id='offcanvasRight'
      aria-labelledby='offcanvasRightLabel'
    >
      <div
        id='offcanvasRightLabel'
        data-bs-dismiss='offcanvas'
        className='cursor-pointer absolute top-[50%] -left-[15%] w-[56px] h-[90px] bg-[#303548] flex items-center justify-center'
      >
        <Image src={Right} alt='hide' />
      </div>

      <div className='offcanvas-body flex-grow p-4 overflow-y-auto'>
        <div className='flex items-center justify-between'>
          <p className='text-[24px] font-bold text-white mt-4 mb-4'>For you</p>
          <button
            className='text-white md:hidden'
            id='offcanvasRightLabel'
            data-bs-dismiss='offcanvas'
          >
            <i className='fa-regular fa-xmark text-[20px]'></i>
          </button>
        </div>

        <AllTab project={{ id: projectId }} verticalList={true} />
      </div>
    </div>
  );
};

export default RelatedContent;
