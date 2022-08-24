import { useState, useEffect } from "react";
import {
  getPersonalSign,
  isWalletConnected,
  getWalletAccount,
} from "util/metaMaskWallet";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { useSelector } from "react-redux";
import Modal from "components/Modal";
import torusIcon from "assets/images/modal/torus.png";
import metamaskIcon from "assets/images/modal/metamask.png";
import { torusWalletLogin } from "util/Torus";
import { loginUser, useAuthState, useAuthDispatch, logout } from "Context";
import { useHistory } from "react-router-dom";
import { getUserInfo } from "../../services/User/userService";
import { useDispatch } from "react-redux";
import { setUserInfo, setUserLoading } from "../../Slice/userSlice";
const WalletConnectModal = ({
  showModal,
  closeModal,
  navigateToPage,
  noRedirection,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const context = useAuthState();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [modalKey, setModalKey] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] =
    useState(false);
  const [showMessage, setshowMessage] = useState(false);
  const [metamaskConnectAttempt, setMetamaskConnectAttempt] = useState(0);
  const [metamaskAccount, setMetamaskAccount] = useState("");
  const [torusAccountInfo, setTorusAccountInfo] = useState(null);
  const authDispatch = useAuthDispatch();

  const [userId, setUserId] = useState(context ? context.user : "");
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
    } else {
      setshowMessage(true);
    }
  }
  async function loginTorus() {
    if (isTermsAndConditionsChecked) {
      await torusWalletLogin().then((e) => {
        setTorusAccountInfo(e);
        userLogin(e.address, e.signature, "torus");
      });
    } else {
      setshowMessage(true);
    }
  }
  async function getUserDetails(userID, isNavigate) {
    dispatch(setUserLoading("loading"));
    const response = await getUserInfo(userID);
    let userinfoResponse;
    try {
      userinfoResponse = response["user"];
    } catch {
      dispatch(setUserLoading("idle"));
    }
    dispatch(setUserInfo(userinfoResponse));
    setIsLoading(false);
    if (!noRedirection) {
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
            window.location.reload();
          }
        } else {
          history.push("/profile-settings");
          window.location.reload();
        }
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
    setshowMessage(false);
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
          className={`text-center px-[11px] md:px-[0px] text-black ${
            isLoading ? "loading" : ""
          }`}
        >
          <h1 className="mt-[10px]">Connect wallet</h1>
          <p className="mt-3 text-white-shade-600 font-bold">
            Connect with one of our available wallet providers or create a new
            one.
          </p>
          <div className="mt-[26px]">
            <div
              className="w-full max-w-[355px] cursor-pointer  h-[52px] border rounded border-primary-900 rounded-lg block mx-auto px-[14px]"
              onClick={handleConnectWallet}
            >
              <div className="flex items-center  pt-[10px]">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8"
                    src={metamaskIcon}
                    alt="metamask wallet login button"
                  />
                  <div className="ml-[11px] font-satoshi-bold font-black">
                    {metamaskAccount ? (
                      <p>
                        Login with Address: {metamaskAccount.substring(0, 5)}
                        ...{" "}
                      </p>
                    ) : (
                      <span>MetaMask</span>
                    )}
                  </div>
                </div>
                <div className="ml-auto bg-primary-900 px-2 py-1 text-[10px] rounded-lg font-satoshi-bold font-black text-black">
                  Popular
                </div>
              </div>
            </div>
            <div
              className="w-full max-w-[355px] h-[52px] border border-primary-900 rounded-lg mt-[12px] block mx-auto px-[14px]"
              onClick={loginTorus}
            >
              <div className="flex items-center pt-[10px] cursor-pointer">
                <img
                  className="h-[28px] w-[28px]"
                  src={torusIcon}
                  alt="Touras wallet login button"
                />
                <div className="ml-[11px] font-satoshi-bold font-black">
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
              <div>
                <div className="text-left ml-[8px] font-medium text-sm">
                  I read and accept{" "}
                  <a
                    href="https://www.decir.io/terms"
                    target="_blank"
                    className="text-primary-900"
                  >
                    Terms Of services
                  </a>{" "}
                  and <br />
                  <a
                    href="https://www.decir.io/conditions"
                    target="_blank"
                    className="text-primary-900"
                  >
                    {" "}
                    Privacy Policy
                  </a>
                </div>
                {showMessage && (
                  <div className="validationTag">
                    Please accept terms and conditions
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default WalletConnectModal;
