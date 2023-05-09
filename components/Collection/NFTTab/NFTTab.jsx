import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import emptyStateCommon from 'assets/images/profile/emptyStateCommon.svg';
import audioWeb from 'assets/images/token-gated/audioWeb.svg';
import Cover from 'assets/images/cover-default.svg';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
import Bnb from 'assets/images/network/bnb.svg';
import darkBg from 'assets/images/token-gated/darkBg.png';
import playIcon from 'assets/images/token-gated/audioPlay.svg';

const imageRegex = new RegExp('image');
const currency = {
  eth: Eth,
  matic: Polygon,
  bnb: Bnb,
};

export default function NFTTab({
  Collection,
  NFTs,
  onShowSalesPageModal,
  onNFTSort,
  nftListSortBy,
}) {
  const router = useRouter();
  let isSupplyOver = Collection?.total_supply <= NFTs?.length;

  const checkSalesStatus = (nft) => {
    let status = '';
    if (
      Collection?.status === 'published' &&
      typeof nft?.more_info?.price === 'number' &&
      nft?.more_info?.currency &&
      nft?.more_info?.start_datetime &&
      nft?.more_info?.end_datetime
    ) {
      status = 'ready';
    } else {
      status = 'not_ready';
    }
    return status;
  };
  const redirectToEditNFTPage = (nft) => {
    let nft_type = nft?.nft_type;
    let nft_id = nft?.id;
    let collection_id = Collection?.id;
    if (nft_type === 'auto') {
      router.push(`/nft/create?collection_id=${collection_id}&nftId=${nft_id}`);
    } else if (nft_type === 'membership') {
      router.push(
        `/nft/membership/create?collection_id=${collection_id}&nftId=${nft_id}`
      );
    } else if (nft_type === 'product') {
      router.push(
        `/nft/product/create?collectionId=${collection_id}&nftId=${nft_id}`
      );
    }
  };
  const showSalesModal = (e, nft) => {
    const salesInfo = {
      event: e,
      collection_type: Collection?.type,
      nft_id: nft?.id,
      supply: nft?.supply,
    };
    onShowSalesPageModal(salesInfo);
  };
  const showSalesButton = (nft) => {
    let show = 'false';
    const nft_type = nft?.nft_type;
    if (nft_type === 'product' && checkSalesStatus(nft) === 'ready') {
      show = 'true';
    } else if (nft_type === 'membership' && checkSalesStatus(nft) === 'ready') {
      show = 'true';
    } else if (nft_type === 'auto' && nft?.token_id) {
      show = 'true';
    }
    return show;
  };
  const showSalesSettingButton = (nft) => {
    let show = 'false';
    if (
      Collection?.type === 'membership' &&
      checkSalesStatus(nft) === 'not_ready'
    ) {
      show = 'true';
    }
    return show;
  };

  return (
    <>
      {NFTs?.length === 0 && (
        <div className='w-full my-14'>
          <Image
            src={emptyStateCommon}
            className='h-[210px] w-[315px] m-auto'
            alt=''
            width={315}
            height={210}
          />
          <p className='font-bold text-center mb-4'>
            You don't have any NFT yet. Start creating NFT now
          </p>
          {Collection?.is_owner ? (
            <div
              onClick={
                Collection.type === 'product' && isSupplyOver
                  ? null
                  : () =>
                      router.push(
                        `${
                          Collection?.type === 'product'
                            ? `/nft/product/create?collectionId=${Collection?.id}`
                            : Collection?.type === 'membership'
                            ? `/nft/membership/create?collection_id=${Collection?.id}`
                            : `/nft/create?collection_id=${Collection?.id}`
                        }`
                      )
              }
              className={`mint-button mt-3 text-center w-[150px] mx-auto font-satoshi-bold  px-4 ${
                Collection.type === 'product' && isSupplyOver ? 'grayscale' : ''
              }`}
            >
              <span>+ Create NFT</span>
            </div>
          ) : null}
        </div>
      )}

      {/* table for desktop */}
      {NFTs?.length > 0 && (
        <div className='hidden md:block'>
          <div className='my-6 justify-end flex items-center gap-4'>
            <div className='dropdown relative w-auto'>
              <button
                className='bg-white dropdown-toggle p-4 text-textSubtle font-black font-satoshi-bold rounded border flex items-center justify-between  w-44  h-[40px]'
                type='button'
                id='dropdownMenuButton1'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                <span className=''> Sort Of</span>
                <i className='fa-solid fa-angle-down hidden md:block'></i>
                {/* <Image src={Sort} alt='sort' className='block md:hidden' /> */}
              </button>

              <ul
                className='dropdown-menu w-[150px] md:w-full absolute hidden bg-white text-base z-50 py-2 list-none rounded-lg shadow-main  mt-1 '
                aria-labelledby='dropdownMenuButton1'
              >
                <li onClick={() => onNFTSort('newer')}>
                  <div
                    className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                      nftListSortBy === 'newer'
                        ? 'text-primary-900'
                        : 'text-txtblack'
                    } hover:bg-slate-50 transition duration-150 ease-in-out`}
                  >
                    Newer
                  </div>
                </li>
                <li onClick={() => onNFTSort('older')}>
                  <div
                    className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                      nftListSortBy === 'older'
                        ? 'text-primary-900'
                        : 'text-txtblack'
                    } hover:bg-slate-50 transition duration-150 ease-in-out`}
                  >
                    Older
                  </div>
                </li>
              </ul>
            </div>
            {Collection?.is_owner ? (
              <div
                onClick={
                  Collection.type === 'product' && isSupplyOver
                    ? null
                    : () =>
                        router.push(
                          `${
                            Collection?.type === 'product'
                              ? `/nft/product/create?collectionId=${Collection?.id}`
                              : Collection?.type === 'membership'
                              ? `/nft/membership/create?collection_id=${Collection?.id}`
                              : `/nft/create?collection_id=${Collection?.id}`
                          }`
                        )
                }
                className={`mint-button text-center font-satoshi-bold w-44  h-[40px] ${
                  Collection.type === 'product' && isSupplyOver
                    ? 'grayscale'
                    : ''
                }`}
              >
                <span>+ Create NFT</span>
              </div>
            ) : null}
          </div>

          <div className='relative overflow-y-hidden  overflow-x-auto custom-scrollbar my-10 shadow'>
            <table className='w-full text-left '>
              <thead className='whitespace-nowrap border'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-5 text-txtblack !font-bold min-w-[200px]'
                  >
                    Asset
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-5 text-txtblack !font-bold'
                  >
                    Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-5 text-txtblack !font-bold'
                  >
                    Pricing
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-5 text-txtblack !font-bold'
                  >
                    Supply
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-5 text-txtblack !font-bold'
                  >
                    Sales Status
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-5 text-txtblack !font-bold'
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {NFTs?.map((nft, index) => (
                  <tr
                    key={index}
                    className={` ${
                      NFTs?.length !== index + 1 ? 'border-b ' : ''
                    } `}
                  >
                    <td className='whitespace-nowrap px-6 py-5'>
                      <a target='blank' href={`${nft?.asset?.path}`}>
                        {imageRegex.test(nft?.asset?.asset_type) && (
                          <Image
                            className='rounded-xl h-[100px] w-[100px] object-cover'
                            src={nft?.asset?.path ? nft?.asset?.path : Cover}
                            alt='nft asset'
                            width={80}
                            height={80}
                            unoptimized
                          />
                        )}
                        {nft?.asset?.asset_type === 'movie' ||
                        nft?.asset?.asset_type === 'video/mp4' ? (
                          <div
                            className='rounded-xl relative'
                            style={{
                              backgroundImage: `url(${darkBg.src})`,
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              height: '100px',
                              width: '100px',
                            }}
                          >
                            <div className='absolute  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md'>
                              <i className='fa-solid fa-circle-video gradient-text text-[20px]'></i>
                            </div>
                          </div>
                        ) : null}
                        {nft?.asset?.asset_type === 'audio' ||
                        nft?.asset?.asset_type === 'audio/mpeg' ? (
                          <div
                            className='rounded-xl relative'
                            style={{
                              backgroundImage: `url(${darkBg.src})`,
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              height: '100px',
                              width: '100px',
                            }}
                          >
                            <Image
                              src={audioWeb}
                              className='w-full  absolute  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'
                              height={100}
                              width={50}
                              unoptimized
                              alt='play png'
                            ></Image>
                            <Image
                              src={playIcon}
                              className='absolute  m-auto top-0 bottom-0 left-0 right-0 block h-[30px] w-[30px] object-cover'
                              height={30}
                              width={30}
                              unoptimized
                              alt='play png'
                            ></Image>
                          </div>
                        ) : null}
                      </a>
                    </td>
                    <td className='whitespace-nowrap px-6 py-5'>
                      <Link
                        className='hover:text-txtblack !no-underline font-black text-[14px]'
                        href={`/nft/${nft?.nft_type}/${nft.id}`}
                      >
                        {nft?.name}
                      </Link>
                    </td>
                    <td className='whitespace-nowrap px-6  py-5'>
                      <span className='text-[14px] font-bold'>
                        {nft?.more_info?.price}
                      </span>
                      <span className='uppercase text-[14px] ml-1'>
                        {nft?.more_info?.currency}
                      </span>
                      {nft?.more_info?.currency ? (
                        <Image
                          className='inline-flex ml-2'
                          src={currency[nft?.more_info?.currency]}
                          alt='currency'
                          width={24}
                          height={24}
                        />
                      ) : null}
                    </td>
                    <td className='whitespace-nowrap px-6 py-5'>
                      <p className='text-[14px]'>{nft?.supply}</p>
                    </td>
                    <td className='whitespace-nowrap px-6 py-5'>
                      {showSalesButton(nft) === 'true' ? (
                        <p className='whitespace-nowrap w-fit py-2 px-4 rounded bg-primary-900 bg-opacity-10 text-primary-900 text-[13px] font-black'>
                          Ready for sale
                        </p>
                      ) : (
                        <p className='whitespace-nowrap py-1 w-fit px-4 rounded bg-secondary-900 bg-opacity-10 text-secondary-900 text-[13px] font-black'>
                          Not ready for sale
                        </p>
                      )}
                    </td>
                    <td className='whitespace-nowrap gap-4 px-6 py-5'>
                      {Collection?.is_owner && (
                        <>
                          <button
                            onClick={() => redirectToEditNFTPage(nft)}
                            className={`outlined-button font-satoshi-bold mb-3 text-[14px] mr-4  ${
                              Collection?.type === 'product' &&
                              nft?.freeze_metadata
                                ? 'cursor-not-allowed'
                                : 'cursor-pointer'
                            }`}
                          >
                            <span>Edit</span>
                          </button>
                          {showSalesButton(nft) === 'true' && (
                            <Link
                              href={`/nft/${nft?.nft_type}/${nft.id}`}
                              className='py-[10px] px-4 border-2 rounded border-primary-900
                        text-primary-900 font-black text-[14px] mr-4'
                            >
                              Sale Page
                            </Link>
                          )}
                          {showSalesSettingButton(nft) === 'true' && (
                            <button
                              onClick={(e) => showSalesModal(e, nft)}
                              className='py-2 px-4 border-2 rounded border-secondary-900 text-secondary-900 font-black text-[14px]'
                            >
                              Sale Setting
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* table for mobile */}
      {NFTs?.length > 0 && (
        <>
          <div className='my-6 justify-end md:hidden flex items-center gap-4'>
            <div className='dropdown relative w-auto'>
              <button
                className='bg-white dropdown-toggle p-4 text-textSubtle font-black font-satoshi-bold rounded border flex items-center justify-between  w-44  h-[40px]'
                type='button'
                id='dropdownMenuButton1'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                <span className=''> Sort Of</span>
                <i className='fa-solid fa-angle-down hidden md:block'></i>
                {/* <Image src={Sort} alt='sort' className='block md:hidden' /> */}
              </button>

              <ul
                className='dropdown-menu w-[150px] md:w-full absolute hidden bg-white text-base z-50 py-2 list-none rounded-lg shadow-main  mt-1 '
                aria-labelledby='dropdownMenuButton1'
              >
                <li onClick={() => onNFTSort('newer')}>
                  <div
                    className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                      nftListSortBy === 'newer'
                        ? 'text-primary-900'
                        : 'text-txtblack'
                    } hover:bg-slate-50 transition duration-150 ease-in-out`}
                  >
                    Newer
                  </div>
                </li>
                <li onClick={() => onNFTSort('older')}>
                  <div
                    className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                      nftListSortBy === 'older'
                        ? 'text-primary-900'
                        : 'text-txtblack'
                    } hover:bg-slate-50 transition duration-150 ease-in-out`}
                  >
                    Older
                  </div>
                </li>
              </ul>
            </div>
            {Collection?.is_owner ? (
              <div
                onClick={
                  Collection.type === 'product' && isSupplyOver
                    ? null
                    : () =>
                        router.push(
                          `${
                            Collection?.type === 'product'
                              ? `/nft/product/create?collectionId=${Collection?.id}`
                              : Collection?.type === 'membership'
                              ? `/nft/membership/create?collection_id=${Collection?.id}`
                              : `/nft/create?collection_id=${Collection?.id}`
                          }`
                        )
                }
                className={`mint-button text-center font-satoshi-bold w-44  h-[40px] ${
                  Collection.type === 'product' && isSupplyOver
                    ? 'grayscale'
                    : ''
                }`}
              >
                <span>+ Create NFT</span>
              </div>
            ) : null}
          </div>
          <div className='md:hidden flex flex-col gap-[50px] w-full mb-24'>
            {NFTs?.map((nft, index) => (
              <div key={index}>
                <Link href={`/nft/${nft?.nft_type}/${nft.id}`}>
                  {imageRegex.test(nft?.asset?.asset_type) && (
                    <Image
                      className='rounded-xl h-[200px] w-full object-cover'
                      src={nft?.asset?.path ? nft?.asset?.path : Cover}
                      alt='nft asset'
                      width={80}
                      height={80}
                      unoptimized
                    />
                  )}
                  {nft?.asset?.asset_type === 'movie' ||
                  nft?.asset?.asset_type === 'video/mp4' ? (
                    <video
                      className='rounded-xl h-[200px] w-full object-cover'
                      controls
                    >
                      <source src={nft?.asset?.path} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                  {nft?.asset?.asset_type === 'audio' ||
                  nft?.asset?.asset_type === 'audio/mpeg' ? (
                    <div className='rounded-xl h-[200px] w-full object-cover bg-primary-900/[0.05] relative'>
                      <Image
                        src={audioWeb}
                        className='w-full absolute  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'
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
                <div className='mt-3 ml-1'>
                  <Link
                    className='hover:text-txtblack text-txtblack !no-underline font-black flex flex-wrap items-center justify-between'
                    href={`/nft/${nft?.nft_type}/${nft.id}`}
                  >
                    <p className='text-[18px]'>
                      {nft?.name?.length > 25
                        ? nft?.name?.substring(0, 24) + '..'
                        : nft?.name}
                    </p>
                    <div>
                      <span className='text-[14px] font-bold'>
                        {nft?.more_info?.price}
                      </span>
                      <span className='uppercase text-[14px] ml-1'>
                        {nft?.more_info?.currency}
                      </span>
                      {nft?.more_info?.currency ? (
                        <Image
                          className='inline-flex ml-2'
                          src={currency[nft?.more_info?.currency]}
                          alt='currency'
                          width={24}
                          height={24}
                        />
                      ) : null}
                    </div>
                  </Link>
                  <div className='flex mt-2 flex-wrap items-center justify-between'>
                    <p className='text-[14px]'>
                      Supply:{' '}
                      <span className='text-txtblack font-black'>
                        {nft?.supply}
                      </span>
                    </p>
                    {showSalesButton(nft) === 'true' ? (
                      <p className='whitespace-nowrap w-fit py-2 px-4 rounded bg-primary-900 bg-opacity-10 text-primary-900 text-[13px] font-black'>
                        Ready for sale
                      </p>
                    ) : (
                      <p className='whitespace-nowrap py-1 w-fit px-4 rounded bg-secondary-900 bg-opacity-10 text-secondary-900 text-[13px] font-black'>
                        Not ready for sale
                      </p>
                    )}
                  </div>
                  {Collection?.is_owner && (
                    <div className='mt-3 flex flex-wrap items-center justify-end gap-3'>
                      <button
                        onClick={() => redirectToEditNFTPage(nft)}
                        className={`outlined-button font-satoshi-bold text-[14px] ${
                          Collection?.type === 'product' && nft?.freeze_metadata
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        <span>Edit</span>
                      </button>
                      {showSalesButton(nft) === 'true' && (
                        <button
                          onClick={() =>
                            router?.push(`/nft/${nft?.nft_type}/${nft.id}`)
                          }
                          className='text-center h-[40px] px-4 border-2 rounded border-primary-900
                        text-primary-900 font-black text-[14px]'
                        >
                          Sale Page
                        </button>
                      )}
                      {showSalesSettingButton(nft) === 'true' && (
                        <button
                          onClick={(e) => showSalesModal(e, nft)}
                          className='h-[40px] text-center px-4 border-2 rounded border-secondary-900 text-secondary-900 font-black text-[14px]'
                        >
                          Sale Setting
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
