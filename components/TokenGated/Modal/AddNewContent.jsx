import React from 'react';

import Modal from 'components/Commons/Modal';

export default function AddNewContent({ show, handleClose }) {
  return (
    <Modal
      width={500}
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={true}
    >
      <div className='p-4'>
        <h4>Add New Content Modal</h4>
      </div>
    </Modal>
  );
}
