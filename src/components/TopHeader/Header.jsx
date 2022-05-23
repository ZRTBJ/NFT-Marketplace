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
import { getUserInfo } from "../../services/User/userService";
import { useHistory } from "react-router-dom";
import { setUserInfo } from "../../Slice/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import config from "config";
import { getProjectDeploy } from "Slice/projectSlice";

const Header = () => {
  // const ws = new WebSocket(`wss://${config.WEB_SOKET}/ws`);

  const history = useHistory();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [metamaskAccount, setMetamaskAccount] = useState("");
  const [torusAccountInfo, setTorusAccountInfo] = useState(null);
  const authDispatch = useAuthDispatch();
  const context = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(context ? context.user : "");
  const userinfo = useSelector((state) => state.user.userinfo);
  const [metamaskConnectAttempt, setMetamaskConnectAttempt] = useState(0);

  useEffect(() => {
    torusInit().then((e) => {
      setTorusAccountInfo(e);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  useEffect(() => {
    if (userId !== null) {
      let host = "ws:";
      try {
        const loc = window.location;
        if (loc.protocol === "https:") {
          host = "wss:";
        }
      } catch {}
      const ws = new WebSocket(`${host}//${config.WEB_SOKET}/ws`);
      ws.onopen = (event) => {
        ws.send(JSON.stringify({ Token: localStorage.getItem("currentUser") }));
      };
      ws.onmessage = function (event) {
        try {
          console.log(event);
          if (event.data) {
            const data = JSON.parse(event.data);
            if (data.type === "functionNotification") {
              const deployData = {
                function_uuid: data.fn_uuid,
                data: event.data,
              };
              dispatch(getProjectDeploy(deployData));
            }
          }
        } catch (err) {
          console.log(err);
        }
      };
    } else {
      console.log("no user");
    }
  }, [userId]);

  async function handleConnectWallet() {
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
  async function loginTorus() {
    await torusWalletLogin().then((e) => {
      console.log("got response", e);
      setTorusAccountInfo(e);
      userLogin(e.address, e.signature, "torus");
    });
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
    } catch {}
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

  return (
    <div>
      <Sidebar show={showSideBar} handleClose={() => setShowSideBar(false)} />
      <nav className="bg-white border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap cp">
            <button
              onClick={() => setShowSideBar(true)}
              type="button"
              className="inline-flex items-center p-2 ml-3 mr-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="side-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
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
                fill="currentColor"
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
            <div className="mx-auto" onClick={() => history.push("/")}>
              <img className="cp" src={logo} height="39" width="165" alt="" />
            </div>
          </div>
          <div className="w-auto mr-0 sm:mr-4" id="mobile-menu">
            <ul
              className={`flex items-center justify-center md:flex-row md:space-x-8 md:text-sm md:font-medium ${
                userId ? "" : "sm:py-2"
              }`}
            >
              <li className="hidden sm:block">
                <button
                  onClick={() => history.push("/project-create")}
                  className="cp createProjectButtonConatiner"
                >
                  CREATE PROJECT
                </button>
              </li>
              <li className="md:!ml-2.5">
                {userId ? (
                  <div className="flex space-x-2">
                    <div className="relative w-10 h-16 pt-4">
                      <span className="cursor-pointer">
                        <img
                          src={notificationIcon}
                          width={24}
                          height={24}
                          alt="Notification icon"
                        />
                      </span>
                      <span className="absolute top-2 left-[-10px] inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full z-2">
                        999
                      </span>
                    </div>
                    <div className="relative w-16 h-16 pt-2 cursor-pointer">
                      <img
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
                      />
                      {/* Dropdown menu */}
                      <div
                        id="userDropDown"
                        className="hidden relative z-10 w-72 bg-white text-base rounded divide-y divide-gray-100 shadow-xl float-right mt-4"
                      >
                        <UserDropDownMenu />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowModal(true)}
                    className="cp walletLoginButtonConatiner"
                  >
                    WALLET LOGIN
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal show={showModal} handleClose={() => setShowModal(false)}>
        <div className={`walletContainer ${isLoading ? "loading" : ""}`}>
          <div className="walletTitle">WALLET</div>
          <div className="walletDescription">
            Connect with one of our available wallet providers or create a new
            one.
          </div>
          <div className="flex-row sm:flex justify-center w-100 mt-4 px-4 walletLoginButtonModalContainer">
            <div
              className="metamaskButtonContainer cp my-4"
              onClick={handleConnectWallet}
            >
              <img
                className="metamaskIcon"
                src={metamaskIcon}
                alt="metamask wallet login button"
              />
              <div className="metamaskButtonLabel">
                {metamaskAccount ? (
                  <span>
                    <p>
                      Login with Address: {metamaskAccount.substring(0, 5)}
                      ...{" "}
                    </p>
                  </span>
                ) : (
                  <span>Connect MetaMask</span>
                )}
              </div>
            </div>
            <div className="torusButtonContainer cp my-4">
              <img
                className="torusIcon"
                src={torusIcon}
                alt="Touras wallet login button"
              />
              {torusAccountInfo == null ? (
                <div className="torusButtonLabel" onClick={loginTorus}>
                  Torus
                </div>
              ) : (
                <div className="torusButtonLabel">
                  Acccount : {torusAccountInfo.address.substring(0, 8)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Header;
