import React from 'react';
import Modal from 'components/Commons/Modal';
import { publishTokenGatedContent } from 'services/tokenGated/tokenGatedService';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
import { useState } from 'react';
export default function PublishContentModal({
  show,
  handleClose,
  contents,
  onContentPublished,
  usedForPublish,
}) {
  const [step, setStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const publish = async (content) => {
    const data = {
      is_publish: checkUsedFor === 'publish' ? true : false,
    };
    await publishTokenGatedContent(content.id, data)
      .then((resp) => {
        if (resp.code === 0) {
          // console.log(resp);
        } else {
          setShowLoading(false);
          setShowErrorModal(true);
          setErrorMessage(resp.message);
        }
      })
      .catch((err) => {});
  };

  const publishContent = async () => {
    setStep(2);
    setShowLoading(true);
    for (const iterator of contents) {
      await publish(iterator);
    }
    setShowLoading(false);
    if (!showErrorModal) {
      setShowSuccess(true);
    }
  };
  const onSuccess = () => {
    setStep(1);
    setShowSuccess(false);
    handleClose();
    onContentPublished();
  };
  const checkUsedFor = usedForPublish
    ? contents?.length > 1
      ? 'publish'
      : contents[0]?.status === 'draft'
      ? 'publish'
      : 'un-publish'
    : 'un-publish';
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
                message={`Are you sure to ${checkUsedFor}  ${
                  contents?.length > 1 ? 'contents' : 'content'
                } ?`}
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
                <p>
                  We are updating the
                  {contents?.length > 1 ? ' contents' : ' content'}
                </p>
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
                message='Successfully Updated'
                btnText='Close'
              />
            </>
          )}
          {showErrorModal && (
            <ErrorModal
              title={`Failed to ${usedForPublish ? 'Publish' : 'Un-Publish'}`}
              message={`${errorMessage}`}
              handleClose={() => {
                setShowErrorModal(false);
                setErrorMessage('');
                setStep(1);
              }}
              show={showErrorModal}
            />
          )}
        </>
      )}
    </>
  );
}
