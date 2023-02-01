import React, { useState } from 'react';

import Modal from 'components/Commons/Modal';
import UploadByLinkHelperModal from 'components/TokenGated/Modal/UploadByLinkHelperModal';
export default function UploadByLink({
  show,
  handleClose,
  linkDetails,
  handleLinkDetails,
  handleAddLink,
  linkError,
}) {
  const [showUploadLinkHelper, setShowUploadLinkHelper] = useState(false);
  const [step, setStep] = useState(0);
  return (
    <>
      {step === 0 && (
        <Modal
          width={500}
          show={show}
          handleClose={() => handleClose()}
          showCloseIcon={true}
        >
          <div className='p-4'>
            <h2 className='text-[28px] text-black'>Input your link here</h2>
            <p className='text-textLight text-[14px] mt-2'>
              Fill the require form to create NFT Collection
            </p>

            <div className='mt-3'>
              <button
                className='text-primary-900 bg-primary-100 font-black px-3 py-2 mb-4 rounded-[4px]'
                onClick={() => {
                  setStep(1);
                  setShowUploadLinkHelper(true);
                }}
              >
                How to get link
              </button>
              <div className='flex items-center'>
                <input
                  placeholder='Input your link here'
                  value={linkDetails.link}
                  className='w-3/4 border-[1px] p-2 rounded-[8px] min-h-[41px] z-20'
                  style={{
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                  name='link'
                  onChange={handleLinkDetails}
                />
                <div className='select-wrapper w-1/4'>
                  <select
                    value={linkDetails.type}
                    style={{
                      borderBottomLeftRadius: 0,
                      borderTopLeftRadius: 0,
                    }}
                    className='bg-[#E6E8EE] rounded-[8px] pl-5'
                    name='type'
                    onChange={handleLinkDetails}
                  >
                    <option value='image'>Image</option>
                    <option value='video'>Video</option>
                    <option value='audio'>Audio</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
              </div>
              {linkError && (
                <p className='text-red-500 text-xs font-medium'>
                  Please enter a valid image url
                </p>
              )}
              <button
                className='px-6 py-2 contained-button rounded font-black text-white-shade-900 w-full mt-6'
                onClick={handleAddLink}
              >
                Create Now
              </button>
            </div>
          </div>
        </Modal>
      )}
      {step === 1 && (
        <>
          {showUploadLinkHelper && (
            <UploadByLinkHelperModal
              show={showUploadLinkHelper}
              handleClose={() => {
                setStep(0);
                setShowUploadLinkHelper(false);
              }}
            />
          )}
        </>
      )}
    </>
  );
}
