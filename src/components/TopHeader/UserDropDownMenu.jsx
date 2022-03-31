import { useAuthDispatch, logout } from "Context";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ico_personal from "../../assets/images/header/ico_personal.svg";
import ico_project from "../../assets/images/header/ico_project.svg";
import ico_setting from "../../assets/images/header/ico_setting.svg";
import ico_logout from "../../assets/images/header/ico_logout.svg";
import ico_torus from "../../assets/images/header/ico_torus.svg";

import { useState } from "react";
const UserDropDownMenu = () => {
  let history = useHistory();
  const dispatch = useAuthDispatch();
  const loadingStatus = useSelector((state) => state.user.status);
  const userinfo = useSelector((state) => state.user.userinfo);
  const [showWallet, setShowWallet] = useState(false);

  function showHideUserPopup() {
    const userDropDown = document.getElementById("userDropDown");
    userDropDown.classList.toggle("hidden");
  }

  function showHideWallet() {
    setShowWallet(!showWallet);
  }

  function handleLogout() {
    logout(dispatch);
    showHideUserPopup();
    history.push("/login");
    window.location.reload();
  }

  return (
    <>
      <div className="py-3 px-4 text-gray-900 dark:text-white">
        <div className="inline-flex items-center justify-center">
          <img
            className="rounded-full border border-gray-100 shadow-sm"
            src="/static/media/profile.a33a86e1109f4271bbfa9f4bab01ec4b.svg"
            alt="user icon"
          />
          <div className="ml-2 uppercase">
            {userinfo && userinfo["display_name"]
              ? userinfo["display_name"]
              : "USER NAME"}
          </div>
        </div>
      </div>
      <div className="py-3 px-4 text-gray-900">
        <div>
          <div onClick={showHideWallet}>
            WALLET{" "}
            <span className="pl-1 text-lg">
              <strong>
                <i
                  className={`fa fa-angle-right fa-md ${
                    showWallet ? "fa-rotate-90" : ""
                  }`}
                ></i>
              </strong>
            </span>
          </div>
          {showWallet && (
            <div className="bg-[#F4F4F4]">
              <div className="inline-flex p-4">
                <div className="pt-4">
                  <img
                    src={ico_torus}
                    alt="profile ico"
                    height={16}
                    width={16}
                  />
                </div>
                <div className="pl-2">
                  <small className="text-[#192434] opacity-70 font-['Montserrat']">
                    Total balance
                  </small>
                  <div className="text-[20px]">$12.00 USD</div>
                  <div className="mt-1">
                    <span className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-bold leading-none text-slate-500 bg-white rounded-full border-x">
                      <div class="w-2 h-2 rounded-full bg-[#0AB4AF] mr-1"></div>
                      ETHRIAM Mainnet
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-gray-900 hover:bg-[#0AB4AF] hover:text-white">
        <Link
          to="/profile"
          className="inline-flex py-3 px-4 w-full"
          onClick={showHideUserPopup}
        >
          <img src={ico_personal} alt="profile ico" />
          <div className="ml-2"> PROFILE</div>
        </Link>
      </div>
      <div className="text-gray-900 hover:bg-[#0AB4AF] hover:text-white">
        <Link
          to="/profile-setting"
          className="inline-flex py-3 px-4 w-full"
          onClick={showHideUserPopup}
        >
          <img src={ico_setting} alt="setting ico" />
          <div className="ml-2">SETTING</div>
        </Link>
      </div>
      <div className="py-3 px-4 text-gray-900 hover:bg-[#0AB4AF] hover:text-white">
        <div className="inline-flex">
          <img src={ico_project} alt="project ico" />
          <div className="ml-2">PROJECT</div>
        </div>
      </div>
      <div
        className="py-3 px-4 text-gray-900 hover:bg-[#0AB4AF] hover:text-white"
        onClick={handleLogout}
      >
        <div className="inline-flex w-full">
          <img src={ico_logout} alt="logout ico" />
          <div className="ml-2">SIGN OUT</div>
        </div>
      </div>
    </>
  );
};
export default UserDropDownMenu;
