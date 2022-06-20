/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Modal from "../Modal";
import Sidebar from "../Sidebar/Sidebar";
import logo from "assets/images/header/logo.svg";
import metamaskIcon from "assets/images/modal/metamask.png";
import torusIcon from "assets/images/modal/torus.png";
import notificationIcon from "assets/images/header/ico_notification@2x.png";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { loginUser, useAuthState, useAuthDispatch, logout } from "Context";

import {
  getPersonalSign,
  isWalletConnected,
  getWalletAccount,
} from "../../util/metaMaskWallet";
import { torusInit, torusWalletLogin, torusLogout } from "../../util/Torus";
import UserDropDownMenu from "./UserDropDownMenu";
import NotificationMenu from "./NotificationMenu";
import { getUserInfo } from "../../services/User/userService";
import { useHistory } from "react-router-dom";
import { setUserInfo } from "../../Slice/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import config from "config";
import { getProjectDeploy } from "Slice/projectSlice";
import useWebSocket from "react-use-websocket";

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(true);
  const [showSideBar, setShowSideBar] = useState(false);
  const [metamaskAccount, setMetamaskAccount] = useState("");
  const [torusAccountInfo, setTorusAccountInfo] = useState(null);
  const authDispatch = useAuthDispatch();
  const context = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(context ? context.user : "");
  const userinfo = useSelector((state) => state.user.userinfo);
  const [metamaskConnectAttempt, setMetamaskConnectAttempt] = useState(0);
  const [messageHistory, setMessageHistory] = useState([]);
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] =
    useState(false);
  const [modalKey, setModalKey] = useState(1);
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
      console.log("webSocket connected");
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
        console.log(lastMessage);
        if (lastMessage.data) {
          const data = JSON.parse(lastMessage.data);
          if (data.type === "functionNotification") {
            const deployData = {
              function_uuid: data.fn_uuid,
              data: lastMessage.data,
            };
            dispatch(getProjectDeploy(deployData));
          }
        }
      } catch (err) {
        console.log(err);
      }
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  useEffect(() => {
    if (userId && userId.length > 0) {
      const cUser = localStorage.getItem("currentUser");
      if (cUser) {
        sendMessage(JSON.stringify({ Token: cUser }));
      }
    } else {
      console.log("no user");
    }
  }, [userId]);

  // End web socket Implementation

  useEffect(() => {
    if (userId && !userinfo.display_name) {
      getUserDetails(userId, false);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
  }, []);

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
      if (isConnected && account && account.length > 5) {
        setMetamaskConnectAttempt(0);
        setMetamaskAccount(account);
        getPersonalSign()
          .then((signature) => {
            if (userinfo && !userinfo["display_name"]) {
              userLogin(account, signature, "metamask");
            }
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        if (!isConnected && !account) {
          window.location.reload();
        }
      }
    }
  }
  async function loginTorus() {
    if (isTermsAndConditionsChecked) {
      await torusWalletLogin().then((e) => {
        setTorusAccountInfo(e);
        userLogin(e.address, e.signature, "torus");
      });
    }
  }

  async function userLogin(address, signature, wallet) {
    const request = {
      address,
      signature,
      wallet,
    };
    try {
      setIsLoading(true);
      let response = await loginUser(authDispatch, request);
      localStorage.setItem("walletAddress", address);
      setUserId(response["user_id"]);
      getUserDetails(response["user_id"], true);

      const apiCall = {
        event: "bts:subscribe",
        data: { channel: "order_book_btcusd" },
      };
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  async function getUserDetails(userID, isNavigate) {
    const response = await getUserInfo(userID);
    let userinfoResponse;
    try {
      userinfoResponse = response["user"];
    } catch { }
    dispatch(setUserInfo(userinfoResponse));
    setIsLoading(false);
    if (isNavigate === true) {
      if (
        userinfoResponse &&
        userinfoResponse["display_name"] &&
        userinfoResponse["display_name"].length > 0
      ) {
        history.push(`/profile/${localStorage.getItem("user_id")}`);
      } else {
        history.push("/profile-settings");
      }
    }
    setShowModal(false);
  }

  function showHideUserPopup() {
    const userDropDown = document.getElementById("userDropDown");
    userDropDown.classList.toggle("hidden");
  }

  function showHideUserPopupWallet() {
    const userDropDown = document.getElementById("userDropDownWallet");
    userDropDown.classList.toggle("hidden");
  }

  // function toogleNotificationList() {
  //   setShowNotificationList((pre) => !pre);
  // }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else if (
      metamaskAccount &&
      metamaskAccount.length > 1 &&
      metamaskAccount !== accounts[0]
    ) {
      const currentAccount = accounts[0];
      if (!userId || userId.length < 1) {
        getPersonalSign()
          .then((signature) => {
            userLogin(currentAccount, signature, "metamask");
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    }
  }

  function handelTermsChecked(value) {
    setIsTermsAndConditionsChecked(value);
    setModalKey((pre) => pre + 1);
  }

  return (
    <div>
      <Sidebar show={showSideBar} handleClose={() => setShowSideBar(false)} />
      <nav className="border border-black">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap items-center">
            <button
              onClick={() => setShowSideBar(true)}
              type="button"
              className="inline-flex items-center p-2 ml-3 mr-3 cp text-sm text-gray-800 rounded-lg hover:bg-primary-color focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="side-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="#fff"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="#fff"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="mx-auto cp" onClick={() => history.push("/")}>
              <div className="text-left text-white font-semibold text-2xl mt-1 logo">
                CREABO
              </div>
            </div>

            <form className="search lg:ml-20 ml-5">
              <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" id="default-search" className="search-fld text-lg max-w-full text-white rounded-xl pl-10 h-10" placeholder="Search your project by name" required />
              </div>
            </form>

          </div>

          <div className="w-auto mr-0 sm:mr-4" id="mobile-menu">
            <ul
              className={`flex items-center justify-center md:flex-row md:space-x-8 md:text-sm md:font-medium ${userId ? "" : "sm:py-2"
                }`}
            >
              {/* <li className="text-center text-white font-semibold text-lg">
                What’s Creabo
              </li> */}

              <li>
                <a href="#">
                  <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.9732 13.6633C17.7633 12.1327 17.4484 9.88776 17.1336 8.2551C17.0286 7.54082 16.8187 6.72449 16.5039 6.0102C15.6643 2.7449 12.5158 0.5 9.05244 0.5C5.48414 0.5 2.33564 2.7449 1.49604 5.90816C1.28614 6.72449 1.07624 7.54082 0.866344 8.2551C0.551495 9.88776 0.236645 12.1327 0.0267448 13.6633C-0.183155 15.0918 0.866344 16.4184 2.33564 16.7245C3.38514 16.9286 4.74949 17.0306 6.11384 17.2347V17.6429C6.11384 19.1735 7.37324 20.5 9.05244 20.5C10.6267 20.5 11.991 19.2755 11.991 17.6429V17.2347C13.3554 17.1327 14.6148 16.9286 15.7692 16.7245C17.1336 16.4184 18.1831 15.0918 17.9732 13.6633ZM10.3118 17.6429C10.3118 18.3571 9.68214 18.8673 9.05244 18.8673C8.42274 18.8673 7.68809 18.2551 7.68809 17.6429V17.3367C8.10789 17.3367 8.63264 17.3367 9.05244 17.3367C9.47224 17.3367 9.89204 17.3367 10.3118 17.3367V17.6429Z" fill="white" />
                  </svg>
                </a>
              </li>

              <li>
                <a href="#">
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.6391 10.6053L18.4204 10.5L18.6391 10.3947C19.9514 9.6579 20.3888 8.07895 19.6233 6.81579L18.0923 4.28947C17.7643 3.65789 17.1081 3.23684 16.452 3.02632C15.7959 2.81579 15.0304 2.92105 14.3742 3.23684L14.1555 3.34211V3.13158C14.1555 1.65789 12.9526 0.5 11.4216 0.5H8.46902C6.93803 0.5 5.73512 1.65789 5.73512 3.13158V3.34211H5.62576C4.96962 2.92105 4.31349 2.81579 3.54799 3.02632C2.7825 3.23684 2.23572 3.65789 1.90765 4.28947L0.376671 6.81579C-0.388821 8.07895 0.0486025 9.6579 1.36087 10.3947L1.57959 10.5L1.36087 10.6053C0.0486025 11.3421 -0.388821 12.9211 0.376671 14.1842L1.90765 16.7105C2.23572 17.3421 2.89186 17.7632 3.54799 17.9737C4.31349 18.1842 4.96962 18.0789 5.62576 17.6579H5.73512V17.8684C5.73512 19.3421 6.93803 20.5 8.46902 20.5H11.4216C12.9526 20.5 14.1555 19.3421 14.1555 17.8684V17.6579L14.3742 17.7632C15.0304 18.0789 15.7959 18.1842 16.452 17.9737C17.2175 17.7632 17.7643 17.3421 18.0923 16.7105L19.6233 14.1842C20.3888 12.9211 19.9514 11.3421 18.6391 10.6053ZM10 14.5C7.70352 14.5 5.84447 12.7105 5.84447 10.5C5.84447 8.28947 7.70352 6.5 10 6.5C12.2965 6.5 14.1555 8.28947 14.1555 10.5C14.1555 12.7105 12.2965 14.5 10 14.5Z" fill="white" />
                  </svg>
                </a>
              </li>


              <li className="relative">

                <a href="#" onClick={() => showHideUserPopupWallet()}>
                  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7689 5.8818H20C20 2.48459 17.9644 0.5 14.5156 0.5H5.48444C2.03556 0.5 0 2.48459 0 5.83847V13.1615C0 16.5154 2.03556 18.5 5.48444 18.5H14.5156C17.9644 18.5 20 16.5154 20 13.1615V12.8495H15.7689C13.8052 12.8495 12.2133 11.2975 12.2133 9.383C12.2133 7.46849 13.8052 5.91647 15.7689 5.91647V5.8818ZM15.7689 7.37241H19.2533C19.6657 7.37241 20 7.69834 20 8.10039V10.631C19.9952 11.0311 19.6637 11.3543 19.2533 11.3589H15.8489C14.8548 11.372 13.9855 10.7084 13.76 9.76432C13.6471 9.17829 13.8056 8.57357 14.1931 8.11222C14.5805 7.65087 15.1573 7.38007 15.7689 7.37241ZM15.92 10.033H16.2489C16.6711 10.033 17.0133 9.6993 17.0133 9.28767C17.0133 8.87605 16.6711 8.54237 16.2489 8.54237H15.92C15.7181 8.54005 15.5236 8.61664 15.38 8.75504C15.2364 8.89344 15.1555 9.08213 15.1556 9.27901C15.1555 9.69205 15.4964 10.0282 15.92 10.033ZM4.73778 5.8818H10.3822C10.8044 5.8818 11.1467 5.54812 11.1467 5.13649C11.1467 4.72487 10.8044 4.39119 10.3822 4.39119H4.73778C4.31903 4.39116 3.9782 4.7196 3.97333 5.12783C3.97331 5.54087 4.31415 5.87705 4.73778 5.8818Z" fill="white" />
                  </svg>
                </a>



                {/* wallet popup */}
                <div
                  id="userDropDownWallet"
                  className="hidden"
                >
                  <UserDropDownMenu />
                </div>



              </li>
              <li className="md:!ml-2.5">
                {userId ? (
                  <div className="flex space-x-2">


                    {/* <div className="relative w-10 h-16 pt-4">
                      <span className="cursor-pointer">
                        <img
                          src={notificationIcon}
                          width={24}
                          height={24}
                          alt="Notification icon"
                          onClick={toogleNotificationList}
                        />
                      </span>
                      <span
                        onClick={toogleNotificationList}
                        className="absolute top-2 cursor-pointer left-[-10px] inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full z-2"
                      >
                        999
                      </span>
                      <div
                        id="notificationDropdown"
                        className=" relative z-10 w-72 bg-white text-base rounded divide-y divide-gray-100 shadow-xl float-right mt-[25px]"
                      >
                        <NotificationMenu
                          showNotificationList={showNotificationList}
                          showHideNotificationpopUp={(value) =>
                            setShowNotificationList(value)
                          }
                        />
                      </div>
                    </div>
                     */}

                    <div className="relative w-16 h-16 pt-2 cursor-pointer">

                      {/* <img
                        className="rounded-full border border-gray-100 shadow-sm"
                        src={
                          userinfo["avatar"]
                            ? userinfo["avatar"]
                            : "/static/media/profile.a33a86e1109f4271bbfa9f4bab01ec4b.svg"
                        }
                        height={42}
                        width={42}
                        alt="user icon"
                        onClick={() => showHideUserPopup()}
                      /> */}

                      {/* Dropdown menu */}
                      <div
                        id="userDropDown"
                        className="hidden relative z-10 w-72 bg-dark-background text-base rounded  border border-primary-color divide-y divide-primary-color shadow-xl float-right mt-4"
                      >
                        <UserDropDownMenu />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary w-36"
                  >
                    Connect Wallet
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal
        key={modalKey}
        height={437}
        width={705}
        show={showModal}
        handleClose={() => setShowModal(false)}
      >
        <div
          className={`text-center px-[11px] md:px-[0px] text-[#FFFFFF] ${isLoading ? "loading" : ""
            }`}
        >
          <div className="mt-[10px] font-black text-[28px] ">
            Connect wallet
          </div>
          <div className="mt-[12px] text-[#9499AE] font-bold">
            Connect with one of our available wallet providers or create a new
            one.
          </div>
          <div className="mt-[26px]">
            <div
              className="w-full max-w-[355px] cursor-pointer h-[52px] bg-[#31224E] rounded-lg block mx-auto px-[14px]"
              onClick={handleConnectWallet}
            >
              <div className="flex items-center  pt-[10px]">
                <div className="flex items-center">
                  <img
                    className="h-[32px] w-[32px] "
                    src={metamaskIcon}
                    alt="metamask wallet login button"
                  />
                  <div className="ml-[11px]">
                    {metamaskAccount ? (
                      <span>
                        <p>
                          Login with Address: {metamaskAccount.substring(0, 5)}
                          ...{" "}
                        </p>
                      </span>
                    ) : (
                      <span>MetaMask</span>
                    )}
                  </div>
                </div>
                <div className="ml-auto bg-[#9A5AFF] px-2 py-1 text-[10px] rounded font-black text-[#000000]">
                  Popular
                </div>
              </div>
            </div>
            <div
              className="w-full max-w-[355px] h-[52px] bg-[#31224E] rounded-lg mt-[12px] block mx-auto px-[14px]"
              onClick={loginTorus}
            >
              <div className="flex items-center pt-[10px] cursor-pointer">
                <img
                  className="h-[28px] w-[28px]"
                  src={torusIcon}
                  alt="Touras wallet login button"
                />
                <div className="ml-[11px]">
                  {torusAccountInfo == null ? (
                    <div className="torusButtonLabel">Torus</div>
                  ) : (
                    <div className="torusButtonLabel">
                      Account : {torusAccountInfo.address.substring(0, 8)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[26px] w-full max-w-[355px]  block mx-auto ">
            <div className="flex items-baseline">
              <input
                type="checkbox"
                id="termsAndCondition"
                name="termsAndCondition"
                checked={isTermsAndConditionsChecked}
                onChange={(e) => handelTermsChecked(e.target.checked)}
              />
              <div className="text-left ml-[8px] font-bold text-[14px]">
                I read and accept{" "}
                <span className="text-[#5C008D]">Terms Of services</span> and{" "}
                <br />
                <span className="text-[#5C008D]"> Privacy Policy</span>
              </div>
            </div>
          </div>



        </div>
      </Modal>
    </div>
  );
};
export default Header;
