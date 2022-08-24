/* eslint-disable react-hooks/exhaustive-deps */
import 'assets/css/CreateProject/Outline.css';
import deleteIcon from 'assets/images/projectCreate/ico_delete01.svg';
import FileDragAndDrop from './FileDragAndDrop';
import { useState, useEffect } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { getProjectCategory } from 'services/project/projectService';
import Tooltip from 'components/Tooltip';

export default function Outline({
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
}) {
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
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
              <img
                className='h-[85px] w-[85px] rounded-full block object-cover'
                src={logoPhotoUrl.path}
                alt='coverPreview'
              />
              <img
                alt='coverPreviewIc'
                src={deleteIcon}
                onClick={onLogoPhotoRemove}
                className='absolute top-2 cp right-0'
              />
            </div>
          )}
        </div>
      </div>

      {/*  type */}
      {showCollectionType && (
        <>
          <div className='mb-6'>
            <div className='flex flex-wrap items-center'>
              <Tooltip message='Please select the NFT type you would create.'></Tooltip>
              <div className='txtblack text-[14px] mb-[6px]'>NFT Type</div>
            </div>
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
            {emptyCollectionType && (
              <div className='validationTag'>NFT type is required</div>
            )}
          </div>
        </>
      )}

      {/* name */}
      <div className='mb-6'>
        <div className='flex flex-wrap items-center'>
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
          <div className='flex flex-wrap items-center'>
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
          <div className='flex flex-wrap items-center'>
            <Tooltip message='This field will not be changeable after publishing on the blockchain.'></Tooltip>
            <div className='txtblack text-[14px]'>Treasury Wallet</div>
          </div>
          {!daoWalletDisable && (
            <>
              <DebounceInput
                minLength={1}
                debounceTimeout={300}
                onChange={(e) => onDaoWalletChange(e.target.value)}
                className='debounceInput mt-1'
                value={daoWallet}
                placeholder='Add Address'
              />
              {emptyDaoWallet && (
                <div className='validationTag'>Treasury Wallet is required</div>
              )}
            </>
          )}
          {daoWalletDisable && <h3 className='mt-3 ml-3'>{daoWallet}</h3>}
        </div>
      )}

      {/* overview */}
      <div>
        <div className='txtblack text-[14px]'>Description</div>
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
            PNG, GIF, WEBP, MP4 or MP3. Max 100mb.
          </div>
          <div className='md:flex flex-wrap mb-6'>
            <div className='w-[158px] mr-3 mb-2'>
              <FileDragAndDrop
                maxFiles={4}
                height='158px'
                width='158px'
                onDrop={(e) => onPhotosSelect(e, photosUrl)}
                sizePlaceholder='Total upto 16MB'
                disabled={photosUrl.length > 3 ? true : false}
              />
            </div>
            <div className='photoPreviewContainer flex flex-wrap'>
              {photosUrl.map((image, index) => (
                <div
                  key={`project-image-${index}`}
                  className='relative upload-file w-[158px] h-[158px] mr-3  mb-2'
                >
                  <img
                    alt=''
                    className='outlinePhoto block object-cover rounded-xl'
                    src={image.path}
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
          <div className='txtblack text-[14px] mb-[6px]'>Cover Photo</div>
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
              <img
                className='h-[180px] w-full rounded block object-cover'
                src={coverPhotoUrl.path}
                alt='coverPreview'
              />
              <img
                alt='coverPreviewIc'
                src={deleteIcon}
                onClick={onCoverPhotoRemove}
                className='absolute top-0 cp right-0'
              />
            </div>
          )}
        </div>
      )}

      {/* Royalties */}
      {showRoyalties && (
        <div>
          <div className='mb-6'>
            <div className='flex flex-wrap items-center'>
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
            <div className='flex flex-wrap items-center'>
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
          <div className='txtblack text-[14px] mb-[6px]'>Add Social Link</div>
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
      <div className='mb-6'>
        <div className='txtblack text-[14px] mb-[6px] '>Category</div>
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
        {emptyProjeCtCategory && (
          <div className='validationTag'>Project category is required</div>
        )}
      </div>

      {/* blockchain */}
      {blockchainCategory && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center'>
            <Tooltip message='This field will not be changeable after publishing on the blockchain.'></Tooltip>
            <div className='txtblack text-[14px] mb-[6px]'>Blockchain</div>
          </div>
          <select
            value={blockchainCategory}
            onChange={onBlockchainCategoryChange}
            disabled
            className='h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3'
          >
            <option value={blockchainCategory} defaultValue>
              Ethereum
            </option>
            {/* {blockchainCategoryList.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))} */}
          </select>
        </div>
      )}
      {showTokenTransferable && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center'>
            <p className='text-txtSubtle text-[14px] md:max-w-[400px]'>
              Transferable Token
            </p>

            {tokenTransferableDisabled ? (
              <p className='ml-auto text-textSubtle text-[14px]'>
                {isTokenTransferable.toString().toUpperCase()}
              </p>
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
          <p className='text-txtSubtle text-[14px]'>Metadata update</p>
          {freezeMetadataDisabled ? (
            <p className='ml-auto text-textSubtle text-[14px]'>
              {isMetadataFreezed.toString().toUpperCase()}
            </p>
          ) : (
            <label
              htmlFor='checked-toggle'
              className='inline-flex relative items-center cursor-pointer ml-auto'
            >
              <input
                type='checkbox'
                value={isMetadataFreezed}
                id='checked-toggle'
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
            <div className='flex flex-wrap items-center'>
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
                  debounceTimeout={300}
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
    </>
  );
}
