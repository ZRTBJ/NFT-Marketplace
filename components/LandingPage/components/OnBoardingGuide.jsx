import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Gas from 'assets/images/header/gas.svg';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import CreateNFTModal from 'components/Project/CreateDAOandNFT/components/CreateNFTModal.jsx';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { NETWORKS } from 'config/networks';
import { getCurrentNetworkId } from 'util/MetaMask';
import FloatingContactForm from 'components/Commons/FloatingContactForm';
import {
  ls_SetLatestGasPrice,
  ls_GetLatestGasPrice,
} from 'util/ApplicationStorage';

export default function OnBoardingGuide({ setSwitchNetwork }) {
  const userinfo = useSelector((state) => state.user.userinfo);
  const [open, setOPen] = useState(true);
  const [showWalletConnectModal, setShowWalletConnectModal] = useState(false);
  const [showCreateNFTModal, setShowCreateNFTModal] = useState(false);
  const [gasPrice, setGasPrice] = useState({
    standard: 0,
    slow: 0,
    fast: 0,
    rapid: 0,
    usd: 0,
  });

  let priceDetails = ls_GetLatestGasPrice();

  useEffect(() => {
    if (priceDetails) {
      setGasPrice(JSON.parse(priceDetails));
    } else {
      getGasPrice();
    }
  }, [priceDetails]);

  const openFeedbackModal = () => {
    const button = document.getElementById('fetureRequestButton');
    button.click();
  };

  const redirectToNftCreatePage = async () => {
    // let currentNetwork = await getCurrentNetworkId();
    // if (NETWORKS?.[currentNetwork]) {
    setShowCreateNFTModal(true);
    // } else {
    //   setSwitchNetwork(true);
    // }
  };

  const getGasPrice = async () => {
    let networkId = await getCurrentNetworkId();
    let link = NETWORKS[networkId];
    let data = await fetch(link?.scanApi);
    let response = await data.json();
    let priceData = await fetch(link?.priceApi);
    let priceResponse = await priceData.json();
    if (response?.message === 'OK') {
      let priceDetails = {
        standard:
          response?.result?.suggestBaseFee || response?.result?.SafeGasPrice,
        slow: response?.result?.SafeGasPrice,
        fast: response?.result?.FastGasPrice,
        rapid: response?.result?.ProposeGasPrice
          ? response.result.ProposeGasPrice
          : '-',
        usd: priceResponse?.result?.ethusd
          ? ((Number(priceResponse?.result?.ethusd) * 21) / 1000000).toFixed(2)
          : '-',
      };
      setGasPrice(priceDetails);
      ls_SetLatestGasPrice(JSON.stringify(priceDetails));
    }
  };

  return (
    <>
      <div className='bg-gradient-to-b from-color-gray-dark to-color-gray-light rounded-b-2xl z-10 relative'>
        <div className='overflow-x-auto md:max-w-[1291px] mx-auto px-6 custom-scrollbar'>
          <div className='flex flex-wrap items-center justify-center gap-4 text-black my-4'>
            <p className='break-normal  text-center text-[14px] '>
              👋🏻 <span className='font-black'>Welcome to DeCir</span>, Here are
              some guides for you to get started
            </p>
            <button
              onClick={() => setOPen((pre) => !pre)}
              className='unset-all bg-transparent font-black'
            >
              {open ? 'Hide' : 'Expand'}{' '}
              <span>
                {open ? (
                  <i className='fa-solid fa-chevrons-up'></i>
                ) : (
                  <i className='fa-solid fa-chevrons-down'></i>
                )}
              </span>
            </button>
          </div>
          {open && (
            <div className='flex my-5 pb-3 gap-x-4 overflow-x-auto whitespace-nowrap custom-scrollbar'>
              <div
                onClick={() => redirectToNftCreatePage()}
                className='cursor-pointer min-w-[86vw]  md:min-w-[434px]  rounded-[8px] bg-gradient-to-r from-white to-secondary-200/[0.8]'
              >
                <div className='triangle'></div>
                <div className='flex items-center px-6 pb-3 -mt-4 gap-4 '>
                  <div>
                    <div className='gradient-text-deep-pueple font-black text-[18px]'>
                      Create NFT
                    </div>
                    <p className='text-textSubtle-100 text-[14px] break-word '>
                      Find out how to create NFTs on DeCir
                    </p>
                  </div>
                  <div className='ml-auto text-black font-black text-[14px] '>
                    Learn more{' '}
                    <i className=' ml-2 fa-sharp fa-solid fa-arrow-right'></i>
                  </div>
                </div>
              </div>
              <Link
                href='https://decir.gitbook.io/decir/'
                passHref
                target='_blank'
                className=' !no-underline min-w-[86vw] md:min-w-[407px]  rounded-[8px] bg-gradient-to-r from-white to-secondary-200/[0.8]'
              >
                <div className='triangle'></div>
                <div className='flex items-center px-6 pb-3 -mt-4 gap-4'>
                  <div>
                    <div className='gradient-text-deep-pueple font-black text-[18px]'>
                      Documentation
                    </div>
                    <p className='text-textSubtle-100 text-[14px]  break-word'>
                      Explore our ecosystem’s core functionalities
                    </p>
                  </div>
                  <div
                    className='ml-auto text-black font-black text-[14px] cursor-pointer'
                    href='https://decir.gitbook.io/decir/'
                    passHref
                    target='_blank'
                  >
                    Learn more{' '}
                    <i className=' ml-2 fa-sharp fa-solid fa-arrow-right'></i>
                  </div>
                </div>
              </Link>
              <div
                onClick={() => openFeedbackModal()}
                className='cursor-pointer  min-w-[86vw] md:min-w-[302px] rounded-[8px] bg-gradient-to-r from-white to-secondary-200/[0.8]'
              >
                <div className='triangle'></div>
                <div className='flex items-center px-6 pb-3 -mt-4 gap-4'>
                  <div className='cursor-pointer'>
                    <div className='gradient-text-deep-pueple font-black text-[18px]'>
                      Feedback
                    </div>
                    <p className='text-textSubtle-100 text-[14px]  break-word'>
                      Help improve our services with your feedback
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='content-valuation flex items-center justify-center pt-6 pb-2 -mt-4 flex-wrap'>
        <div className='flex items-center'>
          <Image src={Gas} alt='Gas' />
          <p className='font-black text-[12px] ml-1'>GAS</p>
        </div>
        <div className='mx-6'>
          <p className=' text-[12px]'>
            <span className='font-black'>Standard</span>{' '}
            {Number(gasPrice?.standard).toFixed(2)} GWei - $
            {(Number(gasPrice?.usd) * Number(gasPrice?.standard)).toFixed(2)} |
            ~5 Mins
          </p>
        </div>
        <div className='mx-6'>
          <p className=' text-[12px]'>
            <span className='font-black'>Slow</span>{' '}
            {Number(gasPrice?.slow).toFixed(2)} GWei - $
            {(Number(gasPrice?.usd) * Number(gasPrice?.slow)).toFixed(2)} | ~5
            Mins
          </p>
        </div>
        <div className='mx-6'>
          <p className=' text-[12px]'>
            <span className='font-black'>Fast</span>{' '}
            {Number(gasPrice?.fast).toFixed(2)} GWei - $
            {(Number(gasPrice?.usd) * Number(gasPrice?.fast)).toFixed(2)} | ~5
            Mins
          </p>
        </div>
        <div>
          <p className=' text-[12px]'>
            <span className='font-black'>Rapid</span>{' '}
            {Number(gasPrice?.rapid).toFixed(2)} GWei - $
            {(Number(gasPrice?.usd) * Number(gasPrice?.rapid)).toFixed(2)} | ~5
            Mins
          </p>
        </div>
      </div>
      <WalletConnectModal
        showModal={showWalletConnectModal}
        closeModal={() => setShowWalletConnectModal(false)}
        noRedirection={false}
        navigateToPage={'dashboard?createNFT=true'}
      />

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
