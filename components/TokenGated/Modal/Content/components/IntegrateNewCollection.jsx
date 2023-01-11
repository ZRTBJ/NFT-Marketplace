import Link from 'next/link';
import right from 'assets/images/right-open.svg';
import down from 'assets/images/down-close.svg';
import Image from 'next/image';
import { useState } from 'react';
import Select from 'react-select';
import { useEffect } from 'react';
import manImg from 'assets/images/image-default.svg';
import { walletAddressTruncate } from 'util/WalletUtils';
import { NETWORKS } from 'config/networks';

const IntegrateNewCollection = ({
  handleAddressChange,
  smartContractAddress,
  scrolledBottom,
  onDaoSearch,
  isCollectionLoading,
  options,
  setSmartContractAddress,
  collectionDetail,
  setCollectionDetail,
  handleConfigurations,
  showAddCollection,
}) => {
  const [showExistingCollection, setShowExistingCollection] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (showExistingCollection) {
      setSmartContractAddress('');
    } else {
      setCollectionDetail('');
    }
  }, [showExistingCollection]);

  const handleNext = () => {
    if (collectionDetail) {
      setShowPreview(true);
    }
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
  }

  let mainImage =
    collectionDetail?.assets?.length &&
    collectionDetail.assets.find((img) => img['asset_purpose'] === 'logo');
  console.log(collectionDetail);
  return (
    <div>
      {showPreview ? (
        <div>
          <h2 className='text-[28px] text-black'>Import Preview</h2>
          <div className='mt-8 rounded-[8px]'>
            <div className='flex'>
              <Image
                src={mainImage?.path ? mainImage.path : manImg}
                alt={'Collection'}
                width={75}
                height={75}
              />
              <div className='ml-3'>
                <h3 className='font-black !text-[22px]'>
                  {collectionDetail?.name}
                </h3>
                <p className='text-[14px] flex items-center'>
                  <span className='mr-1'>Smart Contract:</span>{' '}
                  <p className='text-primary-900 text-[14px]'>
                    {collectionDetail?.contract_address
                      ? walletAddressTruncate(collectionDetail.contract_address)
                      : 'Not released'}
                    {collectionDetail?.contract_address ? (
                      <i
                        className={`fa-solid fa-copy ml-2 ${
                          collectionDetail?.contract_address
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed'
                        }`}
                        disabled={!collectionDetail?.contract_address}
                        onClick={() =>
                          copyToClipboard(collectionDetail?.contract_address)
                        }
                      ></i>
                    ) : null}
                    <span id='copied-message' className='hidden ml-2'>
                      Copied !
                    </span>
                  </p>
                </p>
              </div>
              <p className='text-[14px] font-bold text-white bg-[#424867] ml-auto flex items-center justify-center w-[72px] rounded-[32px] h-[26px]'>
                {collectionDetail?.token_standard}
              </p>
            </div>
            <div className='flex justify-between mt-6'>
              <div>
                <h3 className='!text-[20px]'>Symbol</h3>
                <p>
                  {collectionDetail?.collection_symbol
                    ? collectionDetail.collection_symbol
                    : '-'}
                </p>
              </div>
              <div>
                <h3 className='!text-[20px]'>Supply</h3>
                <p>
                  {collectionDetail?.total_supply
                    ? collectionDetail.total_supply
                    : '-'}
                </p>
              </div>
              <div className='!text-[20px]'>
                <a
                  href={`${
                    NETWORKS[collectionDetail?.blockchain]
                      .viewContractAddressUrl
                  }${collectionDetail?.contract_address}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  Link
                </a>
              </div>
            </div>
          </div>
          <button
            className='px-6 py-2 contained-button rounded font-black text-white-shade-900 w-full mt-6'
            onClick={() =>
              handleConfigurations(showAddCollection, collectionDetail?.id)
            }
          >
            Finish
          </button>
        </div>
      ) : (
        <>
          {' '}
          <h2 className='text-[28px] text-black'>Add New Collection</h2>
          <div className='mt-5 border-b-[1px] border-textSubtle pb-4'>
            <h3>Import Collection</h3>
            <p className='text-textSubtle text-[12px] mt-2'>
              Import collection with your own smart contract and manage the
              token gated content in Decir
            </p>
            <p className='mt-3 text-[13px]'>
              Dont have Collection?{' '}
              <Link
                href='/collection/create'
                className='text-primary-900 font-bold'
              >
                Create New
              </Link>
            </p>
            <input
              id='smartContract'
              name='smartContract'
              className={`debounceInput mt-3`}
              value={smartContractAddress}
              placeholder='Input smart contract address'
              onChange={handleAddressChange}
              disabled={showExistingCollection}
            />
            <div
              className='flex items-center justify-between mt-6 cursor-pointer'
              onClick={() => setShowExistingCollection(!showExistingCollection)}
            >
              <p>
                Or you can <strong>Select Existing Collection</strong>
              </p>
              <Image src={showExistingCollection ? right : down} alt='down' />
            </div>
          </div>
          {showExistingCollection && (
            <div className={`mt-5 transition-all ease-in-out duration-200`}>
              <h3>Select Existing Collection</h3>
              <p className='text-textSubtle text-[12px] mt-2 mb-3'>
                Select collection that created on Decir
              </p>
              {typeof window !== 'undefined' && (
                <div className='mb-2'>
                  <Select
                    value={collectionDetail}
                    onChange={(data) => setCollectionDetail(data)}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    onKeyDown={(event) => onDaoSearch(event.target.value)}
                    options={options}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (base) => ({
                        ...base,
                        border: '1px solid hsl(0, 0%, 80%)',
                        borderRadius: 8,
                        height: 64,
                        fontWeight: 900,
                      }),
                    }}
                    menuPortalTarget={document.body}
                    placeholder='Select Collection'
                    isLoading={isCollectionLoading}
                    noOptionsMessage={() => 'No Collection Found'}
                    loadingMessage={() => 'Loading,please wait...'}
                    getOptionLabel={(option) => `${option.name}`}
                    getOptionValue={(option) => option.id}
                    classNamePrefix='collection-connect'
                    isSearchable
                    menuShouldScrollIntoView
                    onMenuScrollToBottom={() => scrolledBottom()}
                  />
                </div>
              )}
            </div>
          )}
          <button
            className='px-6 py-2 contained-button rounded font-black text-white-shade-900 w-full mt-6'
            onClick={handleNext}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default IntegrateNewCollection;
