import { useState, useEffect } from "react";
import Modal from "./Modal";
import Sidebar from "./Sidebar/Sidebar";
import logo from "assets/images/header/logo.svg";
import metamaskIcon from "assets/images/modal/metamask.png";
import torusIcon from "assets/images/modal/torus.png";
import { useEthers, useEtherBalance } from "@usedapp/core";
import {
  connectWallet,
  registerChainChnageEvent,
  isWalletConnected,
} from "../util/wallet";
// import TorusWallet from "./auth/TorusWallet";
const Header = () => {
  const { activateBrowserWallet, account, active, activate } = useEthers();
  const etherBalance = useEtherBalance(account);
  const [showModal, setShowModal] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [metamushAccount, setMetamushAccount] = useState(account);

  useEffect(() => {
    if (active) {
      if (account) {
        setMetamushAccount(account);
      }
    }
  }, [account]);

  async function handleConnectWallet() {
    const isConnected = await isWalletConnected();
    if (isConnected && metamushAccount && metamushAccount.length > 5) {
      return;
    } else {
      try {
        await activate();
        activateBrowserWallet();
        await connectWallet();
      } catch (error) {
        if (!isConnected && !metamushAccount) {
          window.location.reload();
        }
      }
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
          <button className="cp createProjectButtonConatiner">
            CREATE PROJECT
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="cp walletLoginButtonConatiner"
          >
            WALLET LOGIN
          </button>
        </div>
        {/* <TorusWallet /> */}

        {/* <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/projects">projects</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/nothing-here">Nothing Here</NavLink>
          </li>
          <button onClick={() => navigate("/", { replace: false })}>
            Navigate
          </button>
        </ul> */}
      </nav>
      {/* <hr /> */}
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
              <div className="torusButtonLabel">Torus</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Header;
