import React from 'react';
import Modal from 'components/Commons/Modal';
import { deleteTokenGatedContent } from 'services/tokenGated/tokenGatedService';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import SuccessModal from 'components/Modals/SuccessModal';
import { useState } from 'react';
import ErrorModal from 'components/Modals/ErrorModal';
export default function PublishContentModal({
  show,
  handleClose,
  contents,
  onContentDelete,
}) {
  const [step, setStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const deleteContent = async (id) => {
    await deleteTokenGatedContent(id)
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
  const confirmDelete = async () => {
    setStep(2);
    setShowLoading(true);
    const ids = contents.map((c) => {
      return c.id;
    });
    for (const iterator of ids) {
      await deleteContent(iterator);
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
    onContentDelete();
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
                handleApply={() => confirmDelete()}
                message={`Are you sure to delete ${
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
                <p className='font-black text-[18px]'>Please wait</p>
                <p>
                  Your {contents?.length > 1 ? 'contents are ' : 'content is '}{' '}
                  being deleted
                </p>
                <div className='overflow-hidden rounded-full h-4 w-full mt-4 md:mt-6 mb-8 relative animated fadeIn'>
                  <div className='animated-process-bar'></div>
                </div>
              </div>
            </Modal>
          )}
          {showSuccess && (
            <SuccessModal
              show={showSuccess}
              handleClose={() => onSuccess()}
              message='Successfully Deleted'
              btnText='Close'
            />
          )}
          {showErrorModal && (
            <ErrorModal
              title={'Failed to Delete Content'}
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
