/* eslint-disable react-hooks/exhaustive-deps */
import styles from './index.module.css';
import { useState, useEffect, useRef } from 'react';
import WalletDropDownMenu from './WalletDropdownMenu';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import useWebSocket from 'react-use-websocket';
import config from 'config/config';
import { getProjectListBySearch } from 'services/project/projectService';
import SearchBarResult from './SearchBarResult';
import { getNotificationData } from 'redux/notification';
import NotificatioMenu from './NotificationMenu';
import { getUserNotifications } from 'services/notification/notificationService';
import UserDropDownMenu from './UserDropDownMenu';
import userImg from 'assets/images/defaultProfile.svg';
import barImage from 'assets/images/bars.svg';
import bellImage from 'assets/images/bell.svg';
import walletImage from 'assets/images/wallet.svg';
import searchImage from 'assets/images/search.svg';
import Logo from 'assets/images/header/logo.svg';
import AccountChangedModal from './Account/AccountChangedModal';
import NetworkChangedModal from './Account/NetworkChangedModal';
import { walletAddressTruncate } from 'util/WalletUtils';
import {
  ls_GetUserToken,
  ls_GetWalletAddress,
  ls_SetChainID,
  ls_GetChainID,
  ls_SetNewUser,
  ls_GetNewUser,
} from 'util/ApplicationStorage';
import { toast } from 'react-toastify';
import { NETWORKS } from 'config/networks';
import { logout } from 'redux/auth';
import Image from 'next/image';
import { getWalletAccount } from 'util/MetaMask';
import WelcomeModal from 'components/Commons/WelcomeModal/WelcomeModal';
import Search from 'assets/images/header/search.svg';
import Globe from 'assets/images/header/globe.svg';
import AvatarDefault from 'assets/images/avatar-default.svg';

const LANGS = {
  'en|en': 'English',
  'en|ar': 'Arabic',
  'en|zh-CN': 'Chinese (Simplified)',
  'en|fr': 'French',
  'en|ja': 'Japanese',
  'en|es': 'Spanish',
};

const Header = ({ handleSidebar, showModal, setShowModal }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { user, walletAddress, token } = useSelector((state) => state.auth);
  const [userId, setUserId] = useState(user ? user : '');
  const userinfo = useSelector((state) => state.user.userinfo);
  const [messageHistory, setMessageHistory] = useState([]);
  const userLoadingStatus = useSelector((state) => state.user.status);
  const [showWalletpopup, setShowWalletpopup] = useState(false);
  const [showUserpopup, setShowUserpopup] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [notificationCount, setnotificationCount] = useState(0);
  const [showAccountChanged, setShowAccountChanged] = useState(false);
  const [showNetworkChanged, setShowNetworkChanged] = useState(false);
  const [networkChangeDetected, setNetworkChangeDetected] = useState(false);
  const [networkId, setNetworkId] = useState();
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const projectDeploy = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );

  useEffect(() => {
    var addScript = document.createElement('script');
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    );
    document?.body?.appendChild(addScript);
    if (typeof window !== 'undefined') {
      window.googleTranslateElementInit = googleTranslateElementInit;
    }

    return () => {
      let container = document.getElementById('google_translate_element');
      container?.remove();
    };
  }, []);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,es,ja,zh-CN,fr,ar',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      'google_translate_element'
    );
  };

  useEffect(() => {
    if (!ls_GetNewUser()) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    let getLabel = document.querySelector('.goog-te-gadget-simple a span');
    if (getLabel?.innerHTML === 'Select Language') {
      getLabel.innerHTML = 'English';
    }

    handleLanguage();
  });

  function handleLanguage() {
    let getLabel = document.querySelector('.goog-te-gadget-simple a span');
    let val = readCookie('googtrans');
    let slicedVal = val ? val.slice(1) : '';

    let output = slicedVal ? slicedVal.replace(/\//g, '|') : '';
    if (getLabel) {
      if (output) {
        getLabel.innerHTML = LANGS[output];
      } else {
        getLabel.innerHTML = 'English';
      }
    }
  }

  function readCookie(name) {
    var c = document.cookie.split('; '),
      cookies = {},
      i,
      C;

    for (i = c.length - 1; i >= 0; i--) {
      C = c[i].split('=');
      cookies[C[0]] = C[1];
    }
    return cookies[name];
  }

  /** Metamask network change detection */
  useEffect(() => {
    setNetworkChangeDetected(false);
    if (window?.ethereum) {
      if (!networkId) setNetworkId(window.ethereum.networkVersion);
      window?.ethereum?.on('networkChanged', function (networkId) {
        setNetworkChangeDetected(true);
        setNetworkId(networkId);
        ls_SetChainID(networkId);
        if (NETWORKS[networkId]) {
          toast.success(
            `Your network got changed to ${NETWORKS?.[networkId]?.networkName}`,
            { toastId: 'network-change-deduction' }
          );
        } else {
          setShowNetworkChanged(true);
        }
      });
    }

    return () => {
      setNetworkChangeDetected(false);
    };
  }, []);

  /** Here if unsupport network is found, logout automatically */
  let localChainId = ls_GetChainID();
  useEffect(() => {
    if (!networkChangeDetected && networkId && localChainId) {
      if (Number(networkId) !== Number(localChainId)) {
        dispatch(logout());
        router.push('/');
        window?.location.reload();
      }
    }
  }, [networkId, localChainId]);

  /** Detect account whenever user come back to site */
  let localAccountAddress = ls_GetWalletAddress();

  useEffect(() => {
    const handleAccountDifference = async () => {
      if (window?.ethereum) {
        const account = await getWalletAccount();

        if (localAccountAddress && account) {
          if (localAccountAddress !== account) {
            setShowAccountChanged(true);
          }
        }
      }
    };
    handleAccountDifference();
  }, []);

  /** Metamask account change detection. It will show logout popup if user signin with new address
   * In case if user re-login, if same account with wallet address, nothing will happen
   * In case accounts == null, mean metamask logged out, no smartcontract interaction can be called
   */
  useEffect(() => {
    window?.ethereum?.on('accountsChanged', function (accounts) {
      if (
        accounts != null &&
        accounts.length > 0 &&
        accounts[0] != ls_GetWalletAddress()
      ) {
        setShowAccountChanged(true);
      }
    });
  }, []);

  useEffect(() => {
    if (showSearchMobile) {
      inputRef?.current.focus();
    }
  }, [showSearchMobile]);

  // useEffect(() => {
  //   getNotificationList();
  // }, [projectDeploy]);

  // function getNotificationList() {
  //   setIsNotificationLoading(true);
  //   getUserNotifications()
  //     .then((res) => {
  //       if (res && res.notifications) {
  //         setNotificationList(res.notifications);
  //         if (res.notifications.length > 0) {
  //           const unreadNotifications = res.notifications.filter(
  //             (n) => n.unread === true
  //           );
  //           setnotificationCount(unreadNotifications.length);
  //         }
  //       }
  //       setIsNotificationLoading(false);
  //     })
  //     .catch(() => {
  //       setIsNotificationLoading(false);
  //     });
  // }

  function showHideUserPopup() {
    const userDropDown = document.getElementById('userDropDown');
    userDropDown.classList.toggle('hidden');
    setShowUserpopup(!showUserpopup);
  }

  function showHideUserPopupWallet() {
    const userDropDown = document.getElementById('userDropDownWallet');
    userDropDown.classList.toggle('hidden');
    setShowWalletpopup(!showWalletpopup);
  }

  // function showHideNotification() {
  //   const userDropDown = document.getElementById('notificationDropdown');
  //   userDropDown.classList.toggle('hidden');
  //   if (!isNotificationLoading) {
  //     getNotificationList();
  //   }
  // }

  function hideModal() {
    setShowModal(false);
  }

  //--------------------------------- web socket implementation
  let host = 'wss:';
  const socketUrl = `${host}//${config.WEB_SOKET}/ws`;

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      const cUser = ls_GetUserToken();
      if (cUser) {
        sendMessage(JSON.stringify({ Token: cUser }));
      }
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  /** After user logged in, we also get notified that userId(auth) has been updated, then we send websocket message to auth websocket */
  useEffect(() => {
    if (userId && userId.length > 0) {
      const cUser = ls_GetUserToken();
      if (cUser) {
        sendMessage(JSON.stringify({ Token: cUser }));
      }
    } else {
      // console.log("no user");
    }
  }, [userId]);

  /** Send other websocket event to whole system */
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        // console.log(lastMessage);
        if (lastMessage.data) {
          const data = JSON.parse(lastMessage.data);
          if (data.type === 'functionNotification') {
            const notificationData = {
              function_uuid: data.fn_uuid,
              data: lastMessage.data,
            };
            dispatch(getNotificationData(notificationData));
          } else if (data.type === 'fileUploadNotification') {
            const notificationData = {
              function_uuid: data.Data.job_id,
              data: lastMessage.data,
            };
            dispatch(getNotificationData(notificationData));
          } else if (data.type === 'fileUploadTokengatedNotification') {
            const notificationData = {
              function_uuid: data.Data.asset_uid,
              data: lastMessage.data,
            };
            dispatch(getNotificationData(notificationData));
          }
        }
      } catch (err) {
        console.log(err);
      }
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  // End web socket Implementation

  function handleOnTextChange(event) {
    try {
      event.preventDefault();
      event.stopPropagation();
      const value = event.currentTarget.value;
      if (value.length > 2 && value !== keyword) {
        setTimeout(() => {
          setKeyword(value);
          if (!isSearching) {
            searchProject(value);
          }
        }, 2000);
      }
    } catch (err) {}
  }

  function searchProject(keyword) {
    const payload = {
      order_by: 'newer',
      page: 1,
      limit: 20,
      criteria: 'name',
      keyword: keyword,
    };
    setIsSearching(true);
    setShowSearchResult(true);
    getProjectListBySearch(payload)
      .then((response) => {
        if (response['code'] === 0) {
          setProjectList(response.data);
        }
        setIsSearching(false);
      })
      .catch((err) => {
        setShowSearchResult(false);
        setIsSearching(false);
      });
  }

  function handleSearchClose() {
    setShowSearchResult(false);
  }

  function handleNotifictionClose() {
    showHideNotification();
    setShowNotificationPopup(false);
  }

  function handleOnSearchFocus(event) {
    if (keyword && keyword.length > 2) {
      setTimeout(() => {
        if (!isSearching) {
          searchProject(keyword);
        }
      }, 1000);
    }
  }

  const handleShowMobileSearch = () => {
    setShowSearchMobile(!showSearchMobile);
  };

  const handleWelcomeModal = () => {
    setShowWelcome(false);
    ls_SetNewUser(true);
  };

  return (
    <header className='bg-[#e2ecf0]'>
      <AccountChangedModal
        show={showAccountChanged}
        handleClose={() => setShowAccountChanged(false)}
      />
      <NetworkChangedModal
        show={showNetworkChanged}
        handleClose={() => setShowNetworkChanged(false)}
        networkId={networkId}
      />
      {showWelcome && (
        <WelcomeModal show={showWelcome} handleClose={handleWelcomeModal} />
      )}
      <div id='notificationDropdown' className='hidden'>
        {showNotificationPopup && (
          <NotificatioMenu
            handleNotifictionClose={handleNotifictionClose}
            notificationList={notificationList}
            isNotificationLoading={isNotificationLoading}
          />
        )}
      </div>

      {/* wallet popup */}
      <div id='userDropDownWallet' className='hidden'>
        {userLoadingStatus === 'idle' && showWalletpopup ? (
          <WalletDropDownMenu
            handleWalletDropDownClose={showHideUserPopupWallet}
            networkId={networkId}
          />
        ) : (
          <></>
        )}
      </div>
      <nav className='pl-5 pr-7 hidden md:block lg:pl-10 lg:pr-12'>
        <div className='flex justify-between items-center min-h-[71px]'>
          <div className='flex items-center'>
            {/* <div
              className='cp mr-5 lg:ml-1 lg:mr-20'
              onClick={() => router.push('/')}
            >
              <Image src={Logo} alt='DeCir' />
            </div> */}
            <h1 className='!text-[24px] !font-black text-[#000]'>Dashboard</h1>

            {/* <form className="mr-6 flex-1 hidden md:block">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
              >
                Search
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <i className="fa-regular fa-magnifying-glass text-[#199BD8]"></i>
                </div>
                <input
                  type="search"
                  id="default-search"
                  name="projectSearch2"
                  autoComplete="off"
                  className="text-lg w-full max-w-[556px] rounded-xl pl-10 h-10 placeholder-color-ass-4  focus:pl-10"
                  placeholder="Search your project by name"
                  onChange={handleOnTextChange}
                  onFocus={handleOnSearchFocus}
                />
              </div>
              {(isSearching || (projectList && projectList.length) > 0) &&
                showSearchResult && (
                  <SearchBarResult
                    isLoading={isSearching}
                    projectList={projectList}
                    handleSearchClose={handleSearchClose}
                  />
                )}
            </form> */}
          </div>
          <div className='relative'>
            <Image
              src={Search}
              alt='Search'
              className='absolute top-2 left-3'
            />
            <input
              className='bg-[#fff] w-[400px] pl-[40px] pr-[12px] py-[8px] rounded-[8px] text-[14px]'
              placeholder='How to create DAO community 🔥 '
            />
          </div>

          <div className='flex items-center' id='mobile-menu'>
            <ul
              className={`flex flex-wrap items-center justify-center md:flex-row space-x-4 md:space-x-8 md:text-sm md:font-medium ${
                userId ? '' : 'sm:py-2'
              }`}
            >
              {userinfo?.id && (
                <>
                  <li>
                    {/* <a
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowNotificationPopup(!showNotificationPopup);
                        showHideNotification();
                      }}
                    >
                      <svg
                        width='19'
                        height='21'
                        viewBox='0 0 19 21'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M11 1.75V2.45312C13.8125 2.92188 16 5.38281 16 8.3125V9.64062C16 11.3984 16.5859 13.1172 17.6797 14.5234L18.2656 15.2266C18.5 15.5391 18.5391 15.9297 18.3828 16.2422C18.2266 16.5547 17.9141 16.75 17.5625 16.75H1.9375C1.54688 16.75 1.23438 16.5547 1.07812 16.2422C0.921875 15.9297 0.960938 15.5391 1.19531 15.2266L1.78125 14.5234C2.875 13.1172 3.5 11.3984 3.5 9.64062V8.3125C3.5 5.38281 5.64844 2.92188 8.5 2.45312V1.75C8.5 1.08594 9.04688 0.5 9.75 0.5C10.4141 0.5 11 1.08594 11 1.75ZM9.4375 4.25C7.17188 4.25 5.375 6.08594 5.375 8.3125V9.64062C5.375 11.5156 4.82812 13.3125 3.8125 14.875H15.6484C14.6328 13.3125 14.125 11.5156 14.125 9.64062V8.3125C14.125 6.08594 12.2891 4.25 10.0625 4.25H9.4375ZM12.25 18C12.25 18.6641 11.9766 19.3281 11.5078 19.7969C11.0391 20.2656 10.375 20.5 9.75 20.5C9.08594 20.5 8.42188 20.2656 7.95312 19.7969C7.48438 19.3281 7.25 18.6641 7.25 18H12.25Z'
                          fill='#7D849D'
                        />
                      </svg>

                      {notificationCount > 0 && (
                        <span className='absolute top-2.5 ml-1.5 px-1.5 py-1 cursor-pointer inline-flex items-center justify-center text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full z-2'>
                          {notificationCount}
                        </span>
                      )}
                    </a> */}
                    {/* wallet popup */}
                  </li>

                  <li className='relative'>
                    <div
                      className='cp'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showHideUserPopupWallet();
                      }}
                    >
                      {walletAddress && walletAddress.length > 5 && (
                        <div
                          className={`flex place-items-center gradient-border-new`}
                        >
                          <Image
                            className='rounded-full border w-[24px] h-[24px] border-gray-100 shadow-sm mr-2'
                            src={
                              userinfo['avatar']
                                ? userinfo['avatar']
                                : AvatarDefault
                            }
                            height={42}
                            width={42}
                            alt='user icon'
                          />

                          <div className='mx-2 font-semibold text-[14px] text-black'>
                            {walletAddressTruncate(walletAddress)}
                          </div>
                          <i className='fa-solid fa-angle-down'></i>
                        </div>
                      )}
                    </div>
                  </li>
                </>
              )}

              <li className='md:ml-2'>
                {userinfo?.id ? (
                  <div className='flex space-x-2 items-center'>
                    {/* <div className='relative w-16 h-12 pt-2 cursor-pointer'> */}
                    {/* <div
                        className='flex place-items-center'
                        onClick={() => router.push(`/profile/settings`)}
                      >
                        <Image
                          className='rounded-full border w-[35px] h-[35px] border-gray-100 shadow-sm mr-2'
                          src={
                            userinfo['avatar'] ? userinfo['avatar'] : userImg
                          }
                          height={42}
                          width={42}
                          alt='user icon'
                        /> */}
                    {/* <i className="fa-solid fa-angle-down text-textSubtle"></i> */}
                    {/* </div> */}
                    {/* Dropdown menu */}
                    {/* <div id='userDropDown' className='hidden'>
                        {showUserpopup && (
                          <UserDropDownMenu
                            handleUserDropdownClose={showHideUserPopup}
                          />
                        )}
                      </div>
                    </div> */}
                    <div id='google_translate_element'></div>
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <button
                      onClick={() => setShowModal(true)}
                      className={`flex place-items-center ${styles.walletInfo} !w-auto contained-button-new`}
                    >
                      {/* <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M14 0C14.5312 0 15 0.46875 15 1C15 1.5625 14.5312 2 14 2H2.5C2.21875 2 2 2.25 2 2.5C2 2.78125 2.21875 3 2.5 3H14C15.0938 3 16 3.90625 16 5V12C16 13.125 15.0938 14 14 14H2C0.875 14 0 13.125 0 12V2C0 0.90625 0.875 0 2 0H14ZM13 9.5C13.5312 9.5 14 9.0625 14 8.5C14 7.96875 13.5312 7.5 13 7.5C12.4375 7.5 12 7.96875 12 8.5C12 9.0625 12.4375 9.5 13 9.5Z'
                          fill='#46A6FF'
                        />
                      </svg> */}
                      <span className='font-bold ml-2'>Connect Wallet</span>
                    </button>
                    <div id='google_translate_element' className='ml-3'></div>
                    {/* <Image
                      src={Globe}
                      alt='Language'
                      className='ml-4 cursor-pointer'
                      onClick={() => setShowLang(!show)}
                    /> */}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* {pathname === "/" && (
          <div className="md:hidden">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only"
            >
              Search
            </label>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none h-10">
                <i className="fa-regular fa-magnifying-glass text-primary-900"></i>
              </div>
              <input
                type="text"
                id="default-search-2"
                name="projectSearch1"
                autoComplete="off"
                className="text-lg w-full w-100 text-white rounded-xl !pl-8 h-10 placeholder-color-ass-4"
                placeholder="Search your project by name"
                onChange={handleOnTextChange}
                onFocus={handleOnSearchFocus}
              />
              {(isSearching || (projectList && projectList.length)) &&
                showSearchResult && (
                  <SearchBarResult
                    isLoading={isSearching}
                    projectList={projectList}
                    handleSearchClose={handleSearchClose}
                  />
                )}
            </div>
          </div>
        )} */}
      </nav>
      <nav className='block md:hidden'>
        <div className='h-[56px] p-4 flex items-center justify-between'>
          <Image src={barImage} alt='Menu' onClick={handleSidebar} />

          <div onClick={() => router.push('/')} className='w-[120px] mt-1 ml-5'>
            <Image src={Logo} alt='DeCir' className='w-full' />
          </div>

          <div className='flex items-center justify-between z-[100]'>
            {/* {showSearchMobile ? (
              <i
                className="fa fa-xmark cursor-pointer text-xl text-black mr-4"
                onClick={handleShowMobileSearch}
              ></i>
            ) : (
              <Image
                src={searchImage}
                alt="Search"
                className="mr-3"
                onClick={handleShowMobileSearch}
              />
            )} */}
            {/* {userinfo?.id ? (
              <Image
                src={bellImage}
                alt='Notifications'
                className='mr-3'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNotificationPopup(!showNotificationPopup);
                  showHideNotification();
                }}
              />
            ) : null} */}
            <Image
              src={walletImage}
              alt='Wallet'
              onClick={
                userinfo?.id
                  ? (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      showHideUserPopupWallet();
                    }
                  : () => setShowModal(true)
              }
            />
            {/* {userinfo?.id && (
              <div
                className='flex ml-4 place-items-center'
                onClick={() => router.push(`/profile/settings`)}
              >
                <Image
                  className='rounded-full border w-[25px] h-[25px] border-gray-100 shadow-sm mr-2 object-cover'
                  src={userinfo['avatar'] ? userinfo['avatar'] : userImg}
                  height={25}
                  width={25}
                  alt='user icon'
                />
              </div>
            )} */}
          </div>
          <div>
            {' '}
            <div id='google_translate_element'></div>
          </div>
        </div>

        {/* <form
          className={`${
            showSearchMobile
              ? "translate-y-0 opacity-1"
              : "-translate-y-[6pc] opacity-0"
          } ml-2 duration-500 ease-in-out mr-2`}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
          >
            Search
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <i className="fa-regular fa-magnifying-glass text-[#199BD8]"></i>
            </div>
            <input
              type="search"
              id="default-search"
              name="projectSearch2"
              autoComplete="off"
              className="text-lg w-full max-w-[556px] rounded-xl pl-10 h-10 placeholder-color-ass-4  focus:pl-10"
              placeholder="Search your project by name"
              onChange={handleOnTextChange}
              onFocus={handleOnSearchFocus}
              ref={inputRef}
            />
          </div>
          {(isSearching || (projectList && projectList.length) > 0) &&
            showSearchResult && (
              <SearchBarResult
                isLoading={isSearching}
                projectList={projectList}
                handleSearchClose={handleSearchClose}
              />
            )}
        </form> */}
      </nav>
      <WalletConnectModal showModal={showModal} closeModal={hideModal} />
    </header>
  );
};
export default Header;
