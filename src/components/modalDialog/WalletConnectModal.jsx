import { useState, useEffect } from "react";
import {
  getPersonalSign,
  isWalletConnected,
  getWalletAccount,
} from "util/metaMaskWallet";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import Modal from "components/Modal";
import torusIcon from "assets/images/modal/torus.png";
import metamaskIcon from "assets/images/modal/metamask.png";
import { torusWalletLogin } from "util/Torus";
import { loginUser, useAuthState, useAuthDispatch, logout } from "Context";
import config from "config";
import { getProjectDeploy } from "Slice/projectSlice";
import { useHistory } from "react-router-dom";
import { getUserInfo } from "../../services/User/userService";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../Slice/userSlice";
const WalletConnectModal = ({ showModal, closeModal, navigateToPage }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const context = useAuthState();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [modalKey, setModalKey] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] =
    useState(false);
  const [metamaskConnectAttempt, setMetamaskConnectAttempt] = useState(0);
  const [metamaskAccount, setMetamaskAccount] = useState("");
  const [torusAccountInfo, setTorusAccountInfo] = useState(null);
  const authDispatch = useAuthDispatch();

  const [userId, setUserId] = useState(context ? context.user : "");
  const [messageHistory, setMessageHistory] = useState([]);
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
        if (navigateToPage) {
          history.push(`/${navigateToPage}`);
        } else {
          history.push(`/profile/${localStorage.getItem("user_id")}`);
        }
      } else {
        history.push("/profile-settings");
      }
    }
    closeModal();
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
  function handelTermsChecked(value) {
    setIsTermsAndConditionsChecked(value);
    setModalKey((pre) => pre + 1);
  }
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
  }, []);
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

  // End web socket Implementation

  useEffect(() => {
    if (userId && !userinfo.display_name) {
      getUserDetails(userId, false);
    }
  }, []);

  return (
    <div>
      <Modal
        key={modalKey}
        height={437}
        width={705}
        show={showModal}
        handleClose={() => closeModal()}
      >
        <div
          className={`text-center px-[11px] md:px-[0px] text-[#FFFFFF] ${isLoading ? "loading" : ""
            }`}
        >
          {navigateToPage}
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
export default WalletConnectModal;
