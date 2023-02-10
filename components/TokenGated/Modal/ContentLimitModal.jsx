import React, { useState } from 'react';
import Modal from 'components/Commons/Modal';

export default function ContentLimitModal({ show, handleClose }) {
  return (
    <Modal
      width={500}
      w
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={true}
    >
      <div className='p-4 text-center'>
        <h3>
          You've reached limit of free 3 contents. Please contact us to remove
          the limit.
        </h3>
        <a href='mailto:contact@decir.io'>
          <button className='contained-button mt-6'>Contact</button>
        </a>
      </div>
    </Modal>
  );
}
