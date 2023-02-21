import React, { useState } from 'react';
import rectangleSVG from 'assets/images/profile/RectangleGradient.svg';
import Image from 'next/image';

export default function OnBoardingGuide() {
  const [open, setOPen] = useState(true);
  return (
    <div className='bg-gradient-to-b from-color-gray-dark to-color-gray-light rounded-b-2xl'>
      <div className=' overflow-x-auto md:max-w-[1239px] mx-auto px-6 '>
        <div className='flex flex-wrap items-center justify-center gap-4 text-black my-4'>
          <p className='break-normal  text-center text-[14px] '>
            👋🏻 <span className='font-black'>Welcome to DeCir</span>, Let’s get
            started with some guidance!
          </p>
          <button
            onClick={() => setOPen((pre) => !pre)}
            className='unset-all bg-transparent font-black'
          >
            {open ? 'Hide' : 'Expand'}{' '}
            <span>
              {open ? (
                <i className='fa-solid fa-chevrons-up'></i>
              ) : (
                <i className='fa-solid fa-chevrons-down'></i>
              )}
            </span>
          </button>
        </div>
        {open && (
          <div className='flex my-5 pb-3 gap-x-4 overflow-x-auto whitespace-nowrap'>
            <div className='min-w-[434px]  rounded-[8px] bg-gradient-to-r from-white to-secondary-200/[0.8]'>
              <div className='triangle'></div>
              <div className='flex items-center px-6 pb-3 -mt-4'>
                <div>
                  <div className='gradient-text-deep-pueple font-black text-[18px]'>
                    Create Your NFT
                  </div>
                  <p className='text-textSubtle-100 text-[14px]'>
                    Few step to create NFT without coding
                  </p>
                </div>
                <div className='ml-auto text-black font-black text-[14px]'>
                  Get started{' '}
                  <i className=' ml-2 fa-sharp fa-solid fa-arrow-right'></i>
                </div>
              </div>
            </div>
            <div className='min-w-[407px]  rounded-[8px] bg-gradient-to-r from-white to-secondary-200/[0.8]'>
              <div className='triangle'></div>
              <div className='flex items-center px-6 pb-3 -mt-4'>
                <div>
                  <div className='gradient-text-deep-pueple font-black text-[18px]'>
                    Guide tour
                  </div>
                  <p className='text-textSubtle-100 text-[14px]'>
                    Walk you thought the core function
                  </p>
                </div>
                <div className='ml-auto text-black font-black text-[14px]'>
                  Get started{' '}
                  <i class=' ml-2 fa-sharp fa-solid fa-arrow-right'></i>
                </div>
              </div>
            </div>
            <div className='min-w-[302px] rounded-[8px] bg-gradient-to-r from-white to-secondary-200/[0.8]'>
              <div className='triangle'></div>
              <div className='flex items-center px-6 pb-3 -mt-4'>
                <div>
                  <div className='gradient-text-deep-pueple font-black text-[18px]'>
                    Need help?
                  </div>
                  <p className='text-textSubtle-100 text-[14px]'>
                    Ask anything you need to support
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
