/* eslint-disable react-hooks/exhaustive-deps */
import style from './formUtility.module.css';

import FileDragAndDrop from 'components/FormUtility/FileDragAndDrop';
import { useState, useEffect } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { getProjectCategory } from 'services/project/projectService';
import Tooltip from 'components/Commons/Tooltip';
import { NETWORKS } from 'config/networks';
import Safe from 'assets/images/safe.svg';
import Image from 'next/image';
import Select, { components } from 'react-select';
import Matic from 'assets/images/polygon.svg';
import Eth from 'assets/images/eth.svg';
import Bnb from 'assets/images/bnb.svg';
import CreateSplitter from 'components/Profile/components/CreateSplitter';
const CURRENCY = [
  { id: 5, value: 'eth', label: 'ETH', icon: Eth },
  { id: 97, value: 'bnb', label: 'BNB', icon: Bnb },
  { id: 80001, value: 'matic', label: 'MATIC', icon: Matic },
  { id: 1, value: 'eth', label: 'ETH', icon: Eth },
  { id: 137, value: 'matic', label: 'MATIC', icon: Matic },
  { id: 56, value: 'bnb', label: 'BNB', icon: Bnb },
];
const Control = ({ children, ...props }) => {
  const { value } = props.selectProps;
  let selectedValue = CURRENCY.find((item) => value?.value === item?.value);
  return (
    <components.Control {...props}>
      <div className='flex items-center w-full h-[42px] rounded pl-2'>
        <div className='user-menu-dropdown'>
          <Image
            src={selectedValue?.icon}
            alt={selectedValue?.label}
            className='w-[18px] h-[18px]'
            height={18}
            width={18}
          />
        </div>
        {children}
      </div>
    </components.Control>
  );
};
export default function Outline({
  isPublished,
  // logo
  logoLabel,
  logoPhotoUrl,
  onLogoPhotoSelect,
  onLogoPhotoRemove,

  // name
  nameLabel,
  projectName,
  emptyProjectName,
  alreadyTakenProjectName,
  onProjectNameChange,
  projectNameDisabled,

  // Dao symbol
  symbolTitle,
  showDaoSymbol,
  daoSymbol,
  emptyDaoSymbol,
  daoSymbolDisable,
  onDaoSymbolChange,
  alreadyTakenDaoSymbol,

  // Dao wallet
  showDaoWallet,
  daoWallet,
  emptyDaoWallet,
  daoWalletDisable,
  onDaoWalletChange,

  // options
  showOptions,

  // Token Transferable
  showTokenTransferable,
  isTokenTransferable,
  onTokenTransferableChange,

  // Timebound token
  showTimeBoundToken,
  isTokenTimebound,
  onTokenTimeboundChange,
  timeboundDuration,
  onTimeboundDurationChange,
  isTimeboundDurationValid,

  // price and royalty settings
  showPriceAndRoyaltySettings,
  basePrice,
  handleBasePriceValue,
  isBasePriceValid,

  // overview
  overview,
  onOverviewChange,

  // photo
  showPhotos,
  photosUrl,
  onPhotosSelect,
  onPhotosRemove,

  // Cover
  showCover,
  coverPhotoUrl,
  onCoverPhotoSelect,
  onCoverPhotoRemove,

  // Royalties
  showRoyalties,
  royaltiesDisable,
  primaryRoyalties,
  secondaryRoyalties,
  onPrimaryRoyaltiesChange,
  onSecondaryRoyaltiesChange,

  // webLinks
  webLinks,
  onSocialLinkChange,
  showWebLinks,
  addMoreSocialLink,
  deleteSocialLinks,

  // category
  showProjectCategory,
  projectCategory,
  emptyProjeCtCategory,
  onProjectCategoryChange,
  emptyBlockchainCategory,

  // Blockchain
  blockchainCategory,
  onBlockchainCategoryChange,
  blockchainCategoryList,
  setEmptyBlockchainCategory,

  // Freeze MetaData
  showFreezeMetadata,
  isMetadataFreezed,
  onMetadataFreezeChange,
  freezeMetadataDisabled,

  // Royalty Percentage
  showRoyaltyPercentage,
  royaltyPercentageDisable,
  royaltyPercentage,
  onRoyaltyPercentageChange,
  isRoyaltyPercentageValid,

  //Supply
  showSupply,
  supply,
  supplyDisable,
  isSupplyValid,
  handleSupplyValue,

  // owner can earn royalty
  showOwnerCanEarnRoyalty,
  isRoyaltyEarnableByOwner,
  onRoyaltyEarnableByOwnerChange,

  // splitter
  splitter,
  onsetSplitter,
  splittersOptions,
  scrolledBottomSplitters,
  onGetSplitterList,
  onSplitterDraftSave,

  //network
  disableNetwork,
  collectionNetwork,
  userId,
  isNetworkEmpty,
  setIsNetworkEmpty,
}) {
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);

  useEffect(() => {
    let detail = CURRENCY.find(
      (value) => value.id === Number(collectionNetwork)
    );
    if (detail) {
      setSelectedCurrency(detail);
    }
  }, [collectionNetwork]);

  let availableNetworks = Object.values(NETWORKS);

  let networkName = NETWORKS?.[Number(collectionNetwork)]?.networkName;
  const [selectedCurrency, setSelectedCurrency] = useState({
    id: 0,
    value: 'eth',
    label: 'ETH',
    icon: Eth,
  });
  const [showSplitterModal, setShowSplitterModal] = useState(false);
  return (
    <>
      {/* Logo */}
      <div>
        <p className='text-[14px] black-shade-900 mb-[15px]'>{logoLabel}</p>
        <div className='w-[131px] mb-[25px]'>
          {logoPhotoUrl === '' ? (
            <>
              <FileDragAndDrop
                maxFiles={1}
                height='85px'
                width='85px'
                type='logo'
                onDrop={(e) => onLogoPhotoSelect(e)}
                sizePlaceholder=''
                rounded={true}
                maxSize={4000000}
              />
              <div className='text-color-ass-8 text-[12px]  mt-[14px]'>
                Add Image/Drag from
              </div>
              <div className=' text-primary-900 text-[12px] font-bold'>
                Computer
              </div>
            </>
          ) : (
            <div className='relative w-[100px]'>
              <Image
                className='h-[85px] w-[85px] rounded-full block object-cover'
                src={logoPhotoUrl.path}
                alt='Logo'
                height={85}
                width={85}
                unoptimized
              />
              <i
                onClick={onLogoPhotoRemove}
                className='absolute  top-0 mr-2 text-[18px] cursor-pointer  text-primary-900 right-0 fa-solid fa-circle-xmark'
              ></i>
            </div>
          )}
        </div>
      </div>

      {/* name */}
      <div className='mb-6'>
        <div className='flex flex-wrap items-center mb-4'>
          <Tooltip message='This field will not be changeable after publishing on the blockchain.'></Tooltip>
          <div className='txtblack text-[14px]'>
            {nameLabel} Name{' '}
            <span className='ml-1 text-danger-1 font-bold'>*</span>
          </div>
        </div>

        {!projectNameDisabled && (
          <>
            <DebounceInput
              minLength={1}
              debounceTimeout={300}
              onChange={(e) => onProjectNameChange(e.target.value)}
              className='debounceInput mt-1'
              value={projectName}
              placeholder={nameLabel + ' name'}
            />
            {emptyProjectName && (
              <div className='validationTag'>
                Unique {nameLabel + ' name'} is required
              </div>
            )}
            {alreadyTakenProjectName && (
              <div className='validationTag'>
                {nameLabel + ' name'} has already taken
              </div>
            )}
          </>
        )}
        {projectNameDisabled && <h3 className='mt-3 ml-3'>{projectName}</h3>}
      </div>

      {/* Dao Symbol */}
      {showDaoSymbol && (
        <div className='mb-6' id='daoSymbol'>
          <div className='flex flex-wrap items-center mb-4'>
            <Tooltip></Tooltip>
            <div className='txtblack text-[14px]'>
              {symbolTitle}{' '}
              <span className='ml-1 text-danger-1 font-bold'>*</span>
            </div>
          </div>
          {!daoSymbolDisable && (
            <>
              <DebounceInput
                minLength={1}
                maxLength={5}
                debounceTimeout={300}
                onChange={(e) => onDaoSymbolChange(e.target.value)}
                className='debounceInput mt-1'
                value={daoSymbol}
                placeholder='e.g : KTL'
              />
              {emptyDaoSymbol && (
                <div className='validationTag'>{symbolTitle} is required</div>
              )}
              {alreadyTakenDaoSymbol && (
                <div className='validationTag'>
                  {symbolTitle} has already taken
                </div>
              )}
            </>
          )}
          {daoSymbolDisable && <h3>{daoSymbol}</h3>}
        </div>
      )}

      {/* Dao Wallet */}
      {showDaoWallet && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center mb-4'>
            <Tooltip message='Enter gnosis-safe address or leave it empty'></Tooltip>
            <div className='txtblack text-[14px]'>
              Treasury contract address
            </div>
          </div>
          {!daoWalletDisable && (
            <div className='flex items-center'>
              <DebounceInput
                minLength={1}
                debounceTimeout={300}
                onChange={(e) => onDaoWalletChange(e.target.value)}
                className='debounceInput mt-1'
                value={daoWallet}
                placeholder='Add gnosis-safe address'
              />
              <p className='font-black text-[14px] text-textSubtle word-break w-[35px] md:w-[25px] mx-2'>
                or
              </p>
              <div className='relative'>
                <p className='text-[12px] text-normal absolute -top-[24px]'>
                  Create with
                </p>
                <a
                  href='https://app.safe.global/'
                  target='_blank'
                  rel='noreferrer'
                >
                  <div className='w-[100px] md:w-[140px] h-[47px] bg-black-shade-800 bg-opacity-[0.3] rounded-[4px] flex items-center justify-center'>
                    <Image src={Safe} alt='Gnosis safe' />
                  </div>
                </a>
              </div>
              {/* {emptyDaoWallet && (
                <div className="validationTag">Treasury Wallet is required</div>
              )} */}
            </div>
          )}
          {daoWalletDisable && <h3 className='mt-3 ml-3'>{daoWallet}</h3>}
        </div>
      )}

      {/* category */}
      {showProjectCategory && (
        <div className='mb-6'>
          <div className='txtblack text-[14px] mb-4 '>
            Category <span className='ml-1 text-danger-1 font-bold'>*</span>
          </div>
          <div className='select-wrapper'>
            <select
              value={projectCategory}
              onChange={onProjectCategoryChange}
              name='category'
              className='h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3'
            >
              <option value={'default'} defaultValue>
                Choose an option
              </option>
              {projectCategoryList.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          {emptyProjeCtCategory && (
            <div className='validationTag'>Category is required</div>
          )}
        </div>
      )}

      {/*Network */}
      {collectionNetwork && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center mb-4'>
            <Tooltip message='This field will not be changeable after publishing on the blockchain.'></Tooltip>
            <div className='txtblack text-[14px]'>
              Blockchain<span className='ml-1 text-danger-1 font-bold'>*</span>
            </div>
          </div>
          <div className='select-wrapper'>
            <select
              value={collectionNetwork}
              onChange={(e) => {
                onBlockchainCategoryChange(e.target.value.toString());
                setIsNetworkEmpty(false);
              }}
              disabled={!collectionNetwork || userId}
              className='h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3'
            >
              {/* <option
                value={blockchainCategory}
                defaultValue
                suppressHydrationWarning
              >
                {networkName}
              </option> */}
              <option value={''}>Select Blockchain</option>
              {availableNetworks.map((network) => (
                <option key={network.network} value={network.network}>
                  {network.networkName}
                </option>
              ))}
            </select>
            {isNetworkEmpty && (
              <div className='validationTag'>Blockchain is required</div>
            )}
          </div>
        </div>
      )}

      {/* blockchain */}
      {blockchainCategory && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center mb-4'>
            <Tooltip message='This field will not be changeable after publishing on the blockchain.'></Tooltip>
            <div className='txtblack text-[14px]'>
              Blockchain <span className='ml-1 text-danger-1 font-bold'>*</span>
            </div>
          </div>
          <div className='select-wrapper'>
            <select
              value={blockchainCategory}
              placeholder={'Select Blockchain'}
              onChange={(e) => {
                onBlockchainCategoryChange(e.target.value.toString());
                setEmptyBlockchainCategory(false);
              }}
              disabled={!blockchainCategory || userId}
              className='h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3'
            >
              <option value={''}>Select Blockchain</option>
              {availableNetworks.map((network) => (
                <option key={network.network} value={network.network}>
                  {network.networkName}
                </option>
              ))}
            </select>
            {emptyBlockchainCategory && (
              <div className='validationTag'>Blockchain is required</div>
            )}
          </div>
        </div>
      )}

      {/* options */}
      {showOptions && (
        <div className='mb-6'>
          <div className='text-txtblack font-bold text-[14px] mb-2 font-black'>
            Options
          </div>
          {showTokenTransferable && (
            <div className='mb-6'>
              <div className='flex flex-wrap items-center'>
                <div className='text-txtSubtle text-[14px] md:max-w-[400px] flex flex-wrap items-center'>
                  <Tooltip message="If this is off, NFT won't be transferable between users"></Tooltip>
                  NFT can be non-transferable (Soulbound Token)
                </div>
                {!isPublished && (
                  <>
                    <label
                      htmlFor='token-transferable'
                      className='inline-flex relative items-center cursor-pointer ml-auto'
                    >
                      <input
                        disabled={isPublished}
                        type='checkbox'
                        value={isTokenTransferable}
                        id='token-transferable'
                        checked={isTokenTransferable}
                        className='sr-only peer outline-none'
                        onChange={(e) =>
                          onTokenTransferableChange(isTokenTransferable)
                        }
                      />
                      <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-900"></div>
                    </label>
                  </>
                )}
                {isPublished && (
                  <h3 className='text-textSubtle capitalize ml-auto'>
                    {isTokenTransferable?.toString()}
                  </h3>
                )}
              </div>
            </div>
          )}
          {showTimeBoundToken && (
            <div className='mb-6'>
              <div className='flex flex-wrap items-center '>
                <div className='text-txtSubtle text-[14px] md:max-w-[400px] flex flex-wrap items-center'>
                  <Tooltip message='If this is ON, NFT will be minted within limited time period since collection published time'></Tooltip>
                  NFT having limited time (Timebound Token)
                </div>
                <label
                  htmlFor='token-timebound'
                  className='inline-flex relative items-center cursor-pointer ml-auto'
                >
                  <input
                    disabled={isPublished}
                    type='checkbox'
                    value={isTokenTimebound}
                    id='token-timebound'
                    checked={isTokenTimebound}
                    className='sr-only peer outline-none'
                    onChange={(e) => onTokenTimeboundChange(isTokenTimebound)}
                  />
                  <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-900"></div>
                </label>
              </div>
              {isTokenTimebound && (
                <div className='mt-6'>
                  <p className='text-txtblack text-[14px] mb-3'>Duration</p>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <p className='text-txtSubtle  text-[14px] mb-1'>Days</p>
                      <DebounceInput
                        disabled={isPublished}
                        className={`debounceInput mt-1`}
                        minLength={1}
                        maxLength={5}
                        min='1'
                        debounceTimeout={300}
                        value={timeboundDuration?.days}
                        onChange={(e) =>
                          onTimeboundDurationChange('days', e.target.value)
                        }
                        placeholder='Add Days'
                        type='number'
                      />
                    </div>
                    <div>
                      <p className='text-txtSubtle  text-[14px] mb-1'>Months</p>
                      <DebounceInput
                        disabled={isPublished}
                        min='0'
                        className={`debounceInput mt-1`}
                        minLength={1}
                        maxLength={5}
                        debounceTimeout={300}
                        value={timeboundDuration?.months}
                        onChange={(e) =>
                          onTimeboundDurationChange('months', e.target.value)
                        }
                        placeholder='Add Months'
                        type='number'
                      />
                    </div>
                    <div>
                      <p className='text-txtSubtle  text-[14px] mb-1'>Years</p>
                      <DebounceInput
                        disabled={isPublished}
                        className={`debounceInput mt-1`}
                        min='0'
                        minLength={1}
                        maxLength={5}
                        debounceTimeout={300}
                        value={timeboundDuration?.years}
                        onChange={(e) =>
                          onTimeboundDurationChange('years', e.target.value)
                        }
                        placeholder='Add Years'
                        type='number'
                      />
                    </div>
                  </div>

                  {!isTimeboundDurationValid && isTokenTimebound && (
                    <>
                      {timeboundDuration?.days ||
                      timeboundDuration?.months ||
                      timeboundDuration?.years ? null : (
                        <p className='validationTag text-[13px]'>
                          Duration is required
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showPriceAndRoyaltySettings && (
        <div className='mb-6'>
          <p className='text-txtblack text-[14px] font-bold mb-3'>
            Price and Royalty settings
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <div className='mb-6'>
                <div className='flex flex-wrap items-center mb-4'>
                  <Tooltip message='Base price will be override by NFT price setting (if set)'></Tooltip>
                  <div className='txtblack text-[14px]'>Base Price</div>
                </div>
                <div className='flex gap-2 items-center'>
                  <div className='w-[270px]'>
                    <Select
                      components={{
                        Control,
                        IndicatorSeparator: () => null,
                      }}
                      options={CURRENCY}
                      isSearchable={false}
                      // styles={customStyles}
                      onChange={(value) => setSelectedCurrency(value)}
                      value={selectedCurrency}
                      isDisabled={true}
                    />
                  </div>
                  <input
                    disabled={isPublished}
                    type='number'
                    min='0'
                    onChange={handleBasePriceValue}
                    className='debounceInput mt-1'
                    value={basePrice}
                    placeholder='Add Price'
                  />
                </div>

                {!isBasePriceValid && (
                  <div className='validationTag'>
                    Base Price must be a number and greater than 0.
                  </div>
                )}
              </div>
            </div>
            {showSupply && (
              <div className='mb-6'>
                <div className='flex flex-wrap items-center mb-4'>
                  <Tooltip message='Supply will be override by NFT supply setting (if set)'></Tooltip>
                  <div className='txtblack text-[14px]'>Max Supply</div>
                </div>
                {!supplyDisable && (
                  <>
                    <input
                      type='number'
                      min='0'
                      onChange={handleSupplyValue}
                      className='debounceInput mt-1'
                      value={supply}
                    />
                    {!isSupplyValid && (
                      <div className='validationTag'>
                        Supply must be a number and greater than 0.
                      </div>
                    )}
                  </>
                )}
                {supplyDisable && <h3 className='text-textSubtle'>{supply}</h3>}
              </div>
            )}
          </div>
        </div>
      )}
      {showOwnerCanEarnRoyalty && (
        <>
          <div className='mb-6'>
            <div className='flex flex-wrap items-center'>
              <div className='text-txtSubtle text-[14px] md:max-w-[400px] flex flex-wrap items-center'>
                <Tooltip message='NFT creator will earn royalty per secondary sale, also splittable to contributors by royalty splitter'></Tooltip>{' '}
                Owner can earn royalty
              </div>
              {!isPublished && (
                <>
                  <label
                    htmlFor='royalty-earn-by-owner'
                    className='inline-flex relative items-center cursor-pointer ml-auto'
                  >
                    <input
                      disabled={isPublished}
                      type='checkbox'
                      value={isRoyaltyEarnableByOwner}
                      id='royalty-earn-by-owner'
                      checked={isRoyaltyEarnableByOwner}
                      className='sr-only peer outline-none'
                      onChange={(e) =>
                        onRoyaltyEarnableByOwnerChange(isRoyaltyEarnableByOwner)
                      }
                    />
                    <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-900"></div>
                  </label>
                </>
              )}
              {isPublished && (
                <h3 className='text-textSubtle capitalize ml-auto'>
                  {isRoyaltyEarnableByOwner?.toString()}
                </h3>
              )}
            </div>
          </div>
        </>
      )}
      {isRoyaltyEarnableByOwner && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-12 mb-6 gap-4'>
            {/* percentage */}
            <div className='md:col-span-7'>
              <div>
                <div className='flex flex-wrap  items-center mb-4'>
                  <Tooltip></Tooltip>
                  <div className='txtblack text-[14px]'>
                    Royalty Percentage % (for secondary market)
                  </div>
                </div>
                {!royaltyPercentageDisable && (
                  <>
                    <input
                      type='number'
                      min='0'
                      onChange={(e) =>
                        onRoyaltyPercentageChange(e.target.value)
                      }
                      className='debounceInput mt-1'
                      value={royaltyPercentage}
                    />
                    {!isRoyaltyPercentageValid && (
                      <div className='validationTag'>
                        Royalty percentage should be between 0~10%
                      </div>
                    )}
                  </>
                )}
                {royaltyPercentageDisable && (
                  <h3 className='text-textSubtle pt-2'>
                    {royaltyPercentage} %
                  </h3>
                )}
              </div>
            </div>
            {/* splitter */}
            <div className='md:col-span-5'>
              <div>
                <div className='flex flex-wrap items-center  mb-5'>
                  <Tooltip></Tooltip>
                  <div className='txtblack text-[14px]'>
                    Select Royalty Splitter
                  </div>
                </div>
                <div>
                  {!isPublished && (
                    <>
                      {typeof window !== 'undefined' && (
                        <Select
                          defaultValue={splitter}
                          onChange={onsetSplitter}
                          options={splittersOptions}
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                          menuPortalTarget={document.body}
                          placeholder='Select Splitter'
                          noOptionsMessage={() => 'No Splitter Found'}
                          loadingMessage={() => 'Loading,please wait...'}
                          getOptionLabel={(option) =>
                            `${option.name ? option.name : option.id}`
                          }
                          classNamePrefix='dao-connect'
                          isClearable
                          isSearchable
                          menuShouldScrollIntoView
                          onMenuScrollToBottom={() => scrolledBottomSplitters()}
                        />
                      )}
                    </>
                  )}
                  {isPublished && splitter?.name && (
                    <>
                      <h3 className='text-textSubtle capitalize mt-0'>
                        {splitter?.name}
                      </h3>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='mt-3 text-right'>
            <button
              onClick={() => setShowSplitterModal(true)}
              className='text-primary-900 font-black text-[13px]'
            >
              Create New Splitter
            </button>
          </div>
        </>
      )}

      <div className='my-6 md:my-12'>
        <h2
          className='accordion-header border rounded-[15px] rounded-bl-none rounded-br-none mb-0'
          id={`heading-${nameLabel}`}
        >
          <button
            className='flex  w-full text-[16px] items-center justify-between py-4 px-5 rounded-[16px]'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target={`#configure-${nameLabel}`}
            aria-expanded='false'
            aria-controls={`configure-${nameLabel}`}
          >
            Other Settings (Optional)
            <i className='ml-auto fa-solid fa-angle-down'></i>
          </button>
        </h2>

        <div
          id={`configure-${nameLabel}`}
          className={`accordion-collapse accordian-detail-content collapse rounded-[16px]`}
          aria-labelledby={`heading-${nameLabel}`}
          data-bs-parent='#content-configure'
        >
          <div className='accordion-body py-4 px-5 rounded-[16px] border border-t-none rounded-tl-none rounded-tr-none'>
            {/* photo */}
            {showPhotos && (
              <div>
                <div className='txtblack text-[14px] mb-[6px]'>
                  Upload Gallery
                </div>
                <div className='text-textSubtle text-[13px] mb-4'>
                  Supported formats include PNG, GIF, JPG, SVG, and JPEG. Not
                  more than 7 images. Max 28MB
                </div>
                <div className='md:flex md:flex-wrap mb-6'>
                  <div className='w-full md:w-[165px] mr-3 mb-2'>
                    <FileDragAndDrop
                      maxFiles={7}
                      height='158px'
                      width='100%'
                      onDrop={(e) => onPhotosSelect(e, photosUrl)}
                      sizePlaceholder='Total upto 16MB'
                      disabled={photosUrl.length > 6 ? true : false}
                    />
                  </div>
                  <div className='photoPreviewContainer md:flex flex-wrap'>
                    {photosUrl.map((image, index) => (
                      <div
                        key={`project-image-${index}`}
                        className={`relative ${style.uploadFile} w-full md:w-[158px] h-[158px] mr-3  mb-2`}
                      >
                        <Image
                          alt='gallery photos'
                          className='object-cover rounded-xl w-full md:w-[158px] h-[158px] '
                          src={image.path}
                          height={158}
                          width={158}
                        />

                        <div
                          className={` ${style.uploadPhoto} absolute w-full h-full rounded-xl cursor-pointer  items-center justify-center left-0 top-0`}
                        >
                          <i
                            className='fa-solid fa-trash'
                            onClick={() => onPhotosRemove(image)}
                          ></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* overview */}
            <div>
              <div className='txtblack text-[14px] mb-4'>Description</div>
              <textarea
                value={overview}
                onChange={onOverviewChange}
                className='mb-6 p-5'
                name='description'
                id='description'
                cols='30'
                rows='6'
                placeholder={`Describe your ${nameLabel} and its utility to your audience`}
                maxLength={1000}
              ></textarea>
            </div>

            {/* cover */}
            {showCover && (
              <div className=' mb-[25px]'>
                <div className='txtblack text-[14px] mb-4'>Cover Photo</div>
                {coverPhotoUrl === '' ? (
                  <>
                    <FileDragAndDrop
                      maxFiles={1}
                      height='180px'
                      width='100%'
                      type='cover'
                      onDrop={(e) => onCoverPhotoSelect(e)}
                      sizePlaceholder=''
                      maxSize={4000000}
                    />
                  </>
                ) : (
                  <div className='relative w-full'>
                    <Image
                      className='h-[180px] w-full rounded block object-cover '
                      src={coverPhotoUrl.path}
                      alt='coverPreview'
                      height={180}
                      width={180}
                      unoptimized
                    />
                    <i
                      onClick={onCoverPhotoRemove}
                      className='absolute  top-0  text-[18px]  cursor-pointer  text-primary-900 right-0 fa-solid fa-circle-xmark'
                    ></i>
                  </div>
                )}
              </div>
            )}

            {/* web Links*/}
            {showWebLinks && (
              <div className='mb-6'>
                <div className='txtblack text-[14px] mb-4'>
                  Add social media links
                </div>
                <div className=''>
                  {webLinks.map((link, index) => (
                    <div
                      key={index}
                      className='inline-flex items-center w-full mb-4'
                    >
                      <i
                        className={` ${
                          link.title.startsWith('customLinks')
                            ? `fa-solid fa-${link.icon}`
                            : `fa-brands fa-${link.icon}`
                        }  text-[24px] text-primary-900  mr-2`}
                      ></i>
                      <input
                        className={`block w-full border border-divider h-[48px] text-[14px] text-textSubtle rounded  pl-3  outline-none`}
                        placeholder='https://'
                        value={link.value}
                        onChange={(event) =>
                          onSocialLinkChange(event.target.value, index)
                        }
                      />
                      {index > 4 && (
                        <i
                          onClick={() => deleteSocialLinks(index)}
                          className='cursor-pointer fa-solid fa-trash text-danger-1 text-[16px] text-primary-900  ml-2 '
                        ></i>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addMoreSocialLink()}
                  className='text-primary-900 font-black text-[12px] ml-[35px]'
                >
                  + Add More Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFreezeMetadata && (
        <div className='mb-6 flex flex-wrap items-center'>
          <p className='text-txtSubtle text-[14px]'>
            NFT can be updated once after publishing (Mystery box)
          </p>
          {freezeMetadataDisabled ? (
            <label
              htmlFor='metadata-update'
              className='inline-flex relative items-center cursor-pointer ml-auto'
            >
              <input
                disabled
                type='checkbox'
                value={isMetadataFreezed}
                id='metadata-update'
                checked={isMetadataFreezed}
                className='sr-only peer outline-none'
                onChange={(e) => onMetadataFreezeChange(isMetadataFreezed)}
              />
              <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-color-asss-3"></div>
            </label>
          ) : (
            <label
              htmlFor='metadata-update'
              className='inline-flex relative items-center cursor-pointer ml-auto'
            >
              <input
                type='checkbox'
                value={isMetadataFreezed}
                id='metadata-update'
                checked={isMetadataFreezed}
                className='sr-only peer outline-none'
                onChange={(e) => onMetadataFreezeChange(isMetadataFreezed)}
              />
              <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-900"></div>
            </label>
          )}
        </div>
      )}

      {showSplitterModal && (
        <CreateSplitter
          show={showSplitterModal}
          handleClose={() => setShowSplitterModal(false)}
          onGetSplitterList={onGetSplitterList}
          onDraftSave={onSplitterDraftSave}
        />
      )}

      {/* Royalties */}
    </>
  );
}
