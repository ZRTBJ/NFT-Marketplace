/* eslint-disable react/no-unescaped-entities */
import manImg from 'assets/images/image-default.svg';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
import dayjs from 'dayjs';
import Image from 'next/image';
import { walletAddressTruncate } from 'util/WalletUtils';
const imageRegex = new RegExp('image');
const NFTSalesMobile = ({ items }) => {
  return (
    <>
      {items.length ? (
        <div>
          {items.map((item, index) => (
            <div
              key={index}
              className={`${
                index < items.length - 1 ? 'border-b' : ''
              } text-left text-[13px] pt-4 pb-2`}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <span className='text-[14px] text-[#303548] pb-2 block'>
                    Items
                  </span>
                  <div className='flex items-center'>
                    {imageRegex.test(item?.nft_asset_type) && (
                      <Image
                        src={
                          item?.nft_asset_path ? item.nft_asset_path : manImg
                        }
                        alt='nft'
                        className='h-[33px] w-[33px] rounded'
                        height={33}
                        width={33}
                        unoptimized
                      />
                    )}
                    {item?.nft_asset_type === 'movie' ||
                    item?.nft_asset_type === 'video/mp4' ? (
                      <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
                        <i className='fa-solid fa-circle-video gradient-text text-[20px]'></i>
                      </div>
                    ) : null}
                    {item?.nft_asset_type === 'audio' ||
                    item?.nft_asset_type === 'audio/mpeg' ? (
                      <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
                        <i className='fa-solid fa-file-audio gradient-text text-[20px]'></i>
                      </div>
                    ) : null}
                    <span className='ml-2'>{item.nft_name}</span>
                  </div>
                </div>
                <div>
                  <span className='text-[14px] text-[#303548] pb-2 block'>
                    Price
                  </span>
                  <div className='flex items-center'>
                    <span> {item.nft_price ? item.nft_price : '-'}</span>
                    <Image
                      src={item?.nft_currency === 'eth' ? Eth : Polygon}
                      alt='network'
                      width={20}
                      height={20}
                      className='ml-2'
                    />
                  </div>
                </div>
                <div>
                  <span className='text-[14px] text-[#303548] pb-2 block'>
                    Qty
                  </span>
                  <span>{item.nft_unit}</span>
                </div>
              </div>
              <div className='flex items-center mt-4'>
                <div className='flex-1'>
                  <span className='text-[14px] text-[#303548] pb-2 block'>
                    Buyer
                  </span>
                  <span>
                    {item.user_eoa ? walletAddressTruncate(item.user_eoa) : '-'}
                  </span>
                </div>
                <div className='ml-10'>
                  <span className='text-[14px] text-[#303548] pb-2 block'>
                    Date
                  </span>
                  <span>
                    {dayjs(item.purchase_time).format('DD/MM/YYYY - HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-center'>You don't have any sales to display</p>
      )}
    </>
  );
};

export default NFTSalesMobile;
