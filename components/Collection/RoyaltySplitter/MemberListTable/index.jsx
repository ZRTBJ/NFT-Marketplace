import { ethers } from 'ethers';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.css';
import Edit from 'assets/images/icons/edit.svg';
import Trash from 'assets/images/icons/trash.svg';
import { useMemo, useState, useEffect } from 'react';
import MemeberListMobile from '../MemberListMobile/MemberListMobile';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import { walletAddressTruncate } from 'util/WalletUtils';
import Image from 'next/image';

const MemberListTable = ({
  collection,
  headers,
  list,
  isEdit,
  setIsEdit,
  handleValueChange,
  handleAutoFill,
  isOwner,
  setRoyalityMembers,
  showRoyalityErrorModal,
  onShowError = () => {},
}) => {
  const [newItems, setNewItems] = useState(null);
  const [address, setAddress] = useState('');
  const [percentage, setPercentage] = useState();
  const [toDelete, setToDelete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [addError, setAddError] = useState('');

  const hasPublishedRoyaltySplitter = useMemo(
    () => collection?.royalty_splitter?.status === 'published',
    [collection]
  );

  useEffect(() => {
    if (newItems) {
      if (address && percentage && !isEdit) {
        // handleAutoFill();
        setNewItems([]);
        setAddress('');
        setPercentage('');
        setIsAdded(false);
      }
    }
  }, [list]);

  useEffect(() => {
    if (showRoyalityErrorModal) {
      setNewItems(null);
      let values = list.slice(0, list.length - 1);
      setRoyalityMembers(values);
      setAddress('');
      setPercentage('');
      setIsAdded(false);
    }
  }, [showRoyalityErrorModal]);

  useEffect(() => {
    let percent =
      list.length && list.reduce((acc, val) => acc + val.royalty_percent, 0);
    let total = percent + parseInt(percentage ? percentage : 0);

    if (total > 100) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [percentage]);

  const addNewContributorField = () => {
    let value = { eoa: '', royalty_percent: 0, type: 'new' };
    setNewItems(value);
  };

  const addNewContributorData = async () => {
    setIsAdded(true);
    if (address && percentage) {
      let userAddress = address;

      if (!ethers.utils.isAddress(address)) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          userAddress = await provider.resolveName(address);
        } catch (error) {
          setAddError('Invalid address or ENS');
          return;
        }
      }

      if (userAddress === null) {
        setAddError('Invalid address or ENS');
        return;
      }

      let value = {
        user_eoa: userAddress,
        royalty_percent: parseFloat(percentage),
      };
      setRoyalityMembers([...list, value]);
    }
  };

  const removeContributorField = () => {
    setNewItems(null);
    setAddress('');
    setPercentage('');
    setIsAdded(false);
  };

  const handleDeleteContributor = (id) => {
    let values = list.filter((item) => item.user_eoa !== id);
    setRoyalityMembers(values);
    setToDelete(true);
  };

  const deleteContributor = () => {
    handleAutoFill();
    setToDelete(false);
  };

  return (
    <>
      {toDelete && (
        <ConfirmationModal
          show={toDelete}
          handleClose={setToDelete}
          handleApply={deleteContributor}
          message='Are you you want to delete this contributor?'
        />
      )}
      <div className='overflow-x-auto relative hidden md:block'>
        <table className='w-full text-left'>
          <thead>
            <tr className='text-textSubtle text-[12px] '>
              {headers.map((item) => (
                <th
                  scope='col'
                  className={`px-5 text-[14px] text-[#303548] ${styles.tableHeader}`}
                  key={item.id}
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list?.length
              ? list.map((r, index) => (
                  <tr
                    key={r.user_eoa}
                    className={`${
                      index < list.length - 1 ? 'border-b' : ''
                    } text-left text-[13px]`}
                  >
                    <td className='py-4 px-5'>
                      <div className='inline-flex items-center'>
                        <span>{walletAddressTruncate(r.user_eoa)}</span>
                        <CopyToClipboard text={r.user_eoa}>
                          <button className='ml-1 w-[32px] h-[32px] rounded-[4px] flex items-center justify-center cursor-pointer text-[#A3D7EF] active:text-black'>
                            <FontAwesomeIcon className='' icon={faCopy} />
                          </button>
                        </CopyToClipboard>
                      </div>
                    </td>
                    {/* <td className="py-4 px-5">{r.email}</td> */}
                    <td className='py-4 px-5'>
                      <div className='inline-flex items-center'>
                        {isEdit === r.user_eoa && isOwner ? (
                          <div className='w-[75px] mr-2'>
                            <input
                              type='number'
                              value={r.royalty_percent}
                              style={{ padding: '5px 10px' }}
                              onChange={(e) => handleValueChange(e, r.user_eoa)}
                            />
                          </div>
                        ) : (
                          <span className='w-[60px]'>
                            {r.royalty_percent
                              ? Intl.NumberFormat('en-US', {
                                  style: 'percent',
                                  minimumFractionDigits: 3,
                                }).format(r.royalty_percent / 100)
                              : '-'}
                          </span>
                        )}
                        {isOwner && (
                          <>
                            {isEdit === r.user_eoa ? (
                              <div className='flex flex-col'>
                                <i
                                  className='fa-solid fa-check bg-green-400 rounded-[4px] text-white p-[2px] text-[18px] cursor-pointer'
                                  onClick={() => setIsEdit(null)}
                                ></i>
                                <i
                                  className='fa-solid fa-xmark bg-red-400 rounded-[4px] text-white p-[2px] pl-[4px] text-[20px] cursor-pointer'
                                  onClick={() => setIsEdit(null)}
                                ></i>
                              </div>
                            ) : !hasPublishedRoyaltySplitter ? (
                              <Image
                                src={Edit}
                                alt='edit'
                                className='cursor-pointer'
                                onClick={() => setIsEdit(r.user_eoa)}
                              />
                            ) : null}
                          </>
                        )}
                      </div>
                    </td>
                    <td className='py-4 px-5'>
                      {r.user_name ? r.user_name : '-'}
                    </td>
                    <td className={`py-4 px-5`}>
                      <p
                        className={`text-[13px] bg-opacity-[0.2] py-1 px-2 w-fit rounded-[4px] font-bold ${
                          r.is_owner
                            ? 'text-info-1 bg-[#46A6FF]'
                            : ' text-success-1 bg-[#32E865]'
                        }`}
                      >
                        {r.is_owner ? 'Owner' : 'Contributor'}
                      </p>
                    </td>
                    <td className='py-4 px-5'>
                      {r.is_owner || hasPublishedRoyaltySplitter ? null : (
                        <div
                          className='w-[32px] h-[32px] bg-[#FF3C3C] rounded-[4px] flex items-center justify-center cursor-pointer'
                          onClick={() => handleDeleteContributor(r.user_eoa)}
                        >
                          <Image
                            src={Trash}
                            alt='delete'
                            width={14}
                            height={14}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      <div className='block md:hidden'>
        <MemeberListMobile
          list={list}
          // handlePublish={setShowPublish}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
          handleValueChange={handleValueChange}
          handleAutoFill={handleAutoFill}
          isOwner={isOwner}
        />
      </div>
      <div className='mb-4'>
        {newItems ? (
          <div className='flex items-center ml-0 md:ml-4'>
            <div className='w-[250px] mr-4 md:mr-8'>
              <input
                id={'address'}
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='Add Wallet Address or ENS'
                className='w-full bg-secondary rounded-[6px] text-[12px] px-[10px] py-[14px] text-text-base'
              />
            </div>
            <div className='w-[150px] mr-4 md:mr-8 relative'>
              <input
                id={'percentage'}
                type='number'
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder='-'
                className='w-full bg-secondary rounded-[6px] text-[12px] pl-[10px] !pr-[30px] py-[14px] text-text-base'
              />
              <p className='absolute top-3 right-4'>%</p>
            </div>
            <button
              className='outlined-button font-satoshi-bold'
              onClick={addNewContributorData}
              disabled={showError}
            >
              <span>Add</span>
            </button>
            <i
              className='fa-regular fa-xmark-large ml-5 cursor-pointer'
              onClick={removeContributorField}
            ></i>
          </div>
        ) : null}
        {(isAdded && !percentage) || (isAdded && !address) ? (
          <p className='text-red-400 text-[14px] mt-1 ml-4'>
            Wallet Address or ENS and Percentage are required
          </p>
        ) : null}
        {showError ? (
          <p className='text-red-400 text-[14px] mt-1 ml-4'>
            {' '}
            Total percent of contributors should equal to or lesser than 100%.
          </p>
        ) : null}
        {addError && (
          <p className='text-red-400 text-[14px] mt-1 ml-4'>{addError}</p>
        )}
      </div>
      {!newItems && !hasPublishedRoyaltySplitter ? (
        <button
          className='outlined-button font-satoshi-bold ml-0 md:ml-4'
          onClick={addNewContributorField}
        >
          <span>Add More</span>
        </button>
      ) : null}
    </>
  );
};

export default MemberListTable;
