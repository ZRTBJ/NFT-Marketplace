import React from 'react';
import Link from 'next/link';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
export default function NFTListCard({ nft }) {
  return (
    <>
      <div key={nft?.id} className='  bg-white'>
        <Link href={`/minted-nft-details/${nft?.id}/${nft?.token_id}`}>
          <img
            className='h-[176px] rounded-xl md:h-[276px]  object-cover w-full '
            src={nft?.asset?.path}
            alt=''
          />
        </Link>
        <div className='py-2 md:py-5 h-[156px] '>
          <div className='flex px-2'>
            <h3 className='mb-2 text-txtblack truncate flex-1  m-w-0  text-[24px]'>
              {nft?.name}
            </h3>
          </div>
          <div className='flex items-center px-2'>
            <p>
              <Link
                className='text-[13px] pr-2 !no-underline font-black text-textSubtle'
                href={`/collection-details/${nft?.collection_uuid}`}
              >
                {nft?.collection_name}
              </Link>
            </p>
            {nft.currency ? (
              <div className='ml-auto flex items-center'>
                <span className='text-[14px] font-bold'>
                  {nft?.price ? nft?.price : ''}
                </span>
                <img
                  src={nft.currency === 'eth' ? Eth : Polygon}
                  alt='currency logo'
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
