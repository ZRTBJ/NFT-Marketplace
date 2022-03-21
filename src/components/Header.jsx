import { useState, useEffect } from "react";
import Modal from "./Modal";
import Sidebar from "./Sidebar/Sidebar";
import logo from "assets/images/header/logo.svg";
import metamaskIcon from "assets/images/modal/metamask.png";
import torusIcon from "assets/images/modal/torus.png";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { loginUser, useAuthState, useAuthDispatch } from "Context";
import {
  connectWallet,
  getPersonalSign,
  isWalletConnected,
} from "../util/metaMaskWallet";
import { torusInit, torusWalletLogin, torusLogout } from "../util/Torus";
// import TorusWallet from "./auth/TorusWallet";
const Header = () => {
  const { activateBrowserWallet, account, active, activate } = useEthers();
  const etherBalance = useEtherBalance(account);
  const [showModal, setShowModal] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [metamushAccount, setMetamushAccount] = useState(account);
  const [torusAccountInfo, setTorusAccountInfo] = useState(null);
  const dispatch = useAuthDispatch();
  const { loading, errorMessage } = useAuthState();

  useEffect(() => {
    if (active) {
      if (account) {
        setMetamushAccount(account);
      }
    }
  }, [account]);
  useEffect(() => {
    torusInit().then((e) => {
      setTorusAccountInfo(e);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleConnectWallet() {
    const isConnected = await isWalletConnected();
    if (isConnected && metamushAccount && metamushAccount.length > 50000) {
      return;
    } else {
      try {
        await activate();
        activateBrowserWallet();
        await connectWallet();
        const signature = await getPersonalSign();
        userLogin(metamushAccount, signature);
      } catch (error) {
        if (!isConnected && !metamushAccount) {
          window.location.reload();
        }
      }
    }
  }
  async function loginTorus(e) {
    await torusWalletLogin(e).then((e) => {
      setTorusAccountInfo(e);
      userLogin(e.address, "Hello");
    });
  }

  function userLogin(address, signature) {
    const request = {
      address,
      signature,
    };
    try {
      let response = loginUser(dispatch, request);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Sidebar show={showSideBar} handleClose={() => setShowSideBar(false)} />
      <nav className="NavContainer">
        <div className="d-flex align-items-center">
          <div
            onClick={() => setShowSideBar(true)}
            className="menuIconContainer cp ms-3"
          >
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
          <div className="brandLogoContainer ms-4">
            <img className="cp" src={logo} height="39" width="165" alt="" />
          </div>
        </div>
        <div className="ms-auto me-4">
          <button
            onClick={torusLogout}
            className="cp createProjectButtonConatiner"
          >
            CREATE PROJECT
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="cp walletLoginButtonConatiner"
          >
            WALLET LOGIN
          </button>
        </div>
      </nav>
      <Modal show={showModal} handleClose={() => setShowModal(false)}>
        <div className="walletContainer">
          <div className="walletTitle">WALLET</div>
          <div className="walletDescription">
            Connect with one of our available wallet providers or create a new
            one.
          </div>
          <div className="d-flex w-100 justify-content-center mt-4 walletLoginButtonModalContainer">
            <div
              className="metamaskButtonContainer cp"
              onClick={handleConnectWallet}
            >
              <img
                className="metamaskIcon"
                src={metamaskIcon}
                alt="metamask wallet login button"
              />
              <div className="metamaskButtonLabel">
                {metamushAccount ? (
                  <span>
                    <p>Account: {metamushAccount.substring(0, 8)}... </p>
                  </span>
                ) : (
                  <span>MetaMask</span>
                )}
              </div>
            </div>
            <div className="torusButtonContainer cp">
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
