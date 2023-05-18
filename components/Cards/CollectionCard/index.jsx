import React from 'react';
import thumbIcon from 'assets/images/profile/card.svg';
import Link from 'next/link';
import Image from 'next/image';
import tickSvg from 'assets/images/icons/tick.svg';
import { NETWORKS } from 'config/networks';
import { formatNumber } from 'accounting';

export default function CollectionCard({ collection }) {
  const truncateArray = (members) => {
    let slicedItems = members.slice(0, 3);
    return { slicedItems, restSize: members.length - slicedItems.length };
  };

  return (
    <div className='md:min-h-[390px] '>
      <Link href={`/collection/${collection?.id}`}>
        <Image
          className='w-full h-[156px] rounded-xl md:h-[276px] object-cover'
          src={
            collection && collection?.assets && collection?.assets[0]
              ? collection?.assets[0]?.path
              : thumbIcon
          }
          alt='collection Cover'
          width={400}
          height={276}
          unoptimized
        />
      </Link>

      <div className='py-3 px-1'>
        <div className='md:flex items-center flex-wrap mb-3'>
          <div className='flex-1 flex items-center gap-1 mb-2 md:mb-0'>
            {collection?.status === 'published' && (
              <Image src={tickSvg} alt='published svg' height={17} width={17} />
            )}
            <p className='text-txtblack truncate text-[18px] font-black'>
              {collection?.name && collection?.name?.length > 16
                ? collection?.name.substring(0, 14) + '...'
                : collection?.name}
            </p>
          </div>
          <div className='ml-auto'>
            {collection?.type === 'product' && (
              <p className='w-fit text-[10px] border-primary-900 border rounded  px-2 font-bold text-txtSubtle'>
                Product
              </p>
            )}
            {collection?.type === 'membership' && (
              <p className='w-fit text-[10px] border-secondary-900 border rounded  px-2 font-bold text-txtSubtle'>
                {' '}
                Membership
              </p>
            )}
          </div>
        </div>
        <div className='flex items-center'>
          {collection?.status === 'published' ? (
            <p className='text-[12px] font-semibold'>
              {parseInt(collection?.total_supply) -
                parseInt(collection?.summary?.sold_count)}
              /{collection?.total_supply} Remaining
            </p>
          ) : (
            <p className='text-[12px] font-semibold'>Not publish yet</p>
          )}

          <div className='ml-auto'>
            <div className='flex items-center gap-2'>
              <div className='ml-auto flex gap-1 items-center'>
                {collection?.blockchain && (
                  <Image
                    width={20}
                    height={20}
                    src={NETWORKS[collection?.blockchain]?.icon?.src}
                    alt='currency logo'
                  />
                )}
                <p className='text-[14px] font-black'>
                  {collection?.summary?.holding_value_usd
                    ? `$${formatNumber(
                        collection?.summary?.holding_value_usd.toFixed(2)
                      )}  USD`
                    : '$0 USD'}
                </p>
              </div>
            </div>
          </div>
        </div>
        {collection?.status === 'published' &&
          collection?.token_standard &&
          collection?.type === 'auto' && (
            <p className='text-primary-900 font-black'>
              <small>{collection?.token_standard}</small>
            </p>
          )}

        {/* <div className='flex items-center'>
          {collection?.members &&
            collection?.members?.length > 0 &&
            truncateArray(collection.members).slicedItems.map(
              (member, index) => (
                <Image
                  key={index}
                  src={member?.avatar}
                  alt={member?.id}
                  className='rounded-full w-9 h-9 -ml-2 border-2 border-white'
                  width={20}
                  height={20}
                />
              )
            )}
          {collection?.members && collection?.members?.length > 3 && (
            <div className='flex items-center mt-[6px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]'>
              <p className='text-[12px] text-[#9A5AFF]'>
                +{truncateArray(collection.members).restSize}
              </p>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}
