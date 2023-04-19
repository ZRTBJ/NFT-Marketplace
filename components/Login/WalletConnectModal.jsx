import { useState, useEffect } from 'react';
import {
  getPersonalSign,
  isWalletConnected,
  getWalletAccount,
} from 'util/MetaMask';
import { ethers } from 'ethers';
import Modal from 'components/Commons/Modal';
import metamaskIcon from 'assets/images/modal/metamask.png';
import MagicWallet from 'assets/images/magic-wallet.png';
import { loginUser } from 'redux/auth';
import { getUserInfo } from 'services/User/userService';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUserInfo,
  setUserLoading,
  handleNewUser,
  setUserEmail,
} from 'redux/user';
import {
  ls_GetUserID,
  ls_SetChainID,
  ls_SetWalletAddress,
} from 'util/ApplicationStorage';
import WrongNetwork from './components/WrongNetwork';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Lottie from 'react-lottie';
import lottieJson from 'assets/lottieFiles/circle-loader.json';
import SignRejectionModal from 'components/Commons/TopHeader/Account/SignRejectModal';
import { magic, etherMagicProvider } from 'config/magicWallet/magic';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import Spinner from 'components/Commons/Spinner';
let MESSAGE = "You're signing to the decir.io";

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
  const [magicLoading, setMagicLoading] = useState(false);
  const [showSignReject, setShowSignReject] = useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieJson,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const userinfo = useSelector((state) => state.user.userinfo);

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
          // if (NETWORKS_LIST?.[userNetwork.chainId]) {
          //   setIsWrongNetwork(false);
          if (isConnected && account && account.length > 5) {
            setMetamaskConnectAttempt(0);
            setMetamaskAccount(account);
            getPersonalSign()
              .then((signature) => {
                userLogin(account, signature, 'metamask');
              })
              .catch((error) => {
                if (userinfo?.id) {
                  setShowSignReject(account);
                }
              });
          } else {
            if (!isConnected && !account) {
              window?.location.reload();
            }
          }
          // } else {
          //   setIsWrongNetwork(true);
          // }
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
      ls_SetWalletAddress(address);
      if (wallet === 'metamask') {
        const userProvider = new ethers.providers.Web3Provider(window.ethereum);
        const userNetwork = await userProvider.getNetwork();
        ls_SetChainID(userNetwork.chainId);
      } else if (wallet === 'magicwallet') {
        let magicChainId = await etherMagicProvider.getNetwork();
        ls_SetChainID(magicChainId?.chainId);
      }
      getUserDetails(response['user_id'], wallet);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  /** Get user info and save it to redux store */
  async function getUserDetails(userID, wallet) {
    dispatch(setUserLoading('loading'));
    const response = await getUserInfo(userID);
    let userinfoResponse;
    try {
      userinfoResponse = response['user'];
      if (!userinfoResponse?.last_login_time) {
        if (wallet === 'magicwallet') {
          const userInfo = await magic.wallet.requestUserInfoWithUI({
            scope: {
              email: 'optional',
            },
          });
          console.log(userInfo);
          dispatch(setUserEmail(userInfo?.email));
          dispatch(handleNewUser(true));
        } else {
          dispatch(handleNewUser(true));
        }
      } else {
        dispatch(handleNewUser(false));
      }
    } catch {
      dispatch(setUserLoading('idle'));
    }
    dispatch(setUserInfo(userinfoResponse));
    setIsLoading(false);
    if (!noRedirection) {
      //We might navigate to specific page after login, or go to profile, if user hasn't create any profile (display name)
      // if (
      //   userinfoResponse &&
      //   userinfoResponse['display_name'] &&
      //   userinfoResponse['display_name'].length > 0
      // ) {
      if (navigateToPage) {
        router.push(`/${navigateToPage}`);
      } else {
        router.push(`/dashboard`);
      }
      // }
    }
    closeModal();
  }

  function handelTermsChecked(value) {
    setIsTermsAndConditionsChecked(value);
    setModalKey((pre) => pre + 1);
    setshowMessage(false);
  }

  const handleMagicConnect = async () => {
    try {
      if (isTermsAndConditionsChecked) {
        setMagicLoading(true);
        const accounts = await magic.wallet.connectWithUI();
        const signer = etherMagicProvider.getSigner();
        const signedMessage = await signer.signMessage(MESSAGE);
        const recoveredAddress = recoverPersonalSignature({
          data: MESSAGE,
          signature: signedMessage,
        });
        setMagicLoading(false);
        if (
          recoveredAddress.toLocaleLowerCase() ===
          accounts[0].toLocaleLowerCase()
        ) {
          setMetamaskAccount(accounts[0]);

          userLogin(
            accounts[0].toLocaleLowerCase(),
            signedMessage,
            'magicwallet'
          );
        }
      } else {
        setshowMessage(true);
      }
    } catch (err) {
      console.log(err);
      setMagicLoading(false);
    }
  };

  if (showSignReject) {
    return (
      <SignRejectionModal
        show={showSignReject}
        closeModal={() => {
          setShowSignReject(false);
          closeModal();
        }}
        handleTryAgain={handleConnectWallet}
        reject={true}
      />
    );
  }
  return (
    <div>
      <Modal
        key={modalKey}
        width={500}
        show={showModal}
        handleClose={() => closeModal()}
        showCloseIcon={showCloseMenu}
        gradientBg={true}
      >
        {isWrongNetwork && (
          <WrongNetwork
            show={isWrongNetwork}
            handleClose={() => setIsWrongNetwork(false)}
          />
        )}
        <div className={`px-[11px] md:px-[0px] mb-8 text-black`}>
          <h1 className='text-[30px] md:text-[46px]'>Connect your wallet</h1>
          <p className='mt-3 text-[#838383] font-normal break-normal'>
            Connect with your existing Metamask account or create a new one
          </p>
          {isLoading ? (
            <div className='text-center'>
              <Lottie options={defaultOptions} height={205} width={205} />
              <p className='text-[18px] font-black -mt-8'>Connecting Wallet</p>
              <p className='text-[14px] font-normal'>Please Wait...</p>
            </div>
          ) : (
            <>
              <div className='mt-[26px] w-full  block mx-auto '>
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
                        href='https://decir.io/privacy-policy-2/'
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
                  className='w-full cursor-pointer  h-[72px] rounded-[12px] block mx-auto px-[14px] bg-[#fff] flex items-center connect-wallet'
                  onClick={handleConnectWallet}
                >
                  <div className='flex items-center ml-2'>
                    <div className='flex items-center'>
                      <Image
                        className='h-9 w-9'
                        src={metamaskIcon}
                        alt='metamask wallet login button'
                      />
                      <div className='ml-[16px] font-satoshi-bold font-black text-[24px]'>
                        <p className='text-[18px]'>Metamask</p>
                      </div>
                    </div>
                    {/* <div className="ml-auto bg-primary-900 px-2 py-1 text-[10px] rounded-lg font-satoshi-bold font-black text-white">
                  Popular
                </div> */}
                  </div>
                </div>
                <div
                  onClick={handleMagicConnect}
                  className='w-full cursor-pointer  h-[72px] rounded-[12px] block mx-auto px-[14px] bg-[#fff] flex items-center connect-wallet mt-3'
                >
                  {magicLoading ? (
                    <div className='flex items-center justify-center ml-1 text-center w-full'>
                      <Spinner />
                    </div>
                  ) : (
                    <div className='flex items-center ml-1'>
                      <div className='flex items-center'>
                        <Image
                          className='h-12 w-12'
                          src={MagicWallet}
                          alt='Magic wallet login button'
                        />
                        <div className='ml-[10px] font-satoshi-bold font-black text-[24px]'>
                          <p className='text-[18px]'>Magic Connect</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
export default WalletConnectModal;
