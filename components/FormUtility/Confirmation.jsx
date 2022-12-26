/* eslint-disable react-hooks/exhaustive-deps */
import { NETWORKS } from 'config/networks';
import Image from 'next/image';

export default function Outline({
  // logo
  logoLabel,
  logoPhotoUrl,

  // name
  nameLabel,
  projectName,

  // Dao symbol
  symbolTitle,
  showDaoSymbol,
  daoSymbol,

  // Dao wallet
  showDaoWallet,
  daoWallet,

  // overview
  overview,

  showCover,
  coverPhotoUrl,
  showRoyalties,
  primaryRoyalties,
  secondaryRoyalties,

  // photo
  showPhotos,
  photosUrl,

  // webLinks
  webLinks,
  showWebLinks,

  // category
  projectCategoryName,

  // Blockchain
  blockchainCategory,
  showProjectCategory,

  showFreezeMetadata,
  isMetaDaFreezed,
  showTokenTransferable,
  isTokenTransferable,
  showRoyaltyPercentage,
  royaltyPercentage,
  showSupplyData,
  supply,
  network,
}) {
  return (
    <>
      <h2 className='mb-4'>Preview</h2>
      {/* Logo */}
      <div>
        <p className='text-[14px] black-shade-900 '>{logoLabel}</p>
        <div className='w-[131px] mb-[25px]'>
          {logoPhotoUrl === '' ? (
            <p className='text-textSubtle'>No Logo</p>
          ) : (
            <div className='relative w-[100px]'>
              <Image
                className='h-[85px] w-[85px] rounded-full block object-cover'
                src={logoPhotoUrl.path}
                alt='coverPreview'
                height={85}
                width={85}
                unoptimized
              />
            </div>
          )}
        </div>
      </div>
      {/* name */}
      <div className='mb-6'>
        <div className='flex flex-wrap items-center'>
          {/* <Tooltip></Tooltip> */}
          <div className='txtblack text-[14px]'>{nameLabel}</div>
        </div>
        <p className='text-textSubtle'>{projectName}</p>
      </div>
      {/* Dao Symbol */}
      {showDaoSymbol && (
        <div className='mb-6' id='daoSymbol'>
          <div className='flex flex-wrap items-center'>
            {/* <Tooltip></Tooltip> */}
            <div className='txtblack text-[14px]'>{symbolTitle}</div>
          </div>
          <p className='text-textSubtle'>{daoSymbol}</p>
        </div>
      )}
      {/* Dao Wallet */}
      {showDaoWallet && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center'>
            {/* <Tooltip></Tooltip> */}
            <div className='txtblack text-[14px]'>Treasury Wallet</div>
          </div>
          <p className='text-textSubtle'>{daoWallet}</p>
        </div>
      )}
      {/* overview */}
      <div className='mb-6'>
        <div className='txtblack text-[14px]'>Description</div>
        <div className='text-textSubtle'>
          {overview === '' ? (
            'No description'
          ) : (
            <p className='mb-6 whitespace-pre-line'>{overview}</p>
          )}
        </div>
      </div>
      {/* Cover */}
      {showCover && (
        <div className='mb-6'>
          <div className='txtblack text-[14px] mb-[6px]'>Cover</div>
          {coverPhotoUrl === '' ? (
            <div className='text-textSubtle'>No Cover</div>
          ) : (
            <Image
              className='h-[180px] w-full rounded block object-cover'
              src={coverPhotoUrl.path}
              alt='coverPreview'
              width={108}
              height={108}
              unoptimized
            />
          )}
        </div>
      )}
      {showRoyalties && (
        <div className='mb-6'>
          <div className='mb-6'>
            <div className='txtblack text-[14px]'>Primary Royalties</div>
            <p className='text-textSubtle'>{primaryRoyalties}</p>
          </div>
          <div className='txtblack text-[14px] '>Secondary Royalties</div>
          <p className='text-textSubtle'>{secondaryRoyalties}</p>
        </div>
      )}
      {/* photo */}
      {showPhotos && (
        <div>
          <div className='txtblack text-[14px] mb-[6px]'>Gallery Picture</div>
          <div className='md:flex flex-wrap mb-6'>
            <div className='photoPreviewContainer flex flex-wrap'>
              {photosUrl.length === 0 ? (
                <p className='text-textSubtle'>No Files</p>
              ) : (
                <>
                  {photosUrl.map((image, index) => (
                    <div
                      key={`project-image-${index}`}
                      className='relative upload-file w-full md:w-[158px] h-[158px] mr-3  mb-2'
                    >
                      <Image
                        alt=''
                        className='w-full md:w-[158px] h-[158px] object-cover rounded-xl'
                        src={image.path}
                        width={158}
                        height={158}
                        unoptimized
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* web Links*/}
      {showWebLinks && (
        <div className='mb-3'>
          <div className='txtblack text-[14px] mb-[6px]'>Social Link</div>
          <div className=''>
            {webLinks.map((link, index) => (
              <div key={index} className='inline-flex items-center w-full my-2'>
                <i
                  className={` ${
                    link.title.startsWith('customLinks')
                      ? `fa-solid fa-${link.icon}`
                      : `fa-brands fa-${link.icon}`
                  }  text-[24px] text-primary-900  mr-2`}
                ></i>
                <p
                  className={`block w-full   text-[14px] text-textSubtle rounded  pl-3  outline-none`}
                >
                  {link.value === '' ? 'https://' : link.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* category */}
      {showProjectCategory && (
        <div className='mb-6'>
          <div className='txtblack text-[14px] mb-[6px] '>Category</div>
          <p className='text-textSubtle'>{projectCategoryName}</p>
        </div>
      )}
      {/* blockchain */}
      {blockchainCategory && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center'>
            {/* <Tooltip></Tooltip> */}
            <div className='txtblack text-[14px] mb-[6px]'>Blockchain</div>
          </div>
          <p className='text-textSubtle'>
            {NETWORKS[Number(blockchainCategory)].networkName}
          </p>
        </div>
      )}
      {showFreezeMetadata && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center'>
            {/* <Tooltip></Tooltip> */}
            <div className='txtblack text-[14px] mb-[6px]'>
              Metadata Updatable
            </div>
          </div>
          <p className='text-textSubtle'>{isMetaDaFreezed ? 'Yes' : 'No'}</p>
        </div>
      )}
      {showTokenTransferable && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center'>
            {/* <Tooltip></Tooltip> */}
            <div className='txtblack text-[14px] mb-[6px]'>
              Transferable Token
            </div>
          </div>
          <p className='text-textSubtle'>
            {isTokenTransferable ? 'Yes' : 'No'}
          </p>
        </div>
      )}
      {network && (
        <div className='mb-6'>
          <div className='flex flex-wrap items-center'>
            {/* <Tooltip></Tooltip> */}
            <div className='txtblack text-[14px] mb-[6px]'>Blockchain</div>
          </div>
          <p className='text-textSubtle'>
            {NETWORKS[Number(network)].networkName}
          </p>
        </div>
      )}
      {showRoyaltyPercentage && (
        <div className='mb-6'>
          <div className='mb-6'>
            <div className='txtblack text-[14px]'>Royalty Percentage</div>
            <p className='text-textSubtle'>{royaltyPercentage}</p>
          </div>
        </div>
      )}
      {showSupplyData && (
        <div className='mb-6'>
          <div className='mb-6'>
            <div className='txtblack text-[14px]'>Supply</div>
            <p className='text-textSubtle'>{supply}</p>
          </div>
        </div>
      )}
    </>
  );
}
