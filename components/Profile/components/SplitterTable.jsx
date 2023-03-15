import React, { useState } from 'react';
import CreateSplitter from 'components/Profile/components/CreateSplitter';
import Image from 'next/image';
import Link from 'next/link';
import { walletAddressTruncate } from 'util/WalletUtils';
import { NETWORKS } from 'config/networks';
import Spinner from 'components/Commons/Spinner';

export default function SplitterTable({
  data,
  isLoading,
  setShowCreateSplitter,
  setIsEditSplitter,
}) {
  return (
    <>
      <div className='pt-20'>
        <div className='mb-5 flex flex-wrap justify-between'>
          <p className='text-[24px] text-txtblack font-black'>
            Royalty Splitter
          </p>
          <button
            onClick={() => setShowCreateSplitter(true)}
            className=' gradient-text-deep-pueple font-black border w-[160px] text-center h-[40px] rounded-lg border-secondary-900'
          >
            <i className=' mr-2 fa-solid fa-plus'></i>
            Create New
          </button>
        </div>
        <div className='overflow-x- bg-white pt-4 rounded shadow auto '>
          <table className='w-full text-left !whitespace-nowrap  text-left text-sm font-light'>
            <thead className='border-b font-medium border-[#B1C1C8] '>
              <tr>
                <th scope='col' className='py-3 px-6 text-[#727E83]'>
                  NetWork
                </th>
                <th scope='col' className='py-3 px-6 text-[#727E83]'>
                  Splitter Name
                </th>
                <th scope='col' className='py-3 px-6 text-[#727E83]'>
                  Contract Address
                </th>
                <th scope='col' className='py-3 px-6 text-[#727E83]'>
                  Status
                </th>
                <th scope='col' className='py-3 px-6 text-[#727E83]'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5}>
                    <div className='text-center mt-10 mb-10'>
                      <Spinner />
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {data?.map((element, index) => (
                    <tr key={index} className='border-b border-[#B1C1C8]'>
                      <td className='py-4 px-6'>
                        {element?.blockchain && (
                          <Image
                            src={NETWORKS?.[element?.blockchain]?.icon}
                            alt='blockChain'
                            height={32}
                            width={32}
                          />
                        )}
                      </td>
                      <td className='py-4 px-6'>
                        {element?.name ? element?.name : '-'}
                      </td>
                      <td className='py-4 px-6'>
                        {element?.contract_address ? (
                          <>
                            {' '}
                            <a
                              target='_blank'
                              rel='noopener noreferrer'
                              className='no-underline'
                              href={`${
                                NETWORKS[element?.blockchain]
                                  ?.viewContractAddressUrl
                              }${element.contract_address}`}
                            >
                              {walletAddressTruncate(element.contract_address)}
                            </a>{' '}
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className='py-4 px-6'>
                        {element?.status === 'published' ? (
                          <div className='px-4 py-2 rounded w-[100px] bg-secondary-900/[0.10] text-secondary-900'>
                            Published
                          </div>
                        ) : (
                          <div className='text-center  py-2 rounded w-[100px] bg-white-filled-form text-textSubtle'>
                            Draft
                          </div>
                        )}
                      </td>
                      <td className='py-4 px-6'>
                        <i
                          className='fa-solid text-[18px] cursor-pointer fa-pen-to-square'
                          onClick={() => {
                            setIsEditSplitter(element?.id);
                          }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
