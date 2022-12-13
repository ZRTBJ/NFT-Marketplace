/* eslint-disable react/no-unescaped-entities */
import styles from './style.module.css';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
import manImg from 'assets/images/image-default.svg';
import { useState } from 'react';
import NFTSalesMobile from './NFTSalesMobile';
import dayjs from 'dayjs';
import Image from 'next/image';

const headers = [
  {
    id: 0,
    label: 'Items',
  },
  {
    id: 1,
    label: 'Price',
  },
  {
    id: 2,
    label: 'Qty',
  },
  {
    id: 3,
    label: 'Buyer',
  },
  {
    id: 4,
    label: 'Date',
  },
];

const time = ['Day', 'Week', 'Month'];

const NFTSales = ({ items }) => {
  const [selectedTime, setSelectedTime] = useState('Day');

  return (
    <div>
      <div className='flex items-start md:items-center pb-7 border-b-[1px] mb-6 border-[#E3DEEA]'>
        <h3 className='text-[18px] font-black mr-10'>NFT Sale's</h3>
        {/* <div className="bg-primary-100 rounded-[6px] p-2 ">
          {time.map((item, index) => (
            <button
              key={index}
              className={`text-[12px] text-textSubtle rounded-[6px] px-4 py-2 transition duration-150 ease-linear ${
                selectedTime === item ? "bg-primary-900 text-white" : ""
              }`}
              onClick={() => setSelectedTime(item)}
            >
              {item}
            </button>
          ))}
        </div> */}
      </div>
      <div className='relative hidden md:block'>
        {items.length ? (
          <table className='w-full text-left'>
            <thead>
              <tr className='text-textSubtle text-[12px] '>
                {headers.map((item, index) => (
                  <th
                    scope='col'
                    className={`px-5 text-[14px] text-[#303548] ${styles.tableHeader}`}
                    key={index}
                  >
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((r, index) => (
                <tr
                  key={index}
                  className={`${
                    index < items.length - 1 ? 'border-b' : ''
                  } text-left text-[13px]`}
                >
                  <td className='py-4 px-5'>
                    <div className='flex items-center'>
                      <Image
                        src={r?.nft_asset_path ? r.nft_asset_path : manImg}
                        alt='nft'
                        className='h-[33px] w-[33px] rounded'
                        height={33}
                        width={33}
                        unoptimized
                      />{' '}
                      <span className='ml-2'>{r.nft_name}</span>
                    </div>
                  </td>
                  <td className='py-4 px-5'>
                    <div className='flex items-center'>
                      <span> {r.nft_price ? r.nft_price : '-'}</span>
                      {r?.nft_currency && (
                        <Image
                          src={r?.nft_currency === 'eth' ? Eth : Polygon}
                          alt='network'
                          width={20}
                          height={20}
                          className='ml-2'
                        />
                      )}
                    </div>
                  </td>
                  <td className='py-4 px-5'>1</td>
                  <td className={`py-4 px-5`}>
                    {r.user_eoa ? r.user_eoa : '-'}
                  </td>
                  <td className='py-4 px-5'>
                    <span>
                      {dayjs(r.purchase_time * 1000).format(
                        'DD/MM/YYYY - HH:mm'
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='text-center'>You don't have any sales to display</p>
        )}
      </div>
      <div className='block md:hidden'>
        <NFTSalesMobile items={items} />
      </div>
    </div>
  );
};

export default NFTSales;
