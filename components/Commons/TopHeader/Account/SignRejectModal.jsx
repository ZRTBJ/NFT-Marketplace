import Modal from 'components/Commons/Modal';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logout } from 'redux/auth';
import { getPersonalSign } from 'util/MetaMask';
import { ethers } from 'ethers';
import { ls_SetChainID, ls_SetWalletAddress } from 'util/ApplicationStorage';
import { setUserInfo, setUserLoading, handleNewUser } from 'redux/user';
import { getUserInfo } from 'services/User/userService';
import { useState } from 'react';
import { loginUser } from 'redux/auth';

const SignRejectionModal = ({ show, closeModal, reject = false }) => {
  const [showReject, setShowReject] = useState(reject);
  let router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    window?.location.reload();
  };

  async function getUserDetails(userID) {
    dispatch(setUserLoading('loading'));
    const response = await getUserInfo(userID);
    let userinfoResponse;
    try {
      userinfoResponse = response['user'];
      if (!userinfoResponse?.last_login_time) {
        dispatch(handleNewUser(true));
      } else {
        dispatch(handleNewUser(false));
      }
    } catch {
      dispatch(setUserLoading('idle'));
    }
    dispatch(setUserInfo(userinfoResponse));
  }

  async function userLogin(address, signature, wallet) {
    const request = {
      address,
      signature,
      wallet,
    };
    try {
      let response = await dispatch(loginUser(request));
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      const userNetwork = await userProvider.getNetwork();
      ls_SetWalletAddress(show);
      ls_SetChainID(userNetwork.chainId);
      getUserDetails(response['user_id']);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  const getSignature = () => {
    getPersonalSign()
      .then((signature) => {
        setShowReject(false);
        userLogin(show, signature, 'metamask');
      })
      .catch((error) => {
        setShowReject(true);
      });
  };

  if (showReject) {
    return (
      <Modal
        width={500}
        show={!!show}
        handleClose={() => closeModal()}
        gradientBg={true}
        showCloseIcon={false}
      >
        <div className='text-center'>
          <h2>Signature Rejected</h2>
          <p className='mt-4 text-[18px]'>
            {' '}
            You have rejected the metamask signing.
          </p>
          <div className='flex items-center justify-center mt-4'>
            <button
              className='contained-button-new mr-2 cursor-pointer'
              onClick={getSignature}
            >
              Try again
            </button>
            <button
              className='gradient-border-new p-2 ml-2 font-bold cursor-pointer'
              onClick={handleLogout}
            >
              Disconnect
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      width={500}
      show={!!show}
      handleClose={() => closeModal()}
      gradientBg={true}
      showCloseIcon={false}
    >
      <div className='text-center'>
        <h2>Signature Request</h2>
        <p className='mt-4 text-[18px]' style={{ wordBreak: 'break-word' }}>
          Looks like you've changed the account in your wallet. Please sign to
          continue
        </p>
        <div className='flex items-center justify-center mt-4'>
          <button
            className='contained-button-new mr-2 cursor-pointer'
            onClick={getSignature}
          >
            Sign
          </button>
          <button
            className='gradient-border-new p-2 ml-2 font-bold cursor-pointer'
            onClick={handleLogout}
          >
            Disconnect
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SignRejectionModal;
