import Image from 'next/image';
import Link from 'next/link';
import { walletAddressTruncate } from 'util/WalletUtils';
import { NETWORKS } from 'config/networks';
import ReactPaginate from 'react-paginate';

const CollectionList = ({
  collectionList,
  items,
  selectedTab,
  handleWithdrawModel,
  paginationCollection,
  handleCollectionPageClick,
}) => {
  return (
    <div class='flex flex-col'>
      <div class='overflow-x-auto'>
        <div class='inline-block min-w-full py-2'>
          <div class='overflow-hidden'>
            <table class='min-w-full text-left text-sm font-light'>
              <thead class='border-b font-medium border-[#B1C1C8]'>
                <tr>
                  {items[selectedTab].headers.map((title, index) => (
                    <th
                      key={index}
                      scope='col'
                      class='px-6 py-4 text-[#727E83]'
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {collectionList.length
                  ? collectionList.map((list, index) => (
                      <tr key={index} class='border-b border-[#B1C1C8]'>
                        <td class='whitespace-nowrap px-6 py-4'>
                          <Image
                            src={NETWORKS?.[list?.blockchain]?.icon}
                            alt='Eth'
                            height={32}
                            width={32}
                          />
                        </td>
                        <td class='whitespace-nowrap px-6 py-4'>
                          {list?.name}
                        </td>
                        <td class='whitespace-nowrap px-6 py-4'>
                          {' '}
                          {list?.contract_address ? (
                            <>
                              {' '}
                              <a
                                target='_blank'
                                rel='noopener noreferrer'
                                className='no-underline'
                                href={`${
                                  NETWORKS[list?.blockchain]
                                    ?.viewContractAddressUrl
                                }${list.contract_address}`}
                              >
                                {walletAddressTruncate(list.contract_address)}
                              </a>{' '}
                            </>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td class='whitespace-nowrap px-6 py-4'>
                          ~${' '}
                          {list?.summary?.holding_value_usd
                            ? list?.summary?.holding_value_usd
                            : 0}
                        </td>
                        <td class='whitespace-nowrap px-6 py-4'>
                          <button
                            disabled={list?.summary?.holding_value === 0}
                            onClick={(e) => handleWithdrawModel(e, list)}
                            className='text-[#2AD100] text-[12px] font-bold border-[#2AD100] border-[1px] rounded-[8px] h-[32px] w-[88px]'
                          >
                            Claim
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
            {paginationCollection.length > 0 && (
              <ReactPaginate
                className='flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6'
                pageClassName='px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack '
                breakLabel='...'
                nextLabel='>'
                onPageChange={handleCollectionPageClick}
                pageRangeDisplayed={3}
                pageCount={paginationCollection.length}
                previousLabel='<'
                renderOnZeroPageCount={null}
                activeClassName='text-primary-900 bg-primary-900 !no-underline'
                activeLinkClassName='!text-txtblack !no-underline'
              />
            )}
            {!collectionList.length ? (
              <div className='flex items-center flex-col justify-center w-full h-[400px]'>
                <h2 className='!text-[20px] text-center'>
                  Sorry Buddy, <br />
                  You don’t have any NFT Collection yet. 😢{' '}
                </h2>
                <p className='text-[16px] mt-1 mb-4'>
                  Let’s get start to create your collection :{' '}
                </p>
                <Link href='/collection/create'>
                  <button className='contained-button-new text-[16px] w-[320px] mt-4'>
                    Create collection
                  </button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionList;
