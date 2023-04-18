/* eslint-disable react-hooks/exhaustive-deps */
import styles from './index.module.css';
import { useState, useEffect, useRef, useMemo } from 'react';
import WalletDropDownMenu from './WalletDropdownMenu';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import useWebSocket from 'react-use-websocket';
import config from 'config/config';
import { getProjectListBySearch } from 'services/project/projectService';
import { getNotificationData } from 'redux/notification';
import NotificatioMenu from './NotificationMenu';
import { searchContent } from 'services/User/userService';
import barImage from 'assets/images/bars.svg';
import walletImage from 'assets/images/wallet.svg';
import Logo from 'assets/images/header/logo.svg';
import NetworkChangedModal from './Account/NetworkChangedModal';
import { walletAddressTruncate } from 'util/WalletUtils';
import ReactPaginate from 'react-paginate';
import {
  ls_GetUserToken,
  ls_GetWalletAddress,
  ls_SetChainID,
  ls_GetChainID,
  ls_GetWalletType,
} from 'util/ApplicationStorage';
import { setChain } from 'redux/user';
import { toast } from 'react-toastify';
import { NETWORKS } from 'config/networks';
import { logout } from 'redux/auth';
import Image from 'next/image';
import Search from 'assets/images/header/search.svg';
import AvatarDefault from 'assets/images/avatar-default.svg';
import {
  isWalletConnected,
  getWalletAccount,
  handleSwitchNetwork,
  getCurrentNetworkId,
} from 'util/MetaMask';
import useComponentVisible from 'hooks/useComponentVisible';
import ReactTooltip from 'react-tooltip';
import { getUserData } from 'services/User/userService';
import SignRejectionModal from './Account/SignRejectModal';
import { useNetwork, useSwitchNetwork } from 'wagmi';

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
  const outsideRef = useRef(null);
  const { user, walletAddress, token, wallet } = useSelector(
    (state) => state.auth
  );
  const timer = useRef(null);
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
  const [showNetworkChanged, setShowNetworkChanged] = useState(false);
  const [networkChangeDetected, setNetworkChangeDetected] = useState(false);
  const [networkId, setNetworkId] = useState();
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const projectDeploy = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchItems, setSearchItems] = useState([]);
  const [searching, setSearching] = useState(false);
  const [pagination, setPagination] = useState([1]);
  const [page, setPage] = useState(1);
  const [currentSelectedNetwork, setCurrentSelectedNetwork] = useState();
  const [showSignReject, setShowSignReject] = useState('');
  const { ref, setIsComponentVisible, isComponentVisible } =
    useComponentVisible();
  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  let walletType = ls_GetWalletType();

  /** Detect account whenever user come back to site */
  let localAccountAddress = ls_GetWalletAddress();

  const handleAccountDifference = async () => {
    if (window?.ethereum) {
      const account = await getWalletAccount();
      if (localAccountAddress && account) {
        if (localAccountAddress !== account) {
          if (!showModal) {
            setShowSignReject(account);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (userinfo?.id) {
      if (walletType === 'metamask') {
        handleAccountDifference();
      }
    }
  }, [userinfo?.id]);

  /** Here if unsupport network is found, logout automatically */
  let localChainId = ls_GetChainID();

  const handleChainDifference = async () => {
    if (window?.ethereum) {
      const network = await getCurrentNetworkId();
      let currentNetworkChain = walletType === 'metamask' ? network : chain;
      if (localChainId && currentNetworkChain) {
        if (!networkChangeDetected && localChainId !== currentNetworkChain) {
          setNetworkId(currentNetworkChain);
          ls_SetChainID(currentNetworkChain);
          if (walletType === 'metamask') {
            handleSwitchNetwork(currentNetworkChain);
          } else if (walletType === 'walletconnect') {
            switchNetwork(currentNetworkChain);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (userinfo?.id) {
      if (walletType !== 'magicwallet') {
        handleChainDifference();
      }
    }
  }, [userinfo?.id]);

  useEffect(() => {
    (async () => {
      // console.log('userInfo: ', userinfo?.id);
      if (userinfo?.id) {
        await setDefaultNetwork();
      } else {
        setCurrentSelectedNetwork({
          name: networkList?.[0]?.networkName,
          value: networkList?.[0]?.network,
          icon: networkList?.[0]?.icon,
        });
      }
    })();
  }, [userinfo?.id]);

  let networkList = Object.values(NETWORKS);

  const setDefaultNetwork = async (networkId) => {
    let networkValue = await ls_GetChainID();
    let id = networkId ? networkId : networkValue;
    let currentNetwork = await networkList.find(
      (network) => network.network === Number(id)
    );
    setCurrentSelectedNetwork({
      name: currentNetwork?.networkName,
      value: currentNetwork?.network,
      icon: currentNetwork?.icon,
    });
  };

  useEffect(() => {
    document.addEventListener('click', handleClickedOutside);
    return () => {
      document.removeEventListener('click', handleClickedOutside);
    };
  }, []);

  useEffect(() => {
    handleSearch(null, searchKeyword);
  }, [page]);

  useEffect(() => {
    let arr = Array.from({ length: searchItems?.total / 10 }, (v, k) => k + 1);
    setPagination(arr);
  }, [searchItems]);

  useEffect(() => {
    if (!searchKeyword) {
      setPage(1);
      setPagination([1]);
    } else {
      setPage(1);
    }
  }, [searchKeyword]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  const handleClickedOutside = () => {
    if (searchKeyword && outsideRef && outsideRef.current) {
      setSearchKeyword('');
    }
  };

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
    if (walletType === 'metamask') {
      setNetworkChangeDetected(false);
      if (window?.ethereum) {
        if (!networkId) setNetworkId(window.ethereum.networkVersion);
        window?.ethereum?.on('networkChanged', function (networkId) {
          setNetworkChangeDetected(true);
          setNetworkId(networkId);
          ls_SetChainID(networkId);
          setDefaultNetwork(networkId);
          if (userinfo?.id) {
            if (NETWORKS[networkId]) {
              toast.success(
                `Your network got changed to ${NETWORKS?.[networkId]?.networkName}`,
                { toastId: 'network-change-deduction' }
              );
            } else {
              toast.error(
                `Your network got changed to an unsupported network`,
                {
                  toastId: 'network-change-deduction-error',
                }
              );
            }
          }
        });
      }
    }

    return () => {
      setNetworkChangeDetected(false);
    };
  }, []);

  /** Metamask account change detection. It will show logout popup if user signin with new address
   * In case if user re-login, if same account with wallet address, nothing will happen
   * In case accounts == null, mean metamask logged out, no smartcontract interaction can be called
   */
  useEffect(() => {
    if (walletType === 'metamask') {
      window?.ethereum?.on('accountsChanged', function (accounts) {
        if (
          accounts != null &&
          accounts.length > 0 &&
          accounts[0] != ls_GetWalletAddress()
        ) {
          existingAccountChange(null, accounts[0]);
        }
      });
    }
  }, []);

  const existingAccountChange = async (data, address) => {
    let addressData = address ? address : showSignReject;
    const userDetails = await getUserData(addressData);
    if (userDetails?.data) {
      const isConnected = await isWalletConnected();
      const account = await getWalletAccount();
      setShowSignReject('');
      if (typeof window !== 'undefined') {
        if (window.ethereum) {
          if (isConnected && account && account.length > 5) {
            setShowSignReject(addressData);
          }
        }
      }
    } else {
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (showSearchMobile) {
      inputRef?.current.focus();
    }
  }, [showSearchMobile]);

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

  const handleSearch = (e, text) => {
    setSearching(true);
    let value = e?.target?.value ? e.target.value : text;
    setSearchKeyword(value);
    if (e?.target?.value || text) {
      let payload = {
        page: page,
        keyword: value,
      };
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(
        () =>
          searchContent(payload).then((resp) => {
            if (resp.code === 0) {
              setSearchItems(resp);
            }
            setSearching(false);
          }),
        2000
      );
    }
  };

  const handleSearchNavigation = (item) => {
    if (item.id) {
      setSearchKeyword('');
      if (item.type === 'collection') {
        router.push(`/collection/${item.id}`);
      } else if (item.type === 'dao') {
        router.push(`/dao/${item.id}`);
      } else {
        router.push(`/token-gated/${item.id}`);
      }
    }
  };

  const pageTitle = useMemo(() => {
    let paths = router?.pathname?.split('/');
    let queries = router?.query;

    let title = queries?.type ? `${queries.type} ${paths[1]}` : paths[1];
    return title;
  }, [router]);

  //TODO: Need to refactor
  const isNewBg = useMemo(() => {
    if (['/dashboard', '/transactions', '/'].includes(router.pathname)) {
      return true;
    } else {
      return false;
    }
  }, [router]);

  const handleNetworkSelection = async (data) => {
    try {
      if (data?.network !== currentSelectedNetwork?.value) {
        if (walletType === 'metamask') {
          await handleSwitchNetwork(data.network);
        } else if (walletType === 'walletconnect') {
          await switchNetwork(data.network);
        }
        setCurrentSelectedNetwork({
          name: data?.networkName,
          value: data?.network,
          icon: data?.icon,
        });
        await dispatch(setChain(data?.network));
        setIsComponentVisible(false);
      } else {
        setIsComponentVisible(false);
      }
    } catch (err) {
      setIsComponentVisible(false);

      return;
    }
  };

  return (
    <header
      className={`${isNewBg ? 'bg-[#e2ecf0]' : 'bg-[#fff]'}`}
      style={{ position: 'relative', zIndex: '30' }}
    >
      {/* <AccountChangedModal
        show={showAccountChanged}
        handleClose={() => setShowAccountChanged(false)}
      /> */}
      <NetworkChangedModal
        show={showNetworkChanged}
        handleClose={() => setShowNetworkChanged(false)}
        networkId={networkId}
      />
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
      {/* for dekstop */}
      <nav className='pl-5 pr-7 hidden md:block lg:pl-10 lg:pr-12'>
        <div className='flex justify-between items-center min-h-[71px] relative'>
          <div className='flex items-center'>
            <h1 className='!text-[24px] !font-black text-[#000] capitalize'>
              {pageTitle}
            </h1>
          </div>
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${styles.searchInput}`}
            ref={outsideRef}
          >
            <Image
              src={Search}
              alt='Search'
              className='absolute top-2 left-3'
            />
            <input
              value={searchKeyword}
              onChange={handleSearch}
              className='border-[1px] border-[#e2ecf0] bg-[#fff] w-[400px] pl-[40px] pr-[12px] py-[8px] rounded-[8px] text-[14px]'
              placeholder='How to create DAO community 🔥 '
            />
            {searchKeyword?.length ? (
              <div
                className='absolute bg-[#fff] rounded-[8px] py-3 w-full top-11 z-[999]'
                style={{ boxShadow: 'rgb(2 17 24 / 8%) 0px 16px 32px' }}
              >
                {searching ? <p className='text-center'>Loading...</p> : null}
                {!searching && searchItems?.data?.length ? (
                  searchItems?.data?.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSearchNavigation(item)}
                      className='flex items-center mb-1 hover:bg-[#ccc] cursor-pointer px-3 py-1'
                    >
                      <p
                        style={{
                          width: 240,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.name}
                      </p>
                      <p className='mt-0 text-[12px] bg-[#12b4ff] text-[#fff] rounded-[8px] px-1 ml-1'>
                        {item?.type === 'token_gate_projects'
                          ? 'Token Gate Project'
                          : item?.type === 'dao'
                          ? 'DAO'
                          : 'Collection'}
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    {!searching ? (
                      <p className='text-center'>No data found</p>
                    ) : (
                      ''
                    )}
                  </>
                )}
                {!searching &&
                  searchItems?.data?.length &&
                  pagination.length > 0 && (
                    <ReactPaginate
                      className='flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6'
                      pageClassName='px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack '
                      breakLabel='...'
                      nextLabel='>'
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={2}
                      pageCount={pagination.length}
                      previousLabel='<'
                      renderOnZeroPageCount={null}
                      activeClassName='text-primary-900 bg-primary-900 !no-underline'
                      activeLinkClassName='!text-txtblack !no-underline'
                    />
                  )}
              </div>
            ) : null}
          </div>
          <div className='flex items-center' id='mobile-menu'>
            <ul
              className={`flex flex-wrap items-center justify-center md:flex-row space-x-4 md:space-x-8 md:text-sm md:font-medium ${
                userId ? '' : 'sm:py-2'
              } ${styles.walletContainer}`}
            >
              <li className='relative w-[185px]' ref={ref}>
                {!currentSelectedNetwork?.name ? (
                  <ReactTooltip type='info' effect='solid' />
                ) : null}
                <div
                  data-tip={
                    currentSelectedNetwork?.name
                      ? ''
                      : 'You have selected/connected with an unsupported network. Please select a supported network from the dropdown'
                  }
                  onClick={
                    walletType === 'magicwallet'
                      ? null
                      : () => setIsComponentVisible(!isComponentVisible)
                  }
                  className={`cursor-pointer flex place-items-center rounded-2xl px-3 py-2 border-primary-900 ${
                    currentSelectedNetwork?.name
                      ? 'bg-primary-100'
                      : 'bg-red-100'
                  } `}
                  style={
                    walletType === 'magicwallet'
                      ? {
                          filter: 'grayscale(1)',
                        }
                      : null
                  }
                >
                  {currentSelectedNetwork?.icon?.src ? (
                    <Image
                      className='rounded-full border-gray-100 shadow-sm mr-2'
                      src={currentSelectedNetwork.icon.src}
                      height={18}
                      width={18}
                      alt='user icon'
                    />
                  ) : (
                    <i className='fa-solid fa-triangle-exclamation mr-2 text-red-400'></i>
                  )}{' '}
                  <span
                    className={`mr-2 font-semibold ${
                      !currentSelectedNetwork?.name ? 'text-red-400' : ''
                    }`}
                  >
                    {currentSelectedNetwork?.name
                      ? currentSelectedNetwork.name
                      : 'Unsupported'}
                  </span>
                  <i
                    className={`fa-solid fa-angle-down ml-auto ${
                      !currentSelectedNetwork?.name ? 'text-red-400' : ''
                    }`}
                  ></i>
                </div>
                {isComponentVisible ? (
                  <div className='absolute z-[1000] w-full overflow-hidden rounded-lg shadow-lg'>
                    {networkList.map((list) => (
                      <div
                        key={list?.network}
                        onClick={() => handleNetworkSelection(list)}
                        className='cursor-pointer flex place-items-center px-3 py-2 bg-primary-100 border-primary-900 hover:bg-primary-400'
                      >
                        <Image
                          className='rounded-full border-gray-100 shadow-sm mr-2'
                          src={list?.icon?.src}
                          height={18}
                          width={18}
                          alt='user icon'
                        />{' '}
                        <span className='mr-2 font-semibold'>
                          {list?.networkName}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
              <li className='relative'>
                {userinfo?.id ? (
                  <>
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
                  </>
                ) : (
                  <div className='flex items-center'>
                    <button
                      onClick={() => setShowModal(true)}
                      className={`flex place-items-center ${styles.walletInfo} !w-auto contained-button-new rounded-tr-none rounded-br-none`}
                    >
                      <span className='font-bold ml-2'>Connect Wallet</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showHideUserPopupWallet();
                      }}
                      className={`flex place-items-center bg-white px-2 py-3 rounded-[0.5rem] border border-secondary-900 w-auto  rounded-tl-none rounded-bl-none`}
                    >
                      <i className='fa-solid fa-angle-down'></i>
                    </button>
                    {/* <div className='ml-3' id='google_translate_element'></div> */}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* for mobile */}
      <nav className='block md:hidden'>
        <div className='h-[56px] p-4 flex items-center justify-between'>
          <Image src={barImage} alt='Menu' onClick={handleSidebar} />

          <div onClick={() => router.push('/')} className='w-[120px] mt-1 ml-5'>
            <Image src={Logo} alt='DeCir' className='w-full' />
          </div>

          <div className='flex items-center justify-between z-[100]'>
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
          </div>
          <div>
            {' '}
            <div id='google_translate_element'></div>
          </div>
        </div>
      </nav>
      {showModal && (
        <WalletConnectModal showModal={showModal} closeModal={hideModal} />
      )}
      {showSignReject && (
        <SignRejectionModal
          show={showSignReject}
          closeModal={() => setShowSignReject(false)}
          handleTryAgain={existingAccountChange}
        />
      )}
    </header>
  );
};
export default Header;
