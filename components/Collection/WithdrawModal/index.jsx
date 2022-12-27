import Modal from 'components/Commons/Modal';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
import { NETWORKS } from 'config/networks';
import Image from 'next/image';
import { useState } from 'react';

const WithdrawModal = ({ handleClose, show, network, price }) => {
  const [address, setAddress] = useState('');
  return (
    <Modal show={show} handleClose={handleClose} width={537}>
      <div className='m-[26px]'>
        <h3 className='!text-[28px] text-black mb-2'>Withdraw the fund</h3>
        <p className='text-[14px] text-textSubtle'>
          Please make sure you taking the right amount.
        </p>
        <div className='flex items-center justify-between mt-8'>
          <div className='txtblack text-[14px]'>Amount</div>

          <div className='text-[12px] text-textSubtle'>
            Powered by{' '}
            <a
              href='https://www.coingecko.com/'
              target='_blank'
              rel='noreferrer'
              className='text-primary-900'
            >
              CoinGecko
            </a>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='w-[18%] border-[1px] border-[#C7CEE6] min-h-[42px] rounded-[6px] mr-1 flex items-center justify-center'>
            {network === '5' ? (
              <Image
                src={Eth}
                alt={'Eth'}
                className='w-[18px] h-[18px]'
                height={18}
                width={18}
              />
            ) : (
              <Image
                src={Polygon}
                alt={'Polygon'}
                className='w-[18px] h-[18px]'
                height={18}
                width={18}
              />
            )}

            <span className='text-[14px] text-uppercase'>
              {NETWORKS[network]?.label}
            </span>
          </div>
          <div className='w-[64%] mr-1'>
            <input
              id='price'
              name='price'
              defaultValue={''}
              step='0.000000001'
              className='rounded-[3px]'
              style={{ height: 42 }}
              type='number'
              placeholder='0'
            />
          </div>
          <div className='w-[18%] border-[1px] border-[#C7CEE6] min-h-[42px] rounded-[6px] flex items-center'>
            <p className='text-[14px] ml-1'>$ 0</p>
          </div>
        </div>
        <div className='mt-4'>
          <p className='text-primary-900 text-[14px] text-bold'>
            Max Amount: {price} {NETWORKS[network]?.label}
          </p>
        </div>
        <div className='mt-4'>
          {' '}
          <label className='text-[14px]'>Address</label>
          <input
            name='address'
            values={address}
            className='rounded-[3px] mt-1 border-[1px] border-[#C7CEE6] rounded-[6px] block w-full'
            style={{ height: 42 }}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button
          onClick={handleClose}
          className='contained-button font-satoshi-bold mt-8 w-full'
        >
          Wthdraw Funds
        </button>
      </div>
    </Modal>
  );
};

export default WithdrawModal;
