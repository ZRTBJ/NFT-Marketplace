import React, { useState, useEffect } from 'react';
import { walletAddressTruncate } from 'util/WalletUtils';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { getAccountBalance } from 'util/MetaMask';
import { NETWORKS } from 'config/networks';
import { cryptoConvert } from 'services/chainlinkService';
import { ls_GetChainID } from 'util/ApplicationStorage';
export default function BalanceInfo({ balanceInfo, userInfo }) {
  const [open, setOPen] = useState(true);
  const [walletValue, setWalletValue] = useState(0);

  const copyToClipboard = (text) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      toast.success(`Link successfully copied`);
    }
  };

  const onGetAccountBalance = async () => {
    try {
      const balance = await getAccountBalance();
      const crypto = NETWORKS[ls_GetChainID()]?.cryto;
      await cryptoConvert(crypto).then((res) => {
        if (res) {
          const usdValue = res.USD * balance;
          setWalletValue(usdValue);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userInfo?.id) {
      onGetAccountBalance();
    }
  }, [userInfo]);

  return (
    <div className='bg-color-gray-dark rounded-bl-2xl rounded-br-2xl  px-4 md:px-10 py-5 shadow'>
      <p className='text-textsubtle-100 font-bold text-[18px]'>
        Estimated Balance
      </p>
      <div className='flex flex-col md:flex-row gap-6 flex-wrap  justify-between mt-4'>
        <div>
          <p className='text-textsubtle-100 font-bold '>
            DAO, NFT, Splitter amount
          </p>
          <p className='text-black font-black text-[24px]'>
            $
            {balanceInfo?.dao_nft_splitter_amount &&
              balanceInfo?.dao_nft_splitter_amount?.toFixed(2)}{' '}
            USD
          </p>
        </div>
        <div>
          <p className='text-textsubtle-100 font-bold '>Wallet value</p>
          <p className='text-black font-black mt-0'>
            ${walletValue.toFixed(2)} USD
          </p>
          <div className='mt-2 flex items-center'>
            <p className='text-textSubtle'>
              {userInfo && walletAddressTruncate(userInfo?.eoa)}
            </p>
            <i
              onClick={() => {
                copyToClipboard(balanceInfo?.eoa);
              }}
              className='fa-solid  fa-copy cursor-pointer pl-[6px]'
            ></i>
          </div>
        </div>
      </div>
      <div className='mt-5 pb-3'>
        <button
          onClick={() => setOPen((pre) => !pre)}
          className='unset-all bg-transparent font-black mb-4'
        >
          {open ? 'Hide Details' : 'Expand Details'}{' '}
          <span>
            {open ? (
              <i className='fa-solid fa-chevrons-up'></i>
            ) : (
              <i className='fa-solid fa-chevrons-down'></i>
            )}
          </span>
        </button>
        {open && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-white p-4 rounded-2xl flex flex-wrap items-center justify-between'>
              <p>DAO Treasury</p>
              <p className='text-black font-black text-[24px] flex items-start'>
                $
                {balanceInfo?.dao_treasury &&
                  balanceInfo?.dao_treasury.toFixed(2)}{' '}
                USD
                <Link
                  className='ml-2 !no-underline text-textSubtle text-[16px]'
                  href='/transaction-details/?tab=dao'
                >
                  <i className='fa-solid fa-chevron-right'></i>
                </Link>
              </p>
            </div>

            <div className='bg-white p-4 rounded-2xl flex flex-wrap items-center justify-between'>
              <p>NFT Collection</p>
              <p className='text-black font-black text-[24px] flex items-start'>
                $
                {balanceInfo?.nft_collection_treasury &&
                  balanceInfo?.nft_collection_treasury.toFixed(2)}{' '}
                USD
                <Link
                  className='ml-2 !no-underline text-textSubtle text-[16px]'
                  href='/transaction-details/?tab=collection'
                >
                  <i className='fa-solid fa-chevron-right'></i>
                </Link>
              </p>
            </div>

            <div className='bg-white p-4 rounded-2xl flex flex-wrap items-center justify-between'>
              <p>Royalties</p>
              <p className='text-black font-black text-[24px] flex items-start'>
                {balanceInfo?.royalties
                  ? `${balanceInfo?.royalties.toFixed(2)} USD`
                  : 'N/A'}
                <Link
                  className='ml-2 !no-underline text-textSubtle text-[16px]'
                  href='/transaction-details/?tab=royalty'
                >
                  <i className='fa-solid fa-chevron-right'></i>
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
