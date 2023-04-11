import React from 'react';
import Link from 'next/link';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
import Bnb from 'assets/images/network/bnb.svg';
import Image from 'next/image';
import defaultImage from 'assets/images/defaultImage.svg';
import audioWeb from 'assets/images/token-gated/audioWeb.svg';

const currency = {
  eth: Eth,
  matic: Polygon,
  bnb: Bnb,
};
const imageRegex = new RegExp('image');

export default function NFTListCard({ nft }) {
  return (
    <div>
      <Link href={`/minted-nft/${nft?.id}/${nft?.token_id}`}>
        {imageRegex.test(nft?.asset?.asset_type) && (
          <Image
            className='rounded-xl h-[176px] md:h-[276px] w-full object-cover'
            src={nft?.asset?.path}
            alt='nft'
            width={276}
            height={276}
          />
        )}
        {nft?.asset?.asset_type === 'movie' ||
        nft?.asset?.asset_type === 'video/mp4' ? (
          <video
            className='h-[176px] md:h-[276px] w-full object-cover rounded-xl'
            controls
          >
            <source src={nft?.asset?.path} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        ) : null}
        {nft?.asset?.asset_type === 'audio' ||
        nft?.asset?.asset_type === 'audio/mpeg' ? (
          <div className='rounded-xl h-[176px] md:h-[276px] w-full bg-primary-900/[0.05] relative'>
            <Image
              src={audioWeb}
              className='w-full  absolute  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'
              height={100}
              width={50}
              unoptimized
              alt='play png'
            ></Image>

            <audio
              src={nft?.asset?.path}
              controls
              autoPlay={false}
              className='w-full bottom-0 left-0 absolute'
            />
          </div>
        ) : null}
      </Link>
      <div className='py-2 md:py-5 h-[156px]'>
        <div className='flex px-2'>
          <h3 className='mb-2 text-txtblack truncate flex-1  m-w-0  text-[24px]'>
            {nft?.name}
          </h3>
        </div>
        <div className='flex items-center px-2'>
          <p>
            <Link
              className='text-[13px] pr-2 !no-underline font-black text-textSubtle'
              href={`/collection/${nft?.collection_uuid}`}
            >
              {nft?.collection_name}
            </Link>
          </p>
          {nft.currency ? (
            <div className='ml-auto flex items-center'>
              <span className='text-[14px] font-bold'>
                {nft?.price ? nft?.price : ''}
              </span>
              <Image
                width={24}
                height={24}
                src={currency[nft.currency]}
                alt='currency logo'
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
