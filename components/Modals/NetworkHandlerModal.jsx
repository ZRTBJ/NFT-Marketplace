import Modal from '../Commons/Modal';
import { NETWORKS } from 'config/networks';
import { getCurrentNetworkId } from 'util/MetaMask';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { handleSwitchNetwork } from 'util/MetaMask';
import {
  ls_GetChainID,
  ls_GetWalletType,
  ls_SetChainID,
} from 'util/ApplicationStorage';

const NetworkHandlerModal = ({
  show,
  handleClose,
  projectNetwork,
  type = 'DAO',
}) => {
  const [currentNetwork, setCurrentNetwork] = useState();

  useEffect(() => {
    handleCurrentNetwork();
  }, []);

  const handleCurrentNetwork = async () => {
    let walletType = await ls_GetWalletType();
    let networkId;
    if (walletType === 'magicwallet') {
      networkId = await ls_GetChainID();
    } else if (walletType === 'metamask') {
      networkId = await getCurrentNetworkId();
    }

    setCurrentNetwork(networkId);
  };

  const handleChangeNetwork = async () => {
    try {
      let walletType = await ls_GetWalletType();
      if (walletType === 'magicwallet') {
        ls_SetChainID(projectNetwork);
        window.location.reload();
        toast.success(
          `Your network got changed to ${NETWORKS?.[projectNetwork]?.networkName}`,
          { toastId: 'network-change-deduction' }
        );
      } else if (walletType === 'metamask') {
        console.log(4);
        await handleSwitchNetwork(projectNetwork);
      }
      handleClose();
    } catch (error) {
      toast.error(
        `Please add ${NETWORKS?.[projectNetwork]?.networkName} network to your metamask wallet`
      );
    }
  };

  return (
    <Modal
      width={500}
      show={show}
      handleClose={handleClose}
      showCloseIcon={false}
    >
      <div>
        <p className='break-normal'>
          Your current wallet network is{' '}
          <span className='text-primary-900'>
            {NETWORKS?.[currentNetwork]?.networkName
              ? NETWORKS[currentNetwork].networkName
              : 'Unsupported'}
          </span>
          . But, the current {type} supports only{' '}
          <span className='text-primary-900'>
            {NETWORKS?.[projectNetwork]?.networkName}
          </span>
          . Please switch to the supported network and try again.
        </p>
        <div className='flex items-center justify-end w-full mt-4'>
          <button
            className='rounded-[4px] px-4 py-2 bg-primary-50 text-primary-900 text-[12px] font-black'
            onClick={() => handleClose(false)}
          >
            Cancel
          </button>
          <button
            className='rounded-[4px] bg-primary-900 text-white text-[12px] font-bold px-4 py-2 ml-2'
            onClick={handleChangeNetwork}
          >
            Swtich Network
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NetworkHandlerModal;
