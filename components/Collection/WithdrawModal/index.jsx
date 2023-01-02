import Modal from 'components/Commons/Modal';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
import { NETWORKS } from 'config/networks';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getExchangeRate,
  setWithdrawalDetails,
} from 'services/collection/collectionService';
import { createMintInstance } from 'config/ABI/mint-nft';
import { createMembsrshipMintInstance } from 'config/ABI/mint-membershipNFT';
import { createProvider } from 'util/smartcontract/provider';
import { withdrawFund } from './publishWithdraw';
import { withdrawMembershipFund } from './publishMembershipWithdraw';
import ErrorModal from 'components/Modals/ErrorModal';
import SuccessModal from 'components/Modals/SuccessModal';
import { ethers } from 'ethers';

const WithdrawModal = ({
  handleClose,
  show,
  network,
  price,
  contractAddress,
  type,
  id,
  getCollectionNewWorth,
}) => {
  const [dollarValue, setDollarValue] = useState('');
  const [value, setValue] = useState(0);
  const { walletAddress } = useSelector((state) => state.auth);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const provider = createProvider();

  useEffect(() => {
    getExchangeRate().then((resp) => {
      if (resp.code === 0) {
        let rate = resp?.exchange_rate?.find(
          (item) => item.coin_name === NETWORKS?.[Number(network)]?.value
        );
        if (price) {
          let usd = rate?.rate * price;
          setDollarValue(Number(usd));
        }
      }
    });
    setValue(price);
  }, [price]);

  const handleWithDraw = async () => {
    try {
      setIsLoading(true);
      const withdrawContract = createMintInstance(contractAddress, provider);
      const membershipwithdrawContract = createMembsrshipMintInstance(
        contractAddress,
        provider
      );
      const response =
        type === 'membership'
          ? await withdrawMembershipFund(membershipwithdrawContract, provider)
          : await withdrawFund(withdrawContract, provider);
      if (response?.status === 1) {
        postWithdrawDetails(response?.transactionHash, response?.gasUsed);
      } else {
        setIsLoading(false);
        setError(response);
      }
    } catch (err) {
      setIsLoading(false);
      setError('Please try again later!');
    }
  };

  const postWithdrawDetails = (hash, gas) => {
    let formData = new FormData();
    let gasValue = ethers.utils.formatEther(gas);
    formData.append('amount', price);
    formData.append('gas', gasValue);
    formData.append('txnHash', hash);
    setWithdrawalDetails(id, formData)
      .then((resp) => {
        if (resp.code === 0) {
          setIsLoading(false);
          setSuccess(true);
          getCollectionNewWorth();
        } else {
          setError('Please try again later!');
          setIsLoading(false);
          setSuccess(false);
        }
      })
      .catch((err) => {
        setError('Please try again later!');
        setIsLoading(false);
        setSuccess(false);
      });
  };

  if (error) {
    return (
      <ErrorModal
        handleClose={() => {
          setError('');
        }}
        show={error}
        title={'Funds withdrawn failed'}
        message={error}
      />
    );
  }

  if (success) {
    return (
      <SuccessModal
        handleClose={() => {
          handleClose();
          setSuccess(false);
        }}
        show={success}
        redirection={''}
        message={`Funds withdrawn successfully`}
        buttonText={'Close'}
      />
    );
  }

  return (
    <>
      {isLoading ? (
        <Modal
          width={500}
          show={isLoading}
          showCloseIcon={false}
          handleClose={() => isLoading(false)}
        >
          <div className='text-center md:my-6 md:mx-16'>
            <h5>Withdrawing Funds</h5>
            <div className='overflow-hidden rounded-full h-4 w-full mt-4 md:mt-6 mb-8 relative animated fadeIn'>
              <div className='animated-process-bar'></div>
            </div>
          </div>
        </Modal>
      ) : (
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
                  value={value}
                  step='0.000000001'
                  className='rounded-[3px]'
                  onChange={(e) => setValue(e.target.value)}
                  style={{ height: 42 }}
                  type='number'
                  readOnly
                  placeholder='0'
                />
              </div>
              <div className='w-[18%] border-[1px] border-[#C7CEE6] min-h-[42px] rounded-[6px] flex items-center'>
                <p className='text-[14px] ml-1 overflow-x-auto'>
                  $ {dollarValue}
                </p>
              </div>
            </div>
            {/* <div className='mt-4'>
          <p className='text-primary-900 text-[14px] text-bold'>
            Max Amount: {price} {NETWORKS[network]?.label}
          </p>
        </div> */}
            <div className='mt-4'>
              {' '}
              <label className='text-[14px]'>Address</label>
              <input
                name='address'
                value={walletAddress ? walletAddress : ''}
                className='rounded-[3px] pl-2 mt-1 border-[1px] border-[#C7CEE6] rounded-[6px] block w-full'
                style={{ height: 42 }}
                disabled
              />
            </div>

            <button
              onClick={handleWithDraw}
              className='contained-button font-satoshi-bold mt-8 w-full'
            >
              Wthdraw Funds
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default WithdrawModal;
