import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/router';
import Logo from 'assets/images/header/logo.svg';
import Link from 'next/link';
import Lottie from 'react-lottie';
import lottieJson from 'assets/lottieFiles/maintenance';
export default function Maintenance() {
  const router = useRouter();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieJson,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div>
      <nav className='pl-5 pr-7  lg:pl-10 lg:pr-12 shadow border-bottom'>
        <div className='flex justify-between items-center min-h-[71px]'>
          <div className='flex items-center flex-1'>
            <div
              className='cp mr-5 lg:ml-1 lg:mr-20'
              onClick={() => router.push('/')}
            >
              <Image src={Logo} alt='DeCir' />
            </div>
          </div>

          <div className='flex items-center' id='mobile-menu'>
            <a
              className='text-primary-900 font-bold text-[18px]'
              target='_blank'
              href={'https://decir.io/'}
              rel='noreferrer'
            >
              What’s DeCir
            </a>
          </div>
        </div>
      </nav>
      <div className='flex px-4 items-center justify-center mt-10 md:mt-[100px] text-center'>
        <div>
          <p className='font-black text-[24px]'>Maintenance Mode</p>
          <div className='mt-6 flex flex-wrap items-center justify-center gap-4'>
            <Image src={Logo} alt='DeCir' />
            <p className='text-[18px]'>is undergoing scheduled maintenance</p>
          </div>

          <Lottie
            options={defaultOptions}
            className='h-[400px] w-full md:max-w-[600px]'
            height={400}
          />
          <p className='mt-2 text-[18px]'>Sorry for the inconvenience</p>
          <p className='mt-2 pb-2 text-[18px]'>We will back shortly</p>
          <hr />
        </div>
      </div>
    </div>
  );
}
