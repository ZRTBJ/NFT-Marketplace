import React from 'react';
import Modal from 'components/Commons/Modal';
import { NETWORKS } from 'config/networks';
import Image from 'next/image';
import { handleSwitchNetwork } from 'util/MetaMask';

export default function NetworkSwitchModal({ show, handleClose }) {
  let networkList = Object.values(NETWORKS);

  const handleNetworkSelection = async (data) => {
    await handleSwitchNetwork(data.network);
    handleClose();
  };
  return (
    <Modal
      width={520}
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={true}
    >
      <div className='text-left px-4 pt-6 pb-3'>
        <p className='text-[18px] text-red-400 flex items-start'>
          <i class='fa-solid fa-triangle-exclamation mr-2 text-[24px]'></i>{' '}
          <span className='break-normal'>
            You have connected to an unsupported network. Please switch to any
            of the following network by selecting it.
          </span>
        </p>
        <div className='mt-4'>
          {networkList.map((network) => (
            <div
              key={network?.network}
              onClick={() => handleNetworkSelection(network)}
              className='rounded-xl cursor-pointer flex place-items-center px-3 py-2 bg-primary-100 border-primary-900 hover:bg-primary-400 mb-2'
            >
              <Image
                className='rounded-full border-gray-100 shadow-sm mr-2'
                src={network?.icon?.src}
                height={18}
                width={18}
                alt='user icon'
              />{' '}
              <span className='mr-2 text-lg font-semibold'>
                {network?.networkName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
