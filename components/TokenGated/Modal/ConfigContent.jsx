import React from 'react';
import Modal from 'components/Commons/Modal';

export default function ConfigContentModal({ show, handleClose, contents }) {
  console.log(contents);
  return (
    <Modal
      width={500}
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={true}
    >
      <div className='p-4'>
        <h4>Configure Content Modal</h4>
      </div>
    </Modal>
  );
}
