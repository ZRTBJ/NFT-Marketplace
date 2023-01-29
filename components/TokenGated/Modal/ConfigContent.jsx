import React, { useState } from 'react';
import Modal from 'components/Commons/Modal';
// import Configuration from './Content/components/Configuration';

export default function ConfigContentModal({ show, handleClose, contents }) {
  // console.log(contents);
  return (
    <Modal
      width={500}
      w
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={true}
    >
      <div className='p-4'>
        {/* <Configuration 
          content={content}
          handleFieldChange={handleFieldChange}
          handleStep={handleStep}
          configurations={configurations}
          addConfigurations={addConfigurations}
          handleSettings={handleSettings}
          handleConfigValue={handleConfigValue}
          setShowAddCollection={setShowAddCollection}
       /> */}
        contents
      </div>
    </Modal>
  );
}
