import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import Trash from 'assets/images/icons/trash.svg';
import Edit from 'assets/images/icons/edit.svg';
import { walletAddressTruncate } from 'util/WalletUtils';
import Image from 'next/image';

const MemberRowMobile = (props) => {
  const { item, isLastItem, handleValueChange, handleAutoFill } = props;
  const [isEdit, setIsEdit] = useState(false);

  const handleUpdatePercent = async (e) => {
    await handleAutoFill(e);
    setIsEdit(false);
  };

  return (
    <div className={`${isLastItem ? 'border-b' : ''} pb-4 mb-4`}>
      <div className='flex items-center justify-between'>
        <div className='mb-3'>
          <p className='text-[14px] font-bold'>Wallet Address</p>
          <div className='flex items-center'>
            <p className='text-[13px] mt-0'>
              {walletAddressTruncate(item.user_eoa)}
            </p>
            <CopyToClipboard text={item.user_eoa}>
              <button className='ml-1 w-[32px] h-[32px] rounded-[4px] flex items-center justify-center cursor-pointer text-[#A3D7EF] active:text-black'>
                <FontAwesomeIcon className='' icon={faCopy} />
              </button>
            </CopyToClipboard>
          </div>
        </div>
        {item.is_owner ? null : (
          <div className='w-[32px] h-[32px] bg-[#FF3C3C] rounded-[4px] flex items-center justify-center cursor-pointer'>
            <Image src={Trash} alt='delete' />
          </div>
        )}
      </div>
      <div className='flex items-center justify-between'>
        <div className=''>
          <p className='text-[14px] font-bold'>Name</p>
          <p className='text-[13px] mt-0'>
            {item.user_name ? item.user_name : '-'}
          </p>
        </div>
        <div className=''>
          <p className='text-[14px] font-bold'>Percentage</p>
          <div className='flex'>
            {!isEdit && (
              <>
                <span className='text-[13px] mt-0'>
                  {item.royalty_percent ? `${item.royalty_percent}%` : '-'}
                </span>
                <Image
                  className='ml-2 cursor-pointer'
                  src={Edit}
                  alt='edit'
                  onClick={() => setIsEdit(true)}
                />
              </>
            )}
            {isEdit && (
              <div className='flex'>
                <div className='w-[60px]'>
                  <input
                    type='number'
                    value={item.royalty_percent}
                    style={{ padding: '5px 10px' }}
                    onChange={(e) => handleValueChange(e, item.user_eoa)}
                  />
                </div>
                <div className='ml-1'>
                  <i
                    className='fa-solid fa-check bg-green-400 rounded-[4px] text-white flex items-center justify-center h-[24px] w-[24px] text-[20px] cursor-pointer'
                    onClick={handleUpdatePercent}
                  ></i>
                  <i
                    className='fa-solid fa-xmark bg-red-400 rounded-[4px] text-white flex items-center justify-center h-[24px] w-[24px] text-[20px] cursor-pointer'
                    onClick={() => setIsEdit(false)}
                  ></i>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=''>
          <p className='text-[14px] font-bold'>Roles</p>
          <p
            className={`text-[13px] mt-0 bg-opacity-[0.2] py-1 px-2 w-fit rounded-[4px] font-bold ${
              item.is_owner
                ? 'text-info-1 bg-[#46A6FF]'
                : ' text-success-1 bg-[#32E865]'
            }`}
          >
            {item.is_owner ? 'Owner' : 'Contributor'}
          </p>
        </div>
      </div>
    </div>
  );
};

const MemeberListMobile = (props) => {
  const { list, handleAutoFill, handleValueChange } = props;

  return (
    <div>
      {list?.length &&
        list.map((item, index) => (
          <MemberRowMobile
            key={index}
            item={item}
            isLastItem={index === list.length - 1}
            handleAutoFill={handleAutoFill}
            handleValueChange={handleValueChange}
          />
        ))}
    </div>
  );
};

export default MemeberListMobile;
