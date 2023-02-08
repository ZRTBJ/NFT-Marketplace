import React from 'react';
import Modal from 'components/Commons/Modal';
import {
  reportTokenContent,
  reportTokenGatedProject,
} from 'services/tokenGated/tokenGatedService';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import SuccessModal from 'components/Modals/SuccessModal';
import { useState } from 'react';
import ErrorModal from 'components/Modals/ErrorModal';
export default function ReportModal({
  show,
  handleClose,
  onReported,
  usedFor,
  id,
}) {
  const [step, setStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const confirm = async () => {
    setStep(2);
    setShowLoading(true);
    const payload = {
      id: id,
      isScam: true,
    };
    if (usedFor === 'Token Gated Project') {
      await reportTokenGatedProject(payload).then((res) => {
        setShowLoading(false);
        if (res.code === 0) {
          setShowSuccess(true);
        } else {
          setShowErrorModal(true);
          setErrorMessage(res.message);
        }
      });
    } else if (usedFor === 'Content') {
      await reportTokenContent(payload).then((res) => {
        setShowLoading(false);
        if (res.code === 0) {
          setShowSuccess(true);
        } else {
          setShowErrorModal(true);
          setErrorMessage(res.message);
        }
      });
    }
  };
  const onSuccess = () => {
    setStep(1);
    setShowSuccess(false);
    handleClose();
    onReported();
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
                handleApply={() => confirm()}
                message={`Are you sure to report of this ${usedFor} ?`}
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
                <p>We are processing you report</p>
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
              message='Successfully Submitted'
              btnText='Close'
            />
          )}
          {showErrorModal && (
            <ErrorModal
              title={'Failed to Report'}
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
