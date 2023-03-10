import React from 'react';
import bg from 'assets/images/profile/usecaseBg.svg';
export default function UseCase({ data }) {
  return (
    <div className='bg-white rounded-2xl'>
      <div
        className='rounded-2xl drop-shadow-xl p-6 h-full'
        style={{
          backgroundImage: `url(${bg.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10'>
          <div>
            <p
              style={{ wordBreak: 'break-word' }}
              className='text-black  text-[24px] md:text-[32px] leading-relaxed font-black'
            >
              Use case of <br /> {data?.usedFor}
            </p>
            <p className='break-word text-txtblack'>{data?.text}</p>
            {/* <div className=' mt-[52px] text-black font-black text-[14px]'>
              Learn more{' '}
              <i className='ml-2 fa-sharp fa-solid fa-arrow-right text-textSubtle-200 font-medium'></i>
            </div> */}
          </div>
          {data?.steps?.map((step, index) => (
            <div className='text-center' key={index}>
              <div className='bg-color-gray-dark h-[88px] w-[88px] mx-auto shadow rounded-lg'></div>
              <p className='text-black font-bold mt-4'>{step.title}</p>
              <p className=' break-word text-textSubtle-200'>
                {step?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
