import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import audioWeb from 'assets/images/token-gated/audioWeb.svg';
import playIcon from 'assets/images/token-gated/audioPlay.png';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Waveform = dynamic(() => import('./Waveform'), { ssr: false });
export default function AudioCardGrid({ content }) {
  const userinfo = useSelector((state) => state.user.userinfo);
  const createdAt = moment(content?.created_at);
  const [showPoster, setShowPoster] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const onClickPlay = () => {
    setShowPoster(false);
    setShowPlayer(true);
  };

  return (
    <div>
      {!userinfo?.id || content?.sensitive.toString() === 'true' ? (
        <>
          <div className='w-full bg-black-shade-900 rounded min-h-[240px]'>
            <div className='flex flex-wrap items-center gap-2 px-2 pt-2 text-white text-[12px]'>
              <div className='bg-danger-1 py-1 px-3 rounded'>18+</div>
              {content?.config_names && content?.config_names?.length > 0 && (
                <>
                  {content?.config_names.slice(0, 2)?.map((c, index) => (
                    <div key={index}>
                      <div className='bg-textSubtle py-1 px-3 rounded w-[60px] truncate'>
                        {c}
                      </div>
                    </div>
                  ))}
                  {content?.config_names &&
                    content?.config_names.length > 2 && (
                      <div className='bg-textSubtle py-1 px-3 rounded  truncate'>
                        +{content?.config_names.length - 2}
                      </div>
                    )}
                </>
              )}
            </div>
            <div className='text-center my-8 relative'>
              <Image
                className='h-[100px] w-full'
                src={audioWeb}
                height={100}
                width={100}
                alt='web'
                unoptimized
              />
              <i className='fa-solid fa-lock text-[34px] -ml-[30px] absolute top-10  text-white'></i>
            </div>

            <div className='flex gap-2 px-2 pt-6 text-white text-[12px] pb-3'>
              <div className='ml-auto  py-1 px-3 rounded w-[60px] truncate'></div>
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center justify-between'>
              <p className='text-txtblack text-[18px] font-black w-[95%] truncate'>
                <Link
                  href={`/token-gated/content/${content?.id}`}
                  className='!no-underline !text-txtblack'
                >
                  {content?.title}
                </Link>
              </p>
              <i className='fa-solid fa-ellipsis-vertical cursor-pointer'></i>
            </div>
            <div className='mt-2 flex items-center gap-2'>
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
                {content?.view_count} VIEWS
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='w-full bg-black-shade-900 rounded min-h-[240px] relative'>
            <div className='flex flex-wrap items-center gap-2 px-2 pt-2 text-white text-[12px]'>
              {content?.config_names && content?.config_names?.length > 0 && (
                <>
                  {content?.config_names.slice(0, 2)?.map((c, index) => (
                    <div key={index}>
                      <div className='bg-textSubtle py-1 px-3 rounded w-[60px] truncate'>
                        {c}
                      </div>
                    </div>
                  ))}
                  {content?.config_names &&
                    content?.config_names.length > 2 && (
                      <div className='bg-textSubtle py-1 px-3 rounded  truncate'>
                        +{content?.config_names.length - 2}
                      </div>
                    )}
                </>
              )}
            </div>
            {showPoster && (
              <div className='cursor-pointer' onClick={() => onClickPlay()}>
                <Image
                  className='h-[120px] w-full absolute w-full m-auto top-0 bottom-0 left-0 right-0 block object-cover '
                  src={audioWeb}
                  height={120}
                  width={100}
                  alt='web'
                  unoptimized
                />
                <Image
                  src={playIcon}
                  className='absolute w-full m-auto top-0 bottom-0 left-0 right-0 block h-[50px] w-[50px] object-cover '
                  height={50}
                  width={50}
                  unoptimized
                  alt='play png'
                ></Image>
              </div>
            )}
            {showPlayer && (
              <div className='px-4 mt-4'>
                <Waveform
                  id={content?.id}
                  url={
                    'https://splitterdev.blob.core.windows.net/uploads/track/5e1daa790e7e7aa8ba5b7f56/audio/2020011434809836263/original.flac'
                  }
                />
              </div>
            )}
          </div>
          <div className='mt-4'>
            <div className='flex items-center justify-between'>
              <p className='text-txtblack text-[18px] font-black w-[95%] truncate'>
                <Link
                  href={`/token-gated/content/${content?.id}`}
                  className='!no-underline !text-txtblack'
                >
                  {content?.title}
                </Link>
              </p>
              <i className='fa-solid fa-ellipsis-vertical cursor-pointer'></i>
            </div>
            <div className='mt-2 flex items-center gap-2'>
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
                {content?.view_count} VIEWS
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
