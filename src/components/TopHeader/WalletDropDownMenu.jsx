import { useAuthState, useAuthDispatch, logout } from "Context";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ReactComponent as ProfileLogo } from "../../assets/images/profileSettings/ico_personal.svg";
import { ReactComponent as ProjectLogo } from "../../assets/images/header/ico_project.svg";
import { ReactComponent as SettingLogo } from "../../assets/images/header/ico_setting.svg";
import { ReactComponent as LogoutLogo } from "../../assets/images/header/ico_logout.svg";
import ico_torus from "../../assets/images/header/ico_torus.svg";
import ico_metamask from "../../assets/images/header/ico_metamask.svg";
import metamaskIcon from "assets/images/modal/metamask.png";
import torusIcon from "assets/images/modal/torus.png";
import Config from "../../config";
import Web3 from "web3";
import { useEffect, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";

const WalletDropDownMenu = ({ handleWalletDropDownClose }) => {
  let history = useHistory();
  const dispatch = useAuthDispatch();
  const loadingStatus = useSelector((state) => state.user.status);
  const userinfo = useSelector((state) => state.user.userinfo);
  const [showWallet, setShowWallet] = useState(false);
  const context = useAuthState();
  const [selectedWallet, setSelectedWallet] = useState(
    context ? context.walletAddress : ""
  );
  const [wallet, setWallet] = useState(context ? context.wallet : "");
  const [balance, setBalance] = useState(0);
  const userLoadingStatus = useSelector((state) => state.user.status);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: handleWalletDropDownClose });

  function showHideUserPopup() {
    const userDropDown = document.getElementById("userDropDown");
    userDropDown.classList.toggle("hidden");
  }

  function showHideWallet() {
    setShowWallet(!showWallet);
  }

  function handleLogout() {
    logout(dispatch);
    // showHideUserPopup();
    history.push("/");
    window.location.reload();
  }

  useEffect(() => {
    setWallet(context ? context.wallet : "");
    try {
      setIsLoadingBalance(true);
      const web3 = new Web3(new Web3.providers.HttpProvider(Config.RPC_URL));
      if (selectedWallet && selectedWallet.length > 5) {
        web3.eth.getBalance(selectedWallet).then((res) => {
          setBalance(res / 10 ** 18);
          setIsLoadingBalance(false);
        });
      }
    } catch {
      setIsLoadingBalance(false);
    }
  }, [userLoadingStatus]);

  return (
    <>
      {/* <div className="wallet">
        <h3> WALLET</h3>
        <h5>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><rect id="\u9577\u65B9\u5F62_645" data-name="\u9577\u65B9\u5F62 645" width="24" height="24" fill="none"></rect><path id="\u5408\u4F53_11" data-name="\u5408\u4F53 11" d="M.314,16.629a1.629,1.629,0,0,1-.3-1.163c.455-3.6,3.848-6.316,7.893-6.316s7.428,2.708,7.891,6.3a1.631,1.631,0,0,1-.3,1.163A9.384,9.384,0,0,1,7.9,20.15,9.391,9.391,0,0,1,.314,16.629Zm.68-1.051a.725.725,0,0,0,.134.519A8.377,8.377,0,0,0,7.9,19.211a8.369,8.369,0,0,0,6.782-3.128.725.725,0,0,0,.132-.519c-.4-3.122-3.373-5.476-6.909-5.476S1.39,12.449.995,15.578ZM7.9,8.52a4.265,4.265,0,1,1,.006,0ZM4.633,4.26A3.274,3.274,0,1,0,7.907.986,3.278,3.278,0,0,0,4.633,4.26Z" transform="translate(4 2)" fill="#fff"></path></svg>

          <span className="ml-2">Total Balance</span>
        </h5>
        <h4>180.00 USDT</h4>
        <a href="#" className="btn-gradient-outline">Add Funds</a>
        <hr />
        <a href="#" className="link-logout">

          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18"><rect id="\u9577\u65B9\u5F62_645" data-name="\u9577\u65B9\u5F62 645" width="24" height="24" fill="none"></rect><path id="\u5408\u4F53_11" data-name="\u5408\u4F53 11" d="M.314,16.629a1.629,1.629,0,0,1-.3-1.163c.455-3.6,3.848-6.316,7.893-6.316s7.428,2.708,7.891,6.3a1.631,1.631,0,0,1-.3,1.163A9.384,9.384,0,0,1,7.9,20.15,9.391,9.391,0,0,1,.314,16.629Zm.68-1.051a.725.725,0,0,0,.134.519A8.377,8.377,0,0,0,7.9,19.211a8.369,8.369,0,0,0,6.782-3.128.725.725,0,0,0,.132-.519c-.4-3.122-3.373-5.476-6.909-5.476S1.39,12.449.995,15.578ZM7.9,8.52a4.265,4.265,0,1,1,.006,0ZM4.633,4.26A3.274,3.274,0,1,0,7.907.986,3.278,3.278,0,0,0,4.633,4.26Z" transform="translate(4 2)" fill="#fff"></path></svg>

          <span className="ml-2">Log Out </span>
        </a>
      </div> */}

      <div
        ref={ref}
        className="w-screen md:w-52 h-screen md:h-auto md:border border-slate-300  bg-light dark:bg-dark-background rounded-xl absolute top-11 right-[-44px] md:right-0 z-20"
      >
        <div className="pl-10 pr-3 py-3 border-b border-slate-300">
          <h3 className="txtblack dark:text-white text-sm  mb-6 ">Wallet</h3>
          <p className="txtblack dark:text-white flex content-center mb-2">
            <img
              src={
                wallet === "metamask"
                  ? metamaskIcon
                  : wallet === "torus"
                  ? torusIcon
                  : ""
              }
              alt="mask"
              width={21}
              height={21}
              className="mr-2"
            />
            <span>Total Balance </span>
          </p>
          <h4 className="txtblack dark:text-white text-xl  mb-6 tracking-wide">
            {isLoadingBalance && (
              <i className="fa fa-spinner fa-pulse fa-fw"></i>
            )}
            <span>{balance ? balance.toFixed(4) : 0} MATIC</span>
          </h4>
          <a className="btn-fund" href="#">
            <span>Add Funds</span>
          </a>
        </div>

        {/* Switch wallet */}
        {/* <div className="pl-10 pr-3 py-3 border-b border-slate-300">
          <div
            onClick={handleLogout}
            className="items-center txtblack dark:text-white flex content-center font-base text-sm cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right-arrow-left"></i>
            <span className="ml-2">Switch Wallet</span>
          </div>
        </div> */}
        <div className="pl-10 pr-3 py-3">
          <div
            onClick={handleLogout}
            className="txtblack dark:text-white flex content-center font-base text-sm cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span className="ml-2">Log Out</span>
          </div>
        </div>
      </div>

      {/* <div className="py-3 px-4 txtblack dark:text-white">
        <div className="inline-flex items-center justify-center">
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
          />
          <div className="ml-2 uppercase">
            {userinfo && userinfo["display_name"]
              ? userinfo["display_name"]
              : "USER NAME"}
          </div>
        </div>
      </div>
      <div className="py-3 px-4 txtblack dark:text-white">
        <div>
          <div onClick={showHideWallet}>
            WALLET{" "}
            <span className="pl-1 text-lg">
              <strong>
                <i
                  className={`fa fa-angle-right fa-md ${showWallet ? "fa-rotate-90" : ""
                    }`}
                ></i>
              </strong>
            </span>
          </div>
          {showWallet && (
            <>
              <div className="bg-light dark:bg-dark-background">
                <div className="inline-flex p-4">
                  <div className="pt-4">
                    {selectedWallet === "metamask" ? (
                      <img
                        src={ico_torus}
                        alt="profile ico"
                        height={16}
                        width={16}
                      />
                    ) : (
                      <img
                        src={ico_metamask}
                        alt="profile ico"
                        height={16}
                        width={16}
                      />
                    )}
                  </div>
                  <div className="pl-2">
                    <small className="txtblack dark:text-white opacity-70 font-['Montserrat']">
                      Total balance dsaffdad
                    </small>
                    <div className="text-[20px]">$12.00 USD</div>
                    <div className="mt-1">
                      <span className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-bold leading-none text-slate-500  rounded-full border-x">
                        <div className="w-2 h-2 rounded-full bg-primary-color mr-1"></div>
                        ETHRIAM Mainnet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-10 text-center txtblack dark:text-white bg-primary-color">
                <div className="py-2">Add Funds</div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="txtblack dark:text-white hover:bg-primary-color">
        <Link
          to={`/profile/${localStorage.getItem("user_id")}`}
          className="inline-flex user-dropdown-item"
          onClick={showHideUserPopup}
        >
          <ProfileLogo />
          <div className="ml-2"> PROFILE</div>
        </Link>
      </div>
      <div className="txtblack dark:text-white hover:bg-primary-color ">
        <Link
          to="/profile-settings"
          className="inline-flex user-dropdown-item"
          onClick={showHideUserPopup}
        >
          <SettingLogo />
          <div className="ml-2">SETTING</div>
        </Link>
      </div>
      <div className="hover:bg-primary-color txtblack dark:text-white">
        <Link
          to="/profile-project-list"
          className="inline-flex user-dropdown-item"
          onClick={showHideUserPopup}
        >
          <ProjectLogo />
          <div className="ml-2">PROJECT</div>
        </Link>
      </div>
      <div className="hover:bg-primary-color txtblack dark:text-white" onClick={handleLogout}>
        <Link
          to=""
          className="inline-flex user-dropdown-item"
          onClick={showHideUserPopup}
        >
          <LogoutLogo />
          <div className="ml-2">SIGN OUT</div>
        </Link>
      </div> */}
    </>
  );
};
export default WalletDropDownMenu;
