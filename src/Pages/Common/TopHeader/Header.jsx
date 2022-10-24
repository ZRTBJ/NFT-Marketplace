/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import WalletDropDownMenu from "./WalletDropDownMenu";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSideBar } from "Slice/userSlice";
import { useAuthState } from "Context";
import WalletConnectModal from "Pages/User/Login/WalletConnectModal";
import useWebSocket from "react-use-websocket";
import config from "config/config";
import { getProjectListBySearch } from "services/project/projectService";
import SearchBarResult from "./SearchBarResult";
import { getNotificationData } from "Slice/notificationSlice";
import NotificatioMenu from "./NotificationMenu";
import { getUserNotifications } from "services/notification/notificationService";
import UserDropDownMenu from "./UserDropDownMenu";
import userImg from "assets/images/defaultProfile.svg";
import barImage from "assets/images/bars.svg";
import bellImage from "assets/images/bell.svg";
import walletImage from "assets/images/wallet.svg";
import searchImage from "assets/images/search.svg";
import Logo from "assets/images/header/logo.svg";
import AccountChangedModal from "./Account/AccountChangedModal";
import NetworkChangedModal from "./Account/NetworkChangedModal";
import { walletAddressTruncate } from "util/walletAddressTruncate";

const Header = ({ handleSidebar, showModal, setShowModal }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const context = useAuthState();
  const { pathname } = useLocation();
  const inputRef = useRef(null);

  const [userId, setUserId] = useState(context ? context.user : "");
  const userinfo = useSelector((state) => state.user.userinfo);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const [messageHistory, setMessageHistory] = useState([]);
  const userLoadingStatus = useSelector((state) => state.user.status);
  const [showWalletpopup, setShowWalletpopup] = useState(false);
  const [showUserpopup, setShowUserpopup] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [notificationCount, setnotificationCount] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(
    context ? context.walletAddress : ""
  );
  const [showAccountChanged, setShowAccountChanged] = useState(false);
  const [showNetworkChanged, setShowNetworkChanged] = useState(false);
  const [networkId, setNetworkId] = useState();
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const projectDeploy = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );

  useEffect(() => {
    if (window?.ethereum) {
      if (!networkId) setNetworkId(window.ethereum.networkVersion);
      window?.ethereum?.on("networkChanged", function (networkId) {
        setNetworkId(networkId);
        localStorage.setItem("networkChain", networkId);
        setShowNetworkChanged(true);
        window.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    if (showSearchMobile) {
      inputRef?.current.focus();
    }
  }, [showSearchMobile]);

  useEffect(() => {
    window?.ethereum?.on("accountsChanged", function (accounts) {
      setShowAccountChanged(true);
    });
  }, []);

  useEffect(() => {
    if (userId && userId.length > 0) {
      const cUser = localStorage.getItem("currentUser");
      if (cUser) {
        sendMessage(JSON.stringify({ Token: cUser }));
      }
    } else {
      // console.log("no user");
    }
  }, [userId]);

  useEffect(() => {
    getNotificationList();
  }, [projectDeploy]);

  function getNotificationList() {
    setIsNotificationLoading(true);
    getUserNotifications()
      .then((res) => {
        if (res && res.notifications) {
          setNotificationList(res.notifications);
          if (res.notifications.length > 0) {
            const unreadNotifications = res.notifications.filter(
              (n) => n.unread === true
            );
            setnotificationCount(unreadNotifications.length);
          }
        }
        setIsNotificationLoading(false);
      })
      .catch(() => {
        setIsNotificationLoading(false);
      });
  }

  function showHideUserPopup() {
    const userDropDown = document.getElementById("userDropDown");
    userDropDown.classList.toggle("hidden");
    setShowUserpopup(!showUserpopup);
  }

  function showHideUserPopupWallet() {
    const userDropDown = document.getElementById("userDropDownWallet");
    userDropDown.classList.toggle("hidden");
    setShowWalletpopup(!showWalletpopup);
  }

  function showHideNotification() {
    const userDropDown = document.getElementById("notificationDropdown");
    userDropDown.classList.toggle("hidden");
    if (!isNotificationLoading) {
      getNotificationList();
    }
  }

  // function toogleNotificationList() {
  //   setShowNotificationList((pre) => !pre);
  // }
  function hideModal() {
    setShowModal(false);
  }

  // web socket implementation
  let host = "ws:";
  try {
    const loc = window.location;
    if (loc.protocol === "https:") {
      host = "wss:";
    }
  } catch { }
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
      // console.log("webSocket connected");
      const cUser = localStorage.getItem("currentUser");
      if (cUser) {
        sendMessage(JSON.stringify({ Token: cUser }));
      }
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        // console.log(lastMessage);
        if (lastMessage.data) {
          const data = JSON.parse(lastMessage.data);
          if (data.type === "functionNotification") {
            const notificationData = {
              function_uuid: data.fn_uuid,
              data: lastMessage.data,
            };
            dispatch(getNotificationData(notificationData));
          } else if (data.type === "fileUploadNotification") {
            const notificationData = {
              function_uuid: data.Data.job_id,
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
    } catch (err) { }
  }

  function searchProject(keyword) {
    const payload = {
      order_by: "newer",
      page: 1,
      limit: 20,
      criteria: "name",
      keyword: keyword,
    };
    setIsSearching(true);
    setShowSearchResult(true);
    getProjectListBySearch(payload)
      .then((response) => {
        if (response["code"] === 0) {
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

  return (
    <header className="bg-light1">
      <AccountChangedModal
        show={showAccountChanged}
        handleClose={() => setShowAccountChanged(false)}
      />
      <NetworkChangedModal
        show={showNetworkChanged}
        handleClose={() => setShowNetworkChanged(false)}
        networkId={networkId}
      />
      <div id="notificationDropdown" className="hidden">
        {showNotificationPopup && (
          <NotificatioMenu
            handleNotifictionClose={handleNotifictionClose}
            notificationList={notificationList}
            isNotificationLoading={isNotificationLoading}
          />
        )}
      </div>

      {/* wallet popup */}
      <div id="userDropDownWallet" className="hidden">
        {userLoadingStatus === "idle" && showWalletpopup ? (
          <WalletDropDownMenu
            handleWalletDropDownClose={showHideUserPopupWallet}
            networkId={networkId}
          />
        ) : (
          <></>
        )}
      </div>
      <nav className="pl-5 pr-7 hidden md:block lg:pl-10 lg:pr-12">
        <div className="flex justify-between items-center min-h-[71px]">
          <div className="flex items-center flex-1">
            <div
              className="cp mr-5 lg:ml-1 lg:mr-20"
              onClick={() => history.push("/")}
            >
              {/* <div className="text-primary-900 font-satoshi-bold font-black text-xl lg:text-3xl relative logo">
                CREAB
              </div> */}
              <img src={Logo} alt="DeCir" />
            </div>

            <form className="mr-6 flex-1 hidden md:block">
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
            </form>
          </div>

          <div className="flex items-center" id="mobile-menu">
            {!userinfo.id && (
              <h5 className="text-primary-900 mr-2 hidden md:block">
                What’s DeCir
              </h5>
            )}

            <ul
              className={`flex flex-wrap items-center justify-center md:flex-row space-x-4 md:space-x-8 md:text-sm md:font-medium ${userId ? "" : "sm:py-2"
                }`}
            >
              {userinfo.id && (
                <>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowNotificationPopup(!showNotificationPopup);
                        showHideNotification();
                      }}
                    >
                      <svg
                        width="19"
                        height="21"
                        viewBox="0 0 19 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 1.75V2.45312C13.8125 2.92188 16 5.38281 16 8.3125V9.64062C16 11.3984 16.5859 13.1172 17.6797 14.5234L18.2656 15.2266C18.5 15.5391 18.5391 15.9297 18.3828 16.2422C18.2266 16.5547 17.9141 16.75 17.5625 16.75H1.9375C1.54688 16.75 1.23438 16.5547 1.07812 16.2422C0.921875 15.9297 0.960938 15.5391 1.19531 15.2266L1.78125 14.5234C2.875 13.1172 3.5 11.3984 3.5 9.64062V8.3125C3.5 5.38281 5.64844 2.92188 8.5 2.45312V1.75C8.5 1.08594 9.04688 0.5 9.75 0.5C10.4141 0.5 11 1.08594 11 1.75ZM9.4375 4.25C7.17188 4.25 5.375 6.08594 5.375 8.3125V9.64062C5.375 11.5156 4.82812 13.3125 3.8125 14.875H15.6484C14.6328 13.3125 14.125 11.5156 14.125 9.64062V8.3125C14.125 6.08594 12.2891 4.25 10.0625 4.25H9.4375ZM12.25 18C12.25 18.6641 11.9766 19.3281 11.5078 19.7969C11.0391 20.2656 10.375 20.5 9.75 20.5C9.08594 20.5 8.42188 20.2656 7.95312 19.7969C7.48438 19.3281 7.25 18.6641 7.25 18H12.25Z"
                          fill="#7D849D"
                        />
                      </svg>

                      {notificationCount > 0 && (
                        <span className="absolute top-2.5 ml-1.5 px-1.5 py-1 cursor-pointer inline-flex items-center justify-center text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full z-2">
                          {notificationCount}
                        </span>
                      )}
                    </a>
                    {/* wallet popup */}
                  </li>

                  {/* <li>
                    <Link to="/profile-settings">
                      <svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.6391 10.6053L18.4204 10.5L18.6391 10.3947C19.9514 9.6579 20.3888 8.07895 19.6233 6.81579L18.0923 4.28947C17.7643 3.65789 17.1081 3.23684 16.452 3.02632C15.7959 2.81579 15.0304 2.92105 14.3742 3.23684L14.1555 3.34211V3.13158C14.1555 1.65789 12.9526 0.5 11.4216 0.5H8.46902C6.93803 0.5 5.73512 1.65789 5.73512 3.13158V3.34211H5.62576C4.96962 2.92105 4.31349 2.81579 3.54799 3.02632C2.7825 3.23684 2.23572 3.65789 1.90765 4.28947L0.376671 6.81579C-0.388821 8.07895 0.0486025 9.6579 1.36087 10.3947L1.57959 10.5L1.36087 10.6053C0.0486025 11.3421 -0.388821 12.9211 0.376671 14.1842L1.90765 16.7105C2.23572 17.3421 2.89186 17.7632 3.54799 17.9737C4.31349 18.1842 4.96962 18.0789 5.62576 17.6579H5.73512V17.8684C5.73512 19.3421 6.93803 20.5 8.46902 20.5H11.4216C12.9526 20.5 14.1555 19.3421 14.1555 17.8684V17.6579L14.3742 17.7632C15.0304 18.0789 15.7959 18.1842 16.452 17.9737C17.2175 17.7632 17.7643 17.3421 18.0923 16.7105L19.6233 14.1842C20.3888 12.9211 19.9514 11.3421 18.6391 10.6053ZM10 14.5C7.70352 14.5 5.84447 12.7105 5.84447 10.5C5.84447 8.28947 7.70352 6.5 10 6.5C12.2965 6.5 14.1555 8.28947 14.1555 10.5C14.1555 12.7105 12.2965 14.5 10 14.5Z"
                          fill="#7D849D"
                        />
                      </svg>
                    </Link>
                  </li> */}

                  <li className="relative">
                    <div
                      className="cp"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showHideUserPopupWallet();
                      }}
                    >
                      {selectedWallet && selectedWallet.length > 5 && (
                        <div className="flex place-items-center wallet-info">
                          <i className="fa-solid fa-wallet gradient-text"></i>

                          <div className="mx-2 font-semibold text-base gradient-text">
                            {/* {selectedWallet.substring(0, 6)}... */}
                            {selectedWallet
                              ? walletAddressTruncate(selectedWallet)
                              : null}
                          </div>
                          <i className="fa-solid fa-angle-down"></i>
                        </div>
                      )}
                    </div>
                  </li>
                </>
              )}

              <li className="md:ml-2">
                {userinfo.id ? (
                  <div className="flex space-x-2">
                    <div className="relative w-16 h-12 pt-2 cursor-pointer">
                      <div
                        className="flex place-items-center"
                        onClick={() => history.push(`/profile-settings`)}
                      >
                        <img
                          className="rounded-full border w-[35px] h-[35px] border-gray-100 shadow-sm mr-2"
                          src={
                            userinfo["avatar"] ? userinfo["avatar"] : userImg
                          }
                          height={42}
                          width={42}
                          alt="user icon"
                        />
                        {/* <i className="fa-solid fa-angle-down text-textSubtle"></i> */}
                      </div>
                      {/* Dropdown menu */}
                      <div id="userDropDown" className="hidden">
                        {showUserpopup && (
                          <UserDropDownMenu
                            handleUserDropdownClose={showHideUserPopup}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex place-items-center wallet-info !w-auto"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 0C14.5312 0 15 0.46875 15 1C15 1.5625 14.5312 2 14 2H2.5C2.21875 2 2 2.25 2 2.5C2 2.78125 2.21875 3 2.5 3H14C15.0938 3 16 3.90625 16 5V12C16 13.125 15.0938 14 14 14H2C0.875 14 0 13.125 0 12V2C0 0.90625 0.875 0 2 0H14ZM13 9.5C13.5312 9.5 14 9.0625 14 8.5C14 7.96875 13.5312 7.5 13 7.5C12.4375 7.5 12 7.96875 12 8.5C12 9.0625 12.4375 9.5 13 9.5Z"
                        fill="#46A6FF"
                      />
                    </svg>
                    <span className="font-bold ml-2">Connect Wallet</span>
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>

        {pathname === "/" && (
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
        )}
      </nav>
      <nav className="block md:hidden">
        <div className="h-[56px] p-4 flex items-center justify-between">
          <img src={barImage} alt="Menu" onClick={handleSidebar} />

          <div
            onClick={() => history.push("/")}
            className="w-[120px] mt-1 ml-5"
          >
            <img src={Logo} alt="DeCir" className="w-full" />
          </div>

          <div className="flex items-center justify-between z-[100]">
            {showSearchMobile ? (
              <i
                className="fa fa-xmark cursor-pointer text-xl text-black mr-4"
                onClick={handleShowMobileSearch}
              ></i>
            ) : (
              <img
                src={searchImage}
                alt="Search"
                className="mr-3"
                onClick={handleShowMobileSearch}
              />
            )}
            {userinfo.id ? (
              <img
                src={bellImage}
                alt="Notifications"
                className="mr-3"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNotificationPopup(!showNotificationPopup);
                  showHideNotification();
                }}
              />
            ) : null}
            <img
              src={walletImage}
              alt="Wallet"
              onClick={
                userinfo.id
                  ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showHideUserPopupWallet();
                  }
                  : () => setShowModal(true)
              }
            />
          </div>
        </div>
        <form
          className={`${showSearchMobile
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
        </form>
      </nav>
      <WalletConnectModal showModal={showModal} closeModal={hideModal} />
    </header>
  );
};
export default Header;
