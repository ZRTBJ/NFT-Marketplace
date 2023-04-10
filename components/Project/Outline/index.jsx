/* eslint-disable react-hooks/exhaustive-deps */
import styles from './index.module.css';
import FileDragAndDrop from 'components/FormUtility/FileDragAndDrop';
import { useState, useEffect } from 'react';
import { getProjectCategory } from 'services/project/projectService';
import Tooltip from 'components/Commons/Tooltip';
import { NETWORKS } from 'config/networks';
import Safe from 'assets/images/safe.svg';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const DebounceInput = dynamic(() => import('react-debounce-input'), {
  suspense: true,
});

function Outline({
  // logo
  logoLabel,
  logoPhotoUrl,
  onLogoPhotoSelect,
  onLogoPhotoRemove,

  // Collection Type
  showCollectionType,
  collectionType,
  emptyCollectionType,
  onCollectionTypeSelect,

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

  // category
  showProjectCategory,
  projectCategory,
  emptyProjeCtCategory,
  onProjectCategoryChange,

  // Blockchain
  blockchainCategory,
  onBlockchainCategoryChange,
  blockchainCategoryList,

  // Freeze MetaData
  showFreezeMetadata,
  isMetadataFreezed,
  onMetadataFreezeChange,
  freezeMetadataDisabled,

  // Token Transferable
  showTokenTransferable,
  isTokenTransferable,
  onTokenTransferableChange,
  tokenTransferableDisabled,

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
}) {
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
  let networkName = NETWORKS?.[Number(blockchainCategory)]?.networkName;
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
                alt='coverPreview'
                height={85}
                width={85}
              />
              <i
                onClick={onLogoPhotoRemove}
                className='absolute  top-0 mr-2 text-[18px] cursor-pointer  text-primary-900 right-0 fa-solid fa-circle-xmark'
              ></i>
              {/* <img
                alt="coverPreviewIc"
                src={deleteIcon}
                onClick={onLogoPhotoRemove}
                className="absolute top-2 cp  right-0"
              /> */}
            </div>
          )}
        </div>
      </div>

      {/*  type */}
      {showCollectionType && (
        <>
          <div className='mb-6'>
            <div className='flex flex-wrap items-center mb-4'>
              <Tooltip message='Please select the NFT type you would create.'></Tooltip>
              <div className='txtblack text-[14px]'>NFT Type</div>
            </div>
            <div className='select-wrapper'>
              <select
                value={collectionType}
                onChange={onCollectionTypeSelect}
                className='h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3'
              >
                <option value={'default'} defaultValue>
                  Select Type
                </option>
                <option value={'membership'}>Membership</option>
                <option value={'product'}>Product</option>
              </select>
            </div>
            {emptyCollectionType && (
              <div className='validationTag'>NFT type is required</div>
            )}
          </div>
        </>
      )}

      {/* name */}
      <div className='mb-6'>
        <div className='flex flex-wrap items-center mb-4'>
          <Tooltip message='This field will not be changeable after publishing on the blockchain.'></Tooltip>
          <div className='txtblack text-[14px]'>{nameLabel}</div>
        </div>

        {!projectNameDisabled && (
          <>
            <DebounceInput
              minLength={1}
              debounceTimeout={300}
              onChange={(e) => onProjectNameChange(e.target.value)}
              className='debounceInput mt-1'
              value={projectName}
              placeholder={nameLabel}
            />
            {emptyProjectName && (
              <div className='validationTag'>
                Unique {nameLabel} is required
              </div>
            )}
            {alreadyTakenProjectName && (
              <div className='validationTag'>{nameLabel} has already taken</div>
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
            <div className='txtblack text-[14px]'>{symbolTitle}</div>
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
              Treasury Contract Address
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
                placeholder='Add gnosis-safe Address'
              />
              <p className='font-black text-[14px] text-textSubtle word-break w-[35px] md:w-[25px] mx-2'>
                Or
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
                    <Image src={Safe} alt='Gnosis safe' height={20} />
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

      {/* overview */}
      <div>
        <div className='txtblack text-[14px] mb-4'>Description</div>
        <textarea
          value={overview}
          onChange={onOverviewChange}
          className='mb-6'
          name='description'
          id='description'
          cols='30'
          rows='6'
          placeholder='Description'
          maxLength={1000}
        ></textarea>
      </div>

      {/* photo */}
      {showPhotos && (
        <div>
          <div className='txtblack text-[14px] mb-[6px]'>
            Upload Gallery Picture
          </div>
          <div className='text-textSubtle text-[13px] mb-4'>
            PNG, GIF, JPG, SVG, JPEG. Max 7 pictures of total 28 MB.
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
                  className='relative upload-file w-full md:w-[158px] h-[158px] mr-3  mb-2'
                >
                  <Image
                    alt=''
                    className='object-cover rounded-xl w-full md:w-[158px] h-[158px] '
                    src={image.path}
                    width={158}
                    height={158}
                  />

                  <div className='upload-photo absolute w-full h-full rounded-xl cursor-pointer  items-center justify-center left-0 top-0'>
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
              />
              <i
                onClick={onCoverPhotoRemove}
                className='absolute  top-0 mb-3 text-[18px]  cursor-pointer  text-primary-900 right-0 fa-solid fa-circle-xmark'
              ></i>
            </div>
          )}
        </div>
      )}

      {/* Royalties */}
      {showRoyalties && (
        <div>
          <div className='mb-6'>
            <div className='flex flex-wrap items-center mb-4'>
              <Tooltip></Tooltip>
              <div className='txtblack text-[14px]'>
                Primary Sales Royalty (in Percentage)
              </div>
            </div>
            {!royaltiesDisable && (
              <DebounceInput
                type='number'
                minLength={1}
                debounceTimeout={300}
                onChange={(e) => onPrimaryRoyaltiesChange(e.target.value)}
                className='debounceInput mt-1'
                value={primaryRoyalties}
              />
            )}
            {royaltiesDisable && <h3>{primaryRoyalties}</h3>}
          </div>

          <div className='mb-6'>
            <div className='flex flex-wrap items-center mb-4'>
              <Tooltip></Tooltip>
              <div className='txtblack text-[14px]'>
                Secondary Sales Royalty(in Percentage)
              </div>
            </div>
            {!royaltiesDisable && (
              <DebounceInput
                type='number'
                minLength={1}
                debounceTimeout={300}
                onChange={(e) => onSecondaryRoyaltiesChange(e.target.value)}
                className='debounceInput mt-1'
                value={secondaryRoyalties}
              />
            )}
            {royaltiesDisable && <h3>{secondaryRoyalties}</h3>}
          </div>
        </div>
      )}

      {/* web Links*/}
      {showWebLinks && (
        <div className='mb-3'>
          <div className='txtblack text-[14px] mb-4'>Add Social Link</div>
          <div className=''>
            {webLinks.map((link, index) => (
              <div key={index} className='inline-flex items-center w-full mb-4'>
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* category */}
      {showProjectCategory && (
        <div className='mb-6'>
          <div className='txtblack text-[14px] mb-4 '>Category</div>
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
            <div className='validationTag'>Project category is required</div>
          )}
        </div>
      )}

      {/* blockchain */}
      {blockchainCategory && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center mb-4'>
            <Tooltip message='This field will not be changeable after publishing on the blockchain.'></Tooltip>
            <div className='txtblack text-[14px] mb-[6px]'>Blockchain</div>
          </div>
          <div className='select-wrapper'>
            <select
              value={blockchainCategory}
              onChange={onBlockchainCategoryChange}
              disabled
              className='h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3'
            >
              <option
                value={blockchainCategory}
                defaultValue
                suppressHydrationWarning
              >
                {networkName}
              </option>
              {/* {blockchainCategoryList.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))} */}
            </select>
          </div>
        </div>
      )}
      {showTokenTransferable && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center'>
            <p className='text-txtSubtle text-[14px] md:max-w-[400px]'>
              Transferable Token
            </p>

            {tokenTransferableDisabled ? (
              <label
                htmlFor='token-transferable'
                className='inline-flex relative items-center cursor-pointer ml-auto'
              >
                <input
                  disabled
                  type='checkbox'
                  value={isTokenTransferable}
                  id='token-transferable'
                  checked={isTokenTransferable}
                  className='sr-only peer outline-none'
                  onChange={(e) =>
                    onTokenTransferableChange(isTokenTransferable)
                  }
                />
                <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-color-asss-3"></div>
              </label>
            ) : (
              <label
                htmlFor='token-transferable'
                className='inline-flex relative items-center cursor-pointer ml-auto'
              >
                <input
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
            )}
          </div>
        </div>
      )}

      {showFreezeMetadata && (
        <div className='mb-6 flex flex-wrap items-center'>
          <p className='text-txtSubtle text-[14px]'>
            NFT as mystery box, updated once after publishing
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

      {/* Royalties */}
      {showRoyaltyPercentage && (
        <div>
          <div className='mb-6'>
            <div className='flex flex-wrap items-center mb-4'>
              <Tooltip></Tooltip>
              <div className='txtblack text-[14px]'>
                Royalty Percentage (in Percentage)
              </div>
            </div>
            {!royaltyPercentageDisable && (
              <>
                <input
                  type='number'
                  min='0'
                  onChange={(e) => onRoyaltyPercentageChange(e.target.value)}
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
              <h3 className='text-textSubtle'>{royaltyPercentage} %</h3>
            )}
          </div>
        </div>
      )}
      {showSupply && (
        <div>
          <div className='mb-6'>
            <div className='flex flex-wrap items-center mb-4'>
              <Tooltip></Tooltip>
              <div className='txtblack text-[14px]'>Supply</div>
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
        </div>
      )}
    </>
  );
}

export default Outline;
