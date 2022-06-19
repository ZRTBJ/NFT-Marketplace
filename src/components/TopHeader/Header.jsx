/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import notificationIcon from "assets/images/header/ico_notification@2x.png";
import UserDropDownMenu from "./UserDropDownMenu";
import NotificationMenu from "./NotificationMenu";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthState } from "Context";
import WalletConnectModal from "components/modalDialog/WalletConnectModal";

const Header = () => {
  const history = useHistory();
  const context = useAuthState();
  const [userId, setUserId] = useState(context ? context.user : "");
  const [showModal, setShowModal] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const userinfo = useSelector((state) => state.user.userinfo);
  function showHideUserPopup() {
    const userDropDown = document.getElementById("userDropDown");
    userDropDown.classList.toggle("hidden");
  }
  // function toogleNotificationList() {
  //   setShowNotificationList((pre) => !pre);
  // }
  function hideModal() {
    setShowModal(false);
  }
  return (
    <div>
      <Sidebar show={showSideBar} handleClose={() => setShowSideBar(false)} />
      <nav className="border border-black">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap cp">
            <button
              onClick={() => setShowSideBar(true)}
              type="button"
              className="inline-flex items-center p-2 ml-3 mr-3 text-sm text-gray-800 rounded-lg hover:bg-primary-color focus:outline-none focus:ring-2 focus:ring-gray-200"
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
            <div className="mx-auto" onClick={() => history.push("/")}>
              <div className="text-left text-white font-semibold text-2xl mt-1">
                CREABO
              </div>
            </div>
          </div>
          <div className="w-auto mr-0 sm:mr-4" id="mobile-menu">
            <ul
              className={`flex items-center justify-center md:flex-row md:space-x-8 md:text-sm md:font-medium ${
                userId ? "" : "sm:py-2"
              }`}
            >
              <li className="text-center text-white font-semibold text-lg">
                What’s Creabo
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
      <WalletConnectModal showModal={showModal} closeModal={hideModal} />
    </div>
  );
};
export default Header;
