import Modal from 'components/Commons/Modal';
import React, { useState, useEffect } from 'react';
import { NETWORKS } from 'config/networks';
import Splitter from 'components/Project/RoyaltySplitter/components/Splitter';

export default function CreateSplitter({ handleClose, show }) {
  const [blockchain, setBlockchain] = useState('');
  const [splitterName, setSplitterName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  let validNetworks = NETWORKS
    ? Object.values(NETWORKS).filter(
        (net) => net.network !== 97 && net.network !== 56
      )
    : [];
  return (
    <>
      <Modal
        width={800}
        height={500}
        overflow={'auto'}
        show={show}
        handleClose={() => handleClose(false)}
        showCloseIcon={true}
      >
        <div className='mt-2'>
          <h3 className='text-txtblack mb-4 !text-[22px]'>
            Create a Royalty Splitter
          </h3>
          <div className='flex items-center mb-4'>
            <div className='w-2/4 mr-1'>
              <label htmlFor='splitterName'>Splitter Name</label>
              <input
                id='splitterName'
                name='splitterName'
                value={splitterName}
                className='mt-1 rounded-[3px]'
                style={{ height: 42 }}
                type='text'
                onChange={(e) => setSplitterName(e.target.value)}
                placeholder='Splitter Name'
              />
            </div>
            <div className='w-2/4 ml-1'>
              <label htmlFor='blockchain'>Blockchain</label>
              <select
                value={blockchain}
                onChange={(e) => setBlockchain(e.target.value)}
                className='h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3'
              >
                <option value={''} defaultValue>
                  Select Blockchain
                </option>
                {validNetworks.map((network) => (
                  <option value={network?.network} key={network?.network}>
                    {network?.networkName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Splitter
            isModal={true}
            splitterName={splitterName}
            blockchain={blockchain}
            createSplitterClose={handleClose}
            setIsSubmitted={setIsSubmitted}
          />
        </div>
      </Modal>
    </>
  );
}
