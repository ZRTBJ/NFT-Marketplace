import React, { useState } from 'react';
import thumbIcon from 'assets/images/profile/card.svg';
import Image from 'next/image';
import Link from 'next/link';
import CreateNFTModal from 'components/Project/CreateDAOandNFT/components/CreateNFTModal.jsx';

export default function CollectionTable({ tableData }) {
  const [showCreateNFTModal, setShowCreateNFTModal] = useState(false);

  return (
    <>
      <div className='flex items-center gap-4 flex-wrap my-3'>
        <p className='textSubtle-100 text-[20px] font-black '>
          {' '}
          NFT Collection
        </p>
        <button
          onClick={() => setShowCreateNFTModal(true)}
          className='contained-button rounded ml-auto !text-white'
        >
          Create Collection
        </button>
      </div>

      <div className=' relative gradient-border-new pt-5 md:h-[652px] custom-scrollbar hover:overflow-y-auto overflow-y-hidden'>
        <div className='mb-5'>
          {tableData &&
            tableData?.map((item, index) => (
              <div
                key={index}
                className='flex flex-nowrap min-w-[500px] pr-4 w-full items-center gap-4 mb-6'
              >
                <Image
                  className='w-[88px] h-[88px] rounded-xl object-cover'
                  src={
                    item && item?.assets && item?.assets[0]
                      ? item?.assets[0]?.path
                      : thumbIcon
                  }
                  alt='cover'
                  width={88}
                  height={88}
                  unoptimized
                />
                <div className='flex-1'>
                  <p className='!font-black text-black text-[20px] mt-1 mb-4'>
                    {item?.name?.length > 24
                      ? `${item?.name?.substring(0, 24)}...`
                      : item?.name}
                  </p>
                  <div className='flex  items-center '>
                    <div className='w-[40%] pr-2'>
                      <p className='text-[12px] m-0 truncate'>
                        {item?.collection_symbol?.length > 10
                          ? `${item?.collection_symbol?.substring(0, 10)}...`
                          : item?.collection_symbol}
                      </p>
                      <p className='font-black m-0 text-black text-[12px] truncate'>
                        {item?.summary?.holding_value_usd
                          ? `$${item?.summary?.holding_value_usd.toFixed(
                              2
                            )} USD`
                          : '$0 USD'}
                      </p>
                    </div>
                    <div className='w-[40%] pr-2'>
                      <p className='m-0 text-[12px]'>Remaining / Supply</p>
                      <p className='m-0 text-[12px] font-black text-black truncate'>
                        {parseInt(item?.total_supply) -
                          parseInt(item?.summary?.sold_count)}
                        /{item?.total_supply}
                      </p>
                    </div>
                    <div className='w-[20%]'>
                      <p className='m-0 text-[12px]'>Owners</p>
                      <p className='m-0 text-[12px] font-black text-black truncate'>
                        {item?.summary?.buyer_count}
                      </p>
                    </div>
                  </div>
                </div>
                <Link href={`/collection/${item?.id}`}>
                  <i className='fa-solid fa-chevron-right'></i>
                </Link>
              </div>
            ))}
        </div>
        <Link
          className='md:absolute  md:bottom-[10px] md:left-[50%] md:-translate-x-1/2 md:-translate-y-1/2  block mx-auto w-[100px]  text-black font-black text-[14px] '
          href={`/list?type=collection&user=true`}
        >
          View All <i className=' ml-2 fa-sharp fa-solid fa-arrow-right'></i>
        </Link>
      </div>

      {showCreateNFTModal && (
        <CreateNFTModal
          show={showCreateNFTModal}
          handleClose={() => {
            setShowCreateNFTModal(false);
          }}
        />
      )}
    </>
  );
}
