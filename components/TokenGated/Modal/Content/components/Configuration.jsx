import React from 'react';
import Select from 'react-select';
import Trash from 'assets/images/trash.svg';
import Image from 'next/image';

const SETTINGS = [
  { value: 'Token Range', label: 'Token Range' },
  { value: 'Specific Token ID', label: 'Specific Token ID' },
  { value: 'All Token ID', label: 'All Token ID' },
];

const Configuration = ({
  content,
  handleFieldChange,
  configurations,
  addConfigurations,
  handleSettings,
  reviewScreen = false,
  handleConfigValue,
  setShowAddCollection,
  deleteConfiguration,
  validationError,
}) => {
  console.log(validationError);
  return (
    <div>
      {' '}
      {!reviewScreen && (
        <div className='mt-4 flex py-3'>
          <div className='flex-1 px-3'>
            <p className='font-black text-sm'>Make accessible to everyone</p>
          </div>
          <div className='flex flex-wrap items-center'>
            <label
              htmlFor={`accessToAll`}
              className='inline-flex relative items-center cursor-pointer ml-auto'
            >
              <input
                type='checkbox'
                id={`accessToAll`}
                name='accessToAll'
                checked={content?.accessToAll}
                className='sr-only peer outline-none'
                onChange={handleFieldChange}
              />
              <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
            </label>
          </div>
        </div>
      )}
      {content?.accessToAll ? (
        <div className='bg-primary-100 rounded-[12px] text-primary-900 font-black py-4 mt-2'>
          <i className='fa-solid fa-circle-info ml-4 mr-2 text-[16px]'></i>{' '}
          <span>Content Belongs to all Collection & Token ID</span>
        </div>
      ) : (
        <>
          <div className='accordion content-accordian' id='content-configure'>
            {configurations.map((item) => {
              // let curCollection = item?.collectionId
              //   ? options.find((data) => data.id === item?.collectionId)
              //   : null;

              let curSettings = item?.settings
                ? SETTINGS.find((data) => data.value === item?.settings)
                : null;
              return (
                <div className='accordion-item' key={item.id}>
                  <h2
                    className='accordion-header mb-0'
                    id={`heading-${item.id}`}
                  >
                    <div className='flex'>
                      <button
                        className='
            accordion-button
            relative
            flex
            items-center
            w-full
            py-4
            px-5
            text-base text-gray-800 text-left
            border-0
            rounded-none
            transition
            focus:outline-none
            accordian-sub-button
          '
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target={`#configure-${item.id}`}
                        aria-expanded='true'
                        aria-controls={`configure-${item.id}`}
                      >
                        Configuration {item.id}
                      </button>
                      {!reviewScreen ? (
                        <Image
                          src={Trash}
                          alt='Delete'
                          className='mr-2 cursor-pointer'
                          onClick={() => deleteConfiguration(item.id)}
                        />
                      ) : null}
                    </div>
                  </h2>
                  <div
                    id={`configure-${item.id}`}
                    className={`accordion-collapse show accordian-detail-content`}
                    aria-labelledby={`heading-${item.id}`}
                    data-bs-parent='#content-configure'
                  >
                    <div className='accordion-body py-4 px-5'>
                      {item?.collectionAddress ? (
                        <div className='mb-2'>
                          <p className='txtblack text-[14px]'>
                            Selected Collection
                          </p>
                          <p className='text-[14px] border-[1px] border-[#ccc] px-2 py-2 text-textSubtle w-full font-bold rounded-[4px]'>
                            {item?.name}
                          </p>
                        </div>
                      ) : (
                        <>
                          {!reviewScreen ? (
                            <button
                              className='text-[14px] border-[1px] border-primary-100 px-2 py-2 text-primary-900 w-full font-bold'
                              onClick={() => setShowAddCollection(item.id)}
                            >
                              Set Collection
                            </button>
                          ) : null}
                        </>
                      )}
                      {typeof window !== 'undefined' &&
                        item?.collectionAddress && (
                          <div className='mb-2'>
                            <div className='flex items-center mb-1'>
                              <p className='txtblack text-[14px]'>
                                Select Settings
                              </p>
                            </div>
                            <Select
                              value={curSettings}
                              onChange={(data) =>
                                handleSettings(item?.id, data?.value)
                              }
                              isDisabled={reviewScreen}
                              components={{
                                IndicatorSeparator: () => null,
                              }}
                              options={SETTINGS}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                                control: (base) => ({
                                  ...base,
                                  border: '1px solid hsl(0, 0%, 80%)',
                                }),
                              }}
                              placeholder='Select Settings'
                              classNamePrefix='select-settings'
                            />
                          </div>
                        )}
                      {item?.settings === 'Token Range' && (
                        <>
                          <div className='mb-2'>
                            <div className='flex items-center mb-1'>
                              <div className='txtblack text-[14px]'>
                                Token Min
                              </div>
                            </div>
                            <>
                              <input
                                id='tokenMin'
                                name='tokenMin'
                                className={`debounceInput mt-1 ${
                                  validationError
                                    ? 'border-red-500 text-red-500'
                                    : ''
                                }`}
                                value={item?.tokenMin}
                                placeholder='Input Token ID'
                                disabled={reviewScreen}
                                onChange={(e) => handleConfigValue(e, item.id)}
                              />
                            </>
                          </div>
                          <div className='mb-2'>
                            <div className='flex items-center mb-1'>
                              <div className='txtblack text-[14px]'>
                                Token Max
                              </div>
                            </div>
                            <>
                              <input
                                id='tokenMax'
                                name='tokenMax'
                                className={`debounceInput mt-1 ${
                                  validationError
                                    ? 'border-red-500 text-red-500'
                                    : ''
                                }`}
                                onChange={(e) => handleConfigValue(e, item.id)}
                                value={item?.tokenMax}
                                placeholder='Input Token ID'
                                disabled={reviewScreen}
                              />
                            </>
                          </div>
                          {validationError && (
                            <p className='text-sm text-red-500'>
                              Token Min should be smaller than Token Max
                            </p>
                          )}
                        </>
                      )}
                      {item?.settings === 'Specific Token ID' && (
                        <div className='mb-2'>
                          <div className='flex items-center mb-1'>
                            <div className='txtblack text-[14px]'>Token ID</div>
                          </div>
                          <>
                            <input
                              id='tokenId'
                              name='tokenId'
                              className={`debounceInput mt-1`}
                              value={item?.tokenId}
                              onChange={(e) => handleConfigValue(e, item.id)}
                              disabled={reviewScreen}
                              placeholder='Eg: 15.20.30.40'
                            />
                          </>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!reviewScreen && (
            <button
              className='mt-3 min-h-[52px] accordian-sub-button text-textSubtle font-black text-[14px] border-dashed border-[1px] w-full rounded-[8px]'
              onClick={addConfigurations}
            >
              Add More
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Configuration;
