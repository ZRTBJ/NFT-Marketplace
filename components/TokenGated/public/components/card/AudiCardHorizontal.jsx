import React, { useState } from 'react';
import grayWeb from 'assets/images/token-gated/grayWeb.svg';
import playIcon from 'assets/images/token-gated/audioPlay.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
// const Waveform = dynamic(() => import('./Waveform'), { ssr: false });
export default function AudiCardHorizontal({ content }) {
  const userinfo = useSelector((state) => state.user.userinfo);
  const router = useRouter();
  const lockIcon = (
    <i className='fa-solid fa-lock text-[34px] text-black-shade-900 cursor-pointer '></i>
  );

  return (
    <div>
      <div className='flex items-center gap-4'>
        <div className='bg-[#D9D9D9] h-[200px] w-[180px] rounded'></div>
        <div
          className='w-full flex-grow cursor-pointer '
          onClick={() => router.push(`/token-gated/content/${content?.id}`)}
        >
          <div className='flex items-center gap-2 '>
            {content?.consumable_data ? (
              <Image
                src={playIcon}
                height={44}
                width={44}
                className='h-[50px] w-[50px] cursor-pointer'
                alt='play'
                unoptimized
              ></Image>
            ) : (
              lockIcon
            )}
            <div className='font-bold text-[24px] text-txtblack'>
              {content?.title}
            </div>
          </div>
          <Image
            src={grayWeb}
            height={100}
            width={100}
            className='w-full h-[100px] object-cover rounded mb-5'
            alt='web'
            unoptimized
          ></Image>

          <div className='flex flex-wrap items-center gap-2 px-2 pt-2 text-white text-[12px]'>
            {content?.sensitive && (
              <div className='bg-danger-1 py-1 px-3 rounded'>18+</div>
            )}
            {content?.config_names && content?.config_names?.length > 0 && (
              <>
                {content?.config_names.slice(0, 2)?.map((c, index) => (
                  <div key={index}>
                    <div className='bg-textSubtle py-1 px-3 rounded truncate'>
                      {c}
                    </div>
                  </div>
                ))}
                {content?.config_names && content?.config_names.length > 2 && (
                  <div className='bg-textSubtle py-1 px-3 rounded  truncate'>
                    +{content?.config_names.length - 2}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
