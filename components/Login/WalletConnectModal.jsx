import { useState, useEffect } from 'react';
import {
  getPersonalSign,
  isWalletConnected,
  getWalletAccount,
} from 'util/MetaMask';
import { ethers } from 'ethers';
import Modal from 'components/Commons/Modal';
import metamaskIcon from 'assets/images/modal/metamask.png';
import { loginUser } from 'redux/auth';
import { getUserInfo } from 'services/User/userService';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, setUserLoading } from 'redux/user';
import {
  ls_GetUserID,
  ls_SetChainID,
  ls_SetWalletAddress,
} from 'util/ApplicationStorage';
import { NETWORKS } from 'config/networks';
import WrongNetwork from './components/WrongNetwork';
import { useRouter } from 'next/router';
import Image from 'next/image';

const WalletConnectModal = ({
  showModal,
  closeModal,
  navigateToPage,
  noRedirection,
  showCloseMenu = true,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [modalKey, setModalKey] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] =
    useState(false);
  const [showMessage, setshowMessage] = useState(false);
  const [metamaskConnectAttempt, setMetamaskConnectAttempt] = useState(0);
  const [metamaskAccount, setMetamaskAccount] = useState('');
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  /** Connection to wallet
   * Login mechanism: We let user to login using metamask, then will login to our server to get JWT token.
   * From then , all action will rely on JWT Token.
   * If interact with smartcontract, we will check if metamask is connected with correct wallet address and network, otherwise htey need to login again
   * Also, we verify often to detect if metamask account change, or network change so we can login in-time
   */
  async function handleConnectWallet() {
    if (isTermsAndConditionsChecked) {
      setMetamaskConnectAttempt(metamaskConnectAttempt + 1);
      setTimeout(() => {
        if (metamaskConnectAttempt > 0) {
          window.location.reload();
        }
      }, 1000);
      const isConnected = await isWalletConnected();
      const account = await getWalletAccount();
      if (typeof window !== 'undefined') {
        if (window.ethereum) {
          const userProvider = new ethers.providers.Web3Provider(
            window?.ethereum
          );
          const userNetwork = await userProvider.getNetwork();
          if (NETWORKS?.[userNetwork.chainId]) {
            setIsWrongNetwork(false);
            if (isConnected && account && account.length > 5) {
              setMetamaskConnectAttempt(0);
              setMetamaskAccount(account);
              getPersonalSign()
                .then((signature) => {
                  userLogin(account, signature, 'metamask');
                })
                .catch((error) => {
                  alert(error.message);
                });
            } else {
              if (!isConnected && !account) {
                window?.location.reload();
              }
            }
          } else {
            setIsWrongNetwork(true);
          }
        }
      }
    } else {
      setshowMessage(true);
    }
  }

  /** Login to our server, save token info*/
  async function userLogin(address, signature, wallet) {
    const request = {
      address,
      signature,
      wallet,
    };
    try {
      setIsLoading(true);
      let response = await dispatch(loginUser(request));

      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      const userNetwork = await userProvider.getNetwork();
      ls_SetWalletAddress(address);
      ls_SetChainID(userNetwork.chainId);
      getUserDetails(response['user_id']);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  /** Get user info and save it to redux store */
  async function getUserDetails(userID) {
    dispatch(setUserLoading('loading'));
    const response = await getUserInfo(userID);
    let userinfoResponse;
    try {
      userinfoResponse = response['user'];
    } catch {
      dispatch(setUserLoading('idle'));
    }
    dispatch(setUserInfo(userinfoResponse));
    setIsLoading(false);
    if (!noRedirection) {
      //We might navigate to specific page after login, or go to profile, if user hasn't create any profile (display name)
      if (
        userinfoResponse &&
        userinfoResponse['display_name'] &&
        userinfoResponse['display_name'].length > 0
      ) {
        if (navigateToPage) {
          router.push(`/${navigateToPage}`);
        } else {
          router.push(`/dashboard`);
        }
      } else {
        router.push('/profile/settings');
      }
    }
    closeModal();
  }

  function handelTermsChecked(value) {
    setIsTermsAndConditionsChecked(value);
    setModalKey((pre) => pre + 1);
    setshowMessage(false);
  }

  return (
    <div>
      <Modal
        key={modalKey}
        width={500}
        show={showModal}
        handleClose={() => closeModal()}
        showCloseIcon={showCloseMenu}
      >
        {isWrongNetwork && (
          <WrongNetwork
            show={isWrongNetwork}
            handleClose={() => setIsWrongNetwork(false)}
          />
        )}
        <div
          className={`text-center px-[11px] md:px-[0px] mb-8 text-black ${
            isLoading ? 'loading' : ''
          }`}
        >
          <h1 className='text-[30px] md:text-[46px]'>Connect wallet</h1>
          <p className='mt-3 text-white-shade-600 font-bold break-normal'>
            Connect with your existing Metamask account or create a new one
          </p>
          <div className='mt-[26px] w-full max-w-[355px]  block mx-auto '>
            <div className='flex items-baseline'>
              <input
                type='checkbox'
                id='termsAndCondition'
                name='termsAndCondition'
                checked={isTermsAndConditionsChecked}
                onChange={(e) => handelTermsChecked(e.target.checked)}
              />
              <div>
                <div className='text-left ml-[8px] font-medium text-sm'>
                  I read and accept{' '}
                  <a
                    href='https://www.decir.io/termsandcondition'
                    target='_blank'
                    className='text-primary-900'
                    rel='noreferrer'
                  >
                    Terms Of services
                  </a>{' '}
                  and
                  <a
                    href='https://www.decir.io/policyandprivacy'
                    target='_blank'
                    className='text-primary-900'
                    rel='noreferrer'
                  >
                    {' '}
                    Privacy Policy
                  </a>
                </div>
                {showMessage && (
                  <div className='validationTag'>
                    Please accept terms and conditions
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='mt-[26px]'>
            <div
              className='w-full max-w-[355px] cursor-pointer  h-[52px] border rounded  rounded-lg block mx-auto px-[14px] bg-primary-100'
              onClick={handleConnectWallet}
            >
              <div className='flex items-center  pt-[10px]'>
                <div className='flex items-center'>
                  <Image
                    className='h-8 w-8'
                    src={metamaskIcon}
                    alt='metamask wallet login button'
                  />
                  <div className='ml-[11px] font-satoshi-bold font-black'>
                    <p>MetaMask</p>
                  </div>
                </div>
                {/* <div className="ml-auto bg-primary-900 px-2 py-1 text-[10px] rounded-lg font-satoshi-bold font-black text-white">
                  Popular
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default WalletConnectModal;
