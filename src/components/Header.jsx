import { useState } from "react";
import Modal from "./Modal";
import Sidebar from "./Sidebar/Sidebar";
import logo from "assets/images/header/logo.svg";
import metamaskIcon from "assets/images/modal/metamask.png";
import torusIcon from "assets/images/modal/torus.png";
const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
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
            onClick={() => setShowModal(true)}
            className="cp createProjectButtonConatiner"
          >
            CREATE PROJECT
          </button>
          <button className="cp walletLoginButtonConatiner">
            WALLET LOGIN
          </button>
        </div>

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
            <div className="metamaskButtonContainer cp">
              <img
                className="metamaskIcon"
                src={metamaskIcon}
                alt="metamask wallet login button"
              />
              <div className="metamaskButtonLabel">MetaMask</div>
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
