import React from 'react';
import Modal from 'components/Commons/Modal';
import { publishTokenGatedContent } from 'services/tokenGated/tokenGatedService';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import SuccessModal from 'components/Modals/SuccessModal';
import { useState } from 'react';
export default function PublishContentModal({
  show,
  handleClose,
  contents,
  onContentPublished,
}) {
  const [step, setStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const publish = async (id) => {
    const data = {
      is_publish: true,
    };
    await publishTokenGatedContent(id, data)
      .then((resp) => {
        if (resp.code === 0) {
          // console.log(resp);
        } else {
          console.log(error);
        }
      })
      .catch((err) => {});
  };
  const publishContent = async () => {
    setStep(2);
    setShowLoading(true);
    const ids = contents.map((c) => {
      return c.id;
    });
    for (const iterator of ids) {
      await publish(iterator);
    }
    setShowLoading(false);
    setShowSuccess(true);
  };
  const onSuccess = () => {
    setStep(1);
    setShowSuccess(false);
    handleClose();
    onContentPublished();
  };
  return (
    <>
      {step === 1 && (
        <>
          {showConfirmModal && (
            <>
              <ConfirmationModal
                show={showConfirmModal}
                handleClose={() => handleClose()}
                handleApply={() => publishContent()}
                message='Are you sure to publish contents'
              />
            </>
          )}
        </>
      )}
      {step === 2 && (
        <>
          {showLoading && (
            <Modal
              width={500}
              show={showLoading}
              handleClose={() => handleClose()}
              showCloseIcon={false}
            >
              <div className='text-center px-4'>
                <p className='font-black text-[18px]'>
                  Please do not close the tab
                </p>
                <p>Your contents are being published</p>
                <div className='overflow-hidden rounded-full h-4 w-full mt-4 md:mt-6 mb-8 relative animated fadeIn'>
                  <div className='animated-process-bar'></div>
                </div>
              </div>
            </Modal>
          )}
          {showSuccess && (
            <>
              <SuccessModal
                show={showSuccess}
                handleClose={() => onSuccess()}
                message='Successfully Published'
                btnText='Close'
              />
            </>
          )}
        </>
      )}
    </>
  );
}
