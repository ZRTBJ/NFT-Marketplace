import manImg from 'assets/images/image-default.svg';
import { useState } from 'react';
import Edit from 'assets/images/icons/edit.svg';
import { ls_GetWalletAddress } from 'util/ApplicationStorage';
import Image from 'next/image';

const Headers = ['checkbox', 'Wallet Address', 'Name', 'Percentage'];

const ContributorsList = ({
  contributors,
  handleContributorSelect,
  selectAll,
  handleContributorSelectAll,
  handleAddWallet,
  handleValueChange,
  showPercentError,
  isLoading,
}) => {
  const [isEdit, setIsEdit] = useState(null);
  const ownerWallet = ls_GetWalletAddress();

  const handleEditNull = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEdit(null);
  };

  const handelEditAddress = (e, value) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEdit(value);
  };

  return (
    <div className='overflow-x-auto relative'>
      {showPercentError ? (
        <p className='text-red-400 text-[14px] mb-3'>
          Total percent of contributors should equal to or lesser than 100%
        </p>
      ) : null}
      {contributors?.length ? (
        <table className='w-full text-left'>
          <thead>
            <tr className='text-textSubtle text-[12px] '>
              {Headers.map((item) => (
                <th
                  scope='col'
                  className={`px-5 text-[14px] text-[#303548]`}
                  key={item}
                >
                  {item !== 'checkbox' ? (
                    item
                  ) : (
                    <input
                      className='form-check-input appearance-none w-[18px] h-[18px] rounded-[4px] h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
                      type='checkbox'
                      checked={selectAll}
                      onChange={handleContributorSelectAll}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contributors.map((r, index) => (
              <tr
                key={r.id}
                className={`${
                  index < contributors.length - 1 ? 'border-b' : ''
                } text-left text-[13px]`}
              >
                <td className='py-4 px-5'>
                  {ownerWallet !== r.wallet_address ? (
                    <input
                      className='form-check-input appearance-none w-[18px] h-[18px] rounded-[4px] h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
                      type='checkbox'
                      checked={r.selected}
                      onChange={(e) =>
                        handleContributorSelect(e, r.wallet_address)
                      }
                    />
                  ) : (
                    <input
                      className='form-check-input appearance-none w-[18px] h-[18px] rounded-[4px] h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
                      type='checkbox'
                      checked={true}
                      readOnly
                      disabled
                    />
                  )}
                </td>
                <td className='py-4 px-5'>
                  <div className='flex items-center'>
                    <Image
                      src={manImg}
                      alt='contributor'
                      className='h-[32px] w-[32px] rounded-[50%]'
                      height={32}
                      weight={32}
                    />
                    <p className='ml-3 truncate w-[170px] text-[12px]'>
                      {r.wallet_address}
                    </p>
                  </div>
                </td>
                <td className='py-4 px-5 text-[12px]'>
                  {r?.name ? r.name : '-'}
                </td>
                <td className={`py-4 px-5 text-[12px] flex items-center`}>
                  {isEdit === r.wallet_address ? (
                    <div className='w-[75px] mr-2'>
                      <input
                        type='number'
                        value={r.royalty}
                        style={{ padding: '5px 10px' }}
                        onChange={(e) => handleValueChange(e, r.wallet_address)}
                      />
                    </div>
                  ) : (
                    <span className='w-[40px]'>
                      {r.royalty ? r.royalty : 0} %
                    </span>
                  )}
                  {ownerWallet === r.wallet_address || r.selected ? (
                    <>
                      {isEdit === r.wallet_address ? (
                        <div>
                          <i
                            className='fa-solid fa-check bg-green-400 rounded-[4px] text-white flex items-center justify-center h-[24px] w-[24px] text-[20px] cursor-pointer'
                            onClick={handleEditNull}
                          ></i>
                        </div>
                      ) : (
                        <Image
                          src={Edit}
                          alt='edit'
                          className='cursor-pointer'
                          onClick={(e) =>
                            handelEditAddress(e, r.wallet_address)
                          }
                        />
                      )}
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}{' '}
      <button
        className={`contained-button font-satoshi-bold w-full mt-4 text-[14px] font-bold ${
          showPercentError ? 'opacity-[0.5]' : ''
        }`}
        onClick={handleAddWallet}
        disabled={showPercentError}
      >
        {isLoading ? 'Loading...' : 'Add Wallet'}
      </button>
    </div>
  );
};

export default ContributorsList;
