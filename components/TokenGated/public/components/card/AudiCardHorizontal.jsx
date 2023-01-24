import React, { useState } from 'react';
import grayWeb from 'assets/images/token-gated/grayWeb.svg';
import playIcon from 'assets/images/token-gated/audioPlay.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import darkBg from 'assets/images/token-gated/darkBg.png';
import audioWeb from 'assets/images/token-gated/audioWeb.svg';
import moment from 'moment';
// const Waveform = dynamic(() => import('./Waveform'), { ssr: false });
export default function AudiCardHorizontal({ content }) {
  const userinfo = useSelector((state) => state.user.userinfo);
  const createdAt = moment(content?.created_at);
  const router = useRouter();
  const lockIcon = (
    <i className='fa-solid fa-lock text-[34px] text-black-shade-900 cursor-pointer '></i>
  );

  return (
    <div>
      <div className='flex items-center gap-4'>
        <div
          className='rounded relative'
          style={{
            backgroundImage: `url(${darkBg.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '200px',
            width: '180px',
          }}
        >
          <Image
            className='h-[120px] w-full absolute w-full m-auto top-0 bottom-0 left-0 right-0 block object-cover '
            src={audioWeb}
            height={120}
            width={100}
            alt='web'
            unoptimized
          />
          {content?.consumable_data ? (
            <Image
              src={playIcon}
              className='absolute w-full m-auto top-0 bottom-0 left-0 right-0 block h-[50px] w-[50px] object-cover '
              height={50}
              width={50}
              unoptimized
              alt='play png'
            ></Image>
          ) : (
            lockIcon
          )}
        </div>
        <div
          className='w-full flex-grow cursor-pointer '
          onClick={() => router.push(`/token-gated/content/${content?.id}`)}
        >
          <div>
            <div className='font-bold text-[24px] text-txtblack'>
              {content?.title}
            </div>
            <div className='flex items-center gap-2'>
              {content?.status === 'draft' ? (
                <span className='text-[12px] text-txtSubtle'>
                  Not Published yet
                </span>
              ) : (
                <span className='text-[12px] text-txtSubtle'>
                  Created On: {createdAt.fromNow()}
                </span>
              )}
              <span>-</span>
              <span className='text-[12px] text-txtSubtle'>
                {content?.view_count} Views
              </span>
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

          <div className='flex whitespace-nowrap items-center gap-2 px-2 pt-2 text-white text-[12px]'>
            {content?.sensitive.toString() === 'true' && (
              <div className='bg-danger-1 py-1 px-3 rounded '>18+</div>
            )}
            {content?.config_names && content?.config_names?.length > 0 && (
              <>
                {content?.config_names?.slice(0, 2)?.map((c, index) => (
                  <div
                    key={index}
                    className={`bg-textSubtle py-1 px-3 rounded ${
                      c && c?.length > 30 ? 'truncate' : ''
                    }`}
                  >
                    {c}
                  </div>
                ))}
                {content?.config_names && content?.config_names?.length > 2 && (
                  <div className='bg-textSubtle py-1 px-3 rounded'>
                    +{content?.config_names?.length - 2}
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
