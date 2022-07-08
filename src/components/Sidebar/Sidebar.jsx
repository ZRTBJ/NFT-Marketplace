import "assets/css/Sidebar.css";
import { useAuthState } from "Context";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserInfo } from "services/User/userService";
import { setUserInfo, setSideBar } from "Slice/userSlice";
import SidebarNavigationCard from "./SideBarNavigationCard";
import { useDetectClickOutside } from "react-detect-click-outside";
import WalletConnectModal from "components/modalDialog/WalletConnectModal";
import { useHistory } from "react-router-dom";
const openStyle = { width: "271px" };
const closeStyle = { width: "0px" };
const linksList = [
  { id: 0, title: "What’s CREABO", to: "/" },
  { id: 1, title: "Contact", to: "/" },
];
const Sidebar = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const ref = useDetectClickOutside({ onTriggered: handleClose });

  const context = useAuthState();
  const [userId, setUserId] = useState(context ? context.user : "");
  const userinfo = useSelector((state) => state.user.userinfo);

  useEffect(() => {
    if (userId && !userinfo.display_name) {
      getUserDetails(userId);
    }
  }, []);

  async function getUserDetails(userID) {
    const response = await getUserInfo(userID);
    let userinfoResponse;
    try {
      userinfoResponse = response["user"];
    } catch {}
    dispatch(setUserInfo(userinfoResponse));
  }
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [navigateToPage, setNavigateToPage] = useState("");
  async function navigate(type) {
    setNavigateToPage(type);
    console.log(userinfo.id);
    if (!userinfo.id) {
      setShowModal(true);
    } else {
      history.push(`/${type}`);
    }
  }
  function hideModal() {
    dispatch(setSideBar(false));
  }

  function navigateTo(type) {
    navigate(type);
    // handleClose();
  }

  return (
    <div style={openStyle} className="sidenav" ref={ref}>
      <div className="closebtn cp" onClick={handleClose}>
        &times;
      </div>
      <div className="sidebarLinksContainer flex flex-col">
        <div className="pt-10 mx-auto pb-5">
          {userinfo["avatar"] ? (
            <img
              className="rounded-full border border-gray-100 shadow-sm mb-3 h-16 object-cover"
              src={userinfo["avatar"]}
              width={64}
              alt={userinfo["display_name"]}
            />
          ) : (
            <div className="rounded-full  h-[100px] w-[100px] bg-[grey] shadow-sm mb-3 "></div>
          )}

          <h4 className="font-satoshi-bold font-black text-white text-base">
            {userinfo["display_name"]}
          </h4>
        </div>

        {/* {linksList.map((i) => (
            <Link key={i.id} to={i.to} className="cp">
              {i.title}
            </Link>

          ))} */}
        <div
          onClick={() => navigateTo()}
          className="pl-6 pr-10 flex-0 flex flex-col"
        >
          <div className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto  bg-primary-500 text-white cursor-pointer">
            <i class="fa-regular fa-user"></i>
            <span class="ml-2"> PROFILE</span>
          </div>

          <div
            onClick={() => navigateTo("project-create")}
            className="flex cursor-pointer items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto"
          >
            <i class="fa-regular fa-circle-plus"></i>
            <span class="ml-2"> Create Project</span>
          </div>

          <div className="flex items-center  cursor-pointer font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto">
            <i class="fa-regular fa-cubes-stacked"></i>
            <span class="ml-2"> Ecosystem</span>
          </div>
        </div>
      </div>
      <WalletConnectModal
        showModal={showModal}
        closeModal={hideModal}
        navigateToPage={navigateToPage}
      />
    </div>
  );
};
export default Sidebar;
