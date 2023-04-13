import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import coverDefault from 'assets/images/defaultImage.svg';
import DefaultProfilePicture from 'assets/images/defaultProfile.svg';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import penIcon from 'assets/images/profile/gradienPen.svg';
import Link from 'next/link';
import SocialLink from 'components/Commons/SocialLink';

export default function UserBasicInfo({ userInfo, sncList }) {
  //   console.log(userInfo, sncList);
  const bio = `Bio : ${
    userInfo?.biography
      ? userInfo?.biography
      : 'Add your bio,so that everyone can easily get to know you'
  }`;
  return (
    <div className='bg-white rounded-tl-2xl rounded-tr-2xl'>
      <Image
        src={userInfo?.cover ? userInfo?.cover : coverDefault}
        alt='cover'
        height={198}
        width={200}
        unoptimized
        className='w-full h-[198px] object-cover rounded-tl-2xl rounded-tr-2xl'
      ></Image>
      <div className='md:flex md:justify-between pt-5 px-4 md:px-10 pb-5'>
        <div className='md:flex gap-4  mb-4 md:mb-0'>
          <Image
            src={userInfo?.avatar ? userInfo?.avatar : DefaultProfilePicture}
            alt='avatar'
            height={152}
            width={152}
            unoptimized
            className='w-[152px] h-[152px] object-cover rounded-full mx-auto md:-mt-[105px] -mt-[100px] '
          ></Image>
          <div>
            <p className='break-all text-txtblack text-[14px] font-black md:text-[20px]'>
              {userInfo?.display_name}
            </p>
            <div className='flex items-center mt-2'>
              <i className='fa-solid fa-map-pin mr-[13px] text-danger-1 text-[14px]'></i>
              <span className='text-[13px] '>
                {userInfo?.area
                  ? userInfo?.area
                  : 'Location: Set your location'}
              </span>
            </div>
            <div className='flex items-center mt-2'>
              <i className='fa-solid fa-briefcase mr-[7px] text-danger-1 text-[14px]'></i>
              <span className='text-[13px] '>
                {userInfo?.job ? userInfo?.job : 'Job: Add you profession'}
              </span>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 items-end'>
          <Link href='/profile/settings'>
            <Image
              src={penIcon}
              height={32}
              width={32}
              className=''
              alt='pen'
            ></Image>
          </Link>
          <SocialLink links={sncList} />
        </div>
      </div>
      <div className='text-[14px] md:ml-[206px] pb-5 px-4 md:px-0'>
        <ReactReadMoreReadLess
          charLimit={200}
          readMoreText={'Read more ▼'}
          readLessText={'Read less ▲'}
          readMoreClassName='font-bold'
          readLessClassName='font-bold'
        >
          {bio}
        </ReactReadMoreReadLess>
      </div>
    </div>
  );
}
