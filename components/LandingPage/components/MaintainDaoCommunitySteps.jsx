import React from 'react';
import bg from 'assets/images/profile/bg-gradient.svg';
import Image from 'next/image';
import frame from 'assets/images/profile/daoFrame.svg';
const steps = [
  {
    title: 'Title/Headline',
    text: 'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
  },
  {
    title: 'Title/Headline',
    text: 'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
  },
  {
    title: 'Title/Headline',
    text: 'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
  },
];
export default function MaintainDaoCommunitySteps() {
  return (
    <div
      className='rounded-xl  px-4 py-4'
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='flex flex-wrap gap-6 items-center justify-between mb-2'>
        <div className='text-[20px] font-black md:max-w-[200px] text-black'>
          How to maintain your DAO community
        </div>
        <div className='relative order-first md:order-last'>
          <Image
            className=' h-[138px] w-[120] md:rotate-[15deg]'
            alt='nft frame'
            src={frame}
            height={138}
            width={120}
          ></Image>
        </div>
      </div>
      <div>
        {steps.map((i, index) => (
          <div key={index}>
            <div className='flex'>
              <div className='flex flex-col items-center mr-4'>
                <div>
                  <div className='flex bg-primary-900 items-center justify-center w-4 h-4 border rounded-full'></div>
                </div>
                {index !== 2 && (
                  <div className='w-px h-full bg-primary-900'></div>
                )}
              </div>
              <div className=''>
                <p className='font-black text-[14px] w-fit gradient-text-new mb-0'>{`Step ${
                  index + 1
                }`}</p>
                <p className='font-black text-[14px] mt-0 text-black'>
                  {i?.title}
                </p>
                <p className='ml-4 text-[12px] pb-4'>{i?.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
