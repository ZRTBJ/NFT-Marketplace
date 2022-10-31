import { useState, useEffect } from "react";
import {
  getPersonalSign,
  isWalletConnected,
  getWalletAccount,
} from "util/MetaMaskWallet";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import Modal from "components/Commons/Modal";
import metamaskIcon from "assets/images/modal/metamask.png";
import { loginUser, useAuthState, useAuthDispatch } from "redux/auth";
import { useHistory } from "react-router-dom";
import { getUserInfo } from "services/User/userService";
import { useDispatch } from "react-redux";
import { setUserInfo, setUserLoading } from "redux/slice/userSlice";
import {
  ls_GetUserID,
  ls_SetChainID,
  ls_SetUserID,
  ls_SetWalletAddress,
} from "util/ApplicationStorage";

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
  const authDispatch = useAuthDispatch();

  const [userId, setUserId] = useState(context ? context.user : "");

  /** Connection to wallet */
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

  /** Get user info */
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
            history.push(`/profile/${ls_GetUserID()}`);
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

  /** Login to our server */
  async function userLogin(address, signature, wallet) {
    const request = {
      address,
      signature,
      wallet,
    };
    try {
      setIsLoading(true);
      let response = await loginUser(authDispatch, request);
      ls_SetWalletAddress(address);
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      const userNetwork = await userProvider.getNetwork();
      ls_SetChainID(userNetwork.chainId);
      setUserId(response["user_id"]);
      getUserDetails(response["user_id"], true);
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
        width={500}
        show={showModal}
        handleClose={() => closeModal()}
      >
        <div
          className={`text-center px-[11px] md:px-[0px] mb-8 text-black ${isLoading ? "loading" : ""
            }`}
        >
          <h1 className="text-[30px] md:text-[46px]">Connect wallet</h1>
          <p className="mt-3 text-white-shade-600 font-bold break-normal">
            Connect with your existing Metamask account or create a new one
          </p>
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
                    rel="noreferrer"
                  >
                    Terms Of services
                  </a>{" "}
                  and
                  <a
                    href="https://www.decir.io/conditions"
                    target="_blank"
                    className="text-primary-900"
                    rel="noreferrer"
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
          <div className="mt-[26px]">
            <div
              className="w-full max-w-[355px] cursor-pointer  h-[52px] border rounded  rounded-lg block mx-auto px-[14px] bg-primary-100"
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
                    {metamaskAccount ? <p>MetaMask</p> : <span>MetaMask</span>}
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
