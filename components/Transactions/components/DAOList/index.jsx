import Image from 'next/image';
import Link from 'next/link';
import { walletAddressTruncate } from 'util/WalletUtils';
import { NETWORKS } from 'config/networks';
import ReactPaginate from 'react-paginate';

const DAOList = ({
  projectList,
  items,
  selectedTab,
  handleDAOClaim,
  paginationDAO,
  handleDAOPageClick,
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
                {projectList.length
                  ? projectList.map((list) => (
                      <tr class='border-b border-[#B1C1C8]' key={list.id}>
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
                          {list?.treasury_wallet ? (
                            <>
                              {' '}
                              <a
                                target='_blank'
                                rel='noopener noreferrer'
                                className='no-underline'
                                href={`${
                                  NETWORKS[list?.blockchain]
                                    ?.viewContractAddressUrl
                                }${list.treasury_wallet}`}
                              >
                                {walletAddressTruncate(list.treasury_wallet)}
                              </a>{' '}
                            </>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td class='whitespace-nowrap px-6 py-4'>-</td>
                        <td class='whitespace-nowrap px-6 py-4'>
                          <button
                            disabled={list?.status !== 'published'}
                            onClick={() => handleDAOClaim(list)}
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
            {paginationDAO.length > 0 && (
              <ReactPaginate
                className='flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6'
                pageClassName='px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack '
                breakLabel='...'
                nextLabel='>'
                onPageChange={handleDAOPageClick}
                pageRangeDisplayed={3}
                pageCount={paginationDAO.length}
                previousLabel='<'
                renderOnZeroPageCount={null}
                activeClassName='text-primary-900 bg-primary-900 !no-underline'
                activeLinkClassName='!text-txtblack !no-underline'
              />
            )}
            {!projectList.length ? (
              <div className='flex items-center flex-col justify-center w-full h-[400px]'>
                <h2 className='!text-[20px] text-center'>
                  Sorry Buddy, <br />
                  You don’t have any DAO group yet. 😢{' '}
                </h2>
                <p className='text-[16px] mt-1 mb-4'>
                  Let’s get start to create your DAO :{' '}
                </p>
                <Link href='/dao/create'>
                  <button className='contained-button-new text-[16px] w-[320px] mt-4'>
                    Create DAO
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

export default DAOList;
