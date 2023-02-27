import React from 'react';
import thumbIcon from 'assets/images/profile/card.svg';
import Image from 'next/image';
import Link from 'next/link';
import MaintainDaoCommunitySteps from 'components/LandingPage/components/MaintainDaoCommunitySteps';

export default function DaoTable({ tableData }) {
  return (
    <>
      <div className='flex items-center gap-4 flex-wrap my-3'>
        <p className='textSubtle-100 text-[20px] font-black '>DAO Community</p>
        <Link
          href={`/dao/create`}
          className='contained-button rounded ml-auto !text-white'
        >
          Create DAO
        </Link>
      </div>
      <div className='relative gradient-border-new pt-5  md:h-[652px] custom-scrollbar hover:overflow-y-auto overflow-y-hidden'>
        <div className='mb-5'>
          {tableData &&
            tableData?.map((item, index) => (
              <div
                key={index}
                className='flex flex-nowrap min-w-[500px] pr-4 w-full items-center gap-4 mb-6'
              >
                <Image
                  src={
                    item.assets?.find((pic) => pic.name === 'cover')
                      ? item.assets?.find((pic) => pic.name === 'cover').path
                      : thumbIcon
                  }
                  width={88}
                  height={88}
                  alt={item.name}
                  className='rounded-xl h-[88px] w-[88px] object-cover '
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
                      <p className='text-[12px] m-0 truncate'>DAO Member</p>
                      <p className='font-black m-0 text-black text-[12px] truncate'>
                        {item?.summary?.member_count
                          ? item?.summary?.member_count
                          : '0'}
                      </p>
                    </div>
                    <div className='w-[40%] pr-2'>
                      <p className='m-0 text-[12px]'>Linked Collection</p>
                      <p className='m-0 text-[12px] font-black text-black truncate'>
                        {item?.summary?.collection_count
                          ? item?.summary?.collection_count
                          : '0'}
                      </p>
                    </div>
                  </div>
                </div>
                <Link href={`/dao/${item?.id}`}>
                  <i className='fa-solid fa-chevron-right'></i>
                </Link>
              </div>
            ))}
          {tableData?.length === 1 && <MaintainDaoCommunitySteps />}
        </div>
        <Link
          className='md:absolute  md:bottom-[10px] md:left-[50%] md:-translate-x-1/2 md:-translate-y-1/2  block mx-auto w-[100px] text-black font-black text-[14px] '
          href={`/list?type=dao`}
        >
          View All <i className=' ml-2 fa-sharp fa-solid fa-arrow-right'></i>
        </Link>
      </div>
    </>
  );
}
