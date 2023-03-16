import Image from 'next/image';
import { walletAddressTruncate } from 'util/WalletUtils';
import { NETWORKS } from 'config/networks';
import ReactPaginate from 'react-paginate';

const SplitterList = ({
  royaltiesList,
  items,
  selectedTab,
  claimRoyaltyById,
  paginationSplitter,
  handleSplitterPageClick,
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
                {royaltiesList.length
                  ? royaltiesList.map((list, index) => (
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
                          {' '}
                          {list?.royalty_address ? (
                            <>
                              {' '}
                              <a
                                target='_blank'
                                rel='noopener noreferrer'
                                className='no-underline'
                                href={`${
                                  NETWORKS[list?.blockchain]
                                    ?.viewContractAddressUrl
                                }${list.royalty_address}`}
                              >
                                {walletAddressTruncate(list.royalty_address)}
                              </a>{' '}
                            </>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td class='whitespace-nowrap px-6 py-4'>
                          {list?.royalty_percent}
                        </td>
                        <td class='whitespace-nowrap px-6 py-4'>
                          {list?.collection_name}
                        </td>

                        <td class='whitespace-nowrap px-6 py-4'>
                          {list?.earnable_amount} Token
                        </td>
                        <td class='whitespace-nowrap px-6 py-4'>
                          {list.isLoading ? (
                            <div role='status' className=''>
                              <svg
                                aria-hidden='true'
                                className=' w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-secondary-900'
                                viewBox='0 0 100 101'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                  fill='currentColor'
                                />
                                <path
                                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                  fill='currentFill'
                                />
                              </svg>
                              <span className='sr-only'>Loading...</span>
                            </div>
                          ) : (
                            <>
                              <button
                                disabled={!list?.earnable_amount}
                                onClick={() => claimRoyaltyById(list)}
                                className='text-[#2AD100] text-[12px] font-bold border-[#2AD100] border-[1px] rounded-[8px] h-[32px] w-[88px]'
                              >
                                Claim
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
            {paginationSplitter.length > 0 && (
              <ReactPaginate
                className='flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6'
                pageClassName='px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack '
                breakLabel='...'
                nextLabel='>'
                onPageChange={handleSplitterPageClick}
                pageRangeDisplayed={3}
                pageCount={paginationSplitter.length}
                previousLabel='<'
                renderOnZeroPageCount={null}
                activeClassName='text-primary-900 bg-primary-900 !no-underline'
                activeLinkClassName='!text-txtblack !no-underline'
              />
            )}
            {!royaltiesList.length ? (
              <div className='flex items-center flex-col justify-center w-full h-[400px]'>
                <h2 className='!text-[20px] text-center'>
                  Sorry Buddy, <br />
                  You don’t have any Royalties yet. 😢{' '}
                </h2>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitterList;
