import Modal from 'components/Commons/Modal';

const WithdrawModal = ({ handleClose, show }) => {
  return (
    <Modal show={show} handleClose={handleClose} width={537}>
      <h3 className='text-[28px] text-black mb-1'>Withdraw the fund</h3>
      <p className='font-[14px] text-[#5F6479]'>
        Please make sure you taking the right amount.
      </p>
      <div className='flex items-center justify-between mt-8'>
        <div className='txtblack text-[14px]'>Amount</div>

        <div className='text-[12px]'>
          Powered by{' '}
          <a href='https://www.coingecko.com/' target='_blank' rel='noreferrer'>
            CoinGecko
          </a>
        </div>
      </div>
      <div className='flex items-center justify-between mx-1 w-[85%]'>
        <input
          id='price'
          name='price'
          defaultValue={''}
          step='0.000000001'
          className='mt-1 rounded-[3px]'
          style={{ height: 42 }}
          type='number'
          placeholder='0'
        />
        <div className='ml-1 w-[15%]'>
          <p className='text-[14px]'>$ 0.0003</p>
        </div>
      </div>

      <button
        onClick={handleClose}
        className='contained-button font-satoshi-bold mt-8 w-full'
      >
        Wthdraw Funds
      </button>
    </Modal>
  );
};

export default WithdrawModal;
