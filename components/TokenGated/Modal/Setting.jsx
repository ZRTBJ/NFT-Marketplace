import React from 'react';

import Modal from 'components/Commons/Modal';

export default function Setting({ show, handleClose }) {
  return (
    <Modal
      width={500}
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={true}
    >
      <div className='p-4'>
        <h4>Setting Modal</h4>
      </div>
    </Modal>
  );
}
