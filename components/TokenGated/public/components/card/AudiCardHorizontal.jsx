import React, { useState } from 'react';
import grayWeb from 'assets/images/token-gated/grayWeb.svg';
import playIcon from 'assets/images/token-gated/audioPlay.png';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Waveform = dynamic(() => import('./Waveform'), { ssr: false });
export default function AudiCardHorizontal({ content }) {
  const [showPoster, setShowPoster] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const onPlayClick = () => {
    setShowPoster(false);
    setShowPlayer(true);
  };
  return (
    <div>
      <div className='flex items-center gap-4'>
        <div className='bg-[#D9D9D9] h-[200px] w-[180px] rounded'></div>
        <div className='w-full flex-grow'>
          <div className='flex items-center gap-2 '>
            <Image
              src={playIcon}
              onClick={() => onPlayClick()}
              height={50}
              width={50}
              className='h-[50px] w-[50px] cursor-pointer'
              alt='play'
              unoptimized
            ></Image>
            <div className='font-bold text-[24px] text-txtblack'>
              {content?.title}
            </div>
          </div>
          {showPoster && (
            <Image
              src={grayWeb}
              height={100}
              width={100}
              className='w-full h-[100px] object-cover rounded mb-5'
              alt='web'
              unoptimized
            ></Image>
          )}
          {showPlayer && (
            <>
              <div className=' h-[100px] rounded mb-8'>
                <Waveform
                  id={content?.id}
                  url={
                    'https://splitterdev.blob.core.windows.net/uploads/track/5e1daa790e7e7aa8ba5b7f56/audio/2020011434809836263/original.flac'
                  }
                />
              </div>
            </>
          )}

          <div className='flex flex-wrap items-center gap-2 px-2 pt-2 text-white text-[12px]'>
            {content?.sensitive.toString() === 'true' && (
              <div className='bg-danger-1 py-1 px-3 rounded'>18+</div>
            )}
            {content?.config_names && content?.config_names?.length > 0 && (
              <>
                {content?.config_names.slice(0, 2)?.map((c, index) => (
                  <div key={index}>
                    <div className='bg-textSubtle py-1 px-3 rounded w-[60px] truncate'>
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
