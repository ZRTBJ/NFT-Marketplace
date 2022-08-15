import "assets/css/Sidebar.css";
import { useAuthState } from "Context";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getUserInfo } from "services/User/userService";
import { setUserInfo, setSideBar } from "Slice/userSlice";
import WalletConnectModal from "components/modalDialog/WalletConnectModal";
import { useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";

const openStyle = { width: "271px" };
const closeStyle = { width: "0px" };
const linksList = [
  { id: 0, title: "What’s CREABO", to: "/" },
  { id: 1, title: "Contact", to: "/" },
];
const Sidebar = () => {
  const dispatch = useDispatch();

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
  function hideModal(e) {
    e.preventDefault();
    dispatch(setSideBar(false));
  }

  function navigateTo(type) {
    navigate(type);
    // handleClose();
  }

  return (
    <div style={openStyle} className="sidenav bg-light1 dark:dark-background">
      <div className="sidebarLinksContainer flex flex-col">
        <div className="pl-6 pr-10 flex-0 flex flex-col">
          <NavLink
            to="/"
            activeClassName="active-menu"
            className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-primary-900 last:mt-auto text-textSubtle cursor-pointer hover:border-primary-900 hover:border-r-4"
          >
            <i className="fa-solid fa-home"></i>
            <span className="ml-2">Home</span>
          </NavLink>
          <NavLink
            to={`/`}
            activeClassName="active-menu2"
            className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-primary-900 last:mt-auto text-textSubtle cursor-pointer hover:border-primary-900 hover:border-r-4"
          >
            <i className="fa-solid fa-gauge"></i>
            <span className="ml-2">Dashboard</span>
          </NavLink>
          <NavLink
            to={`/project-create`}
            activeClassName="active-menu2"
            className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-primary-900 last:mt-auto text-textSubtle cursor-pointer hover:border-primary-900 hover:border-r-4"
          >
            <i className="fa-solid fa-circle-plus"></i>
            <span className="ml-2">Create Project</span>
          </NavLink>
          <NavLink
            to={`/collection-create/`}
            activeClassName="active-menu2"
            className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-primary-900 last:mt-auto text-textSubtle cursor-pointer hover:border-primary-900 hover:border-r-4"
          >
            <span className="ml-2">Create DAO</span>
          </NavLink>
          <NavLink
            to={``}
            activeClassName="active-menu2"
            className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-primary-900 last:mt-auto text-textSubtle cursor-pointer hover:border-primary-900 hover:border-r-4"
          >
            <span className="ml-2">Create NFT</span>
          </NavLink>
        </div>
        {/* Gas price */}
        {/* <div className="pl-6 pr-10 flex-0 flex flex-col text-primary-900 mt-96">
          <div className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold cursor-pointer">
            <i className="fa-solid fa-gas-pump fa-xl"></i>
            <span className="ml-4">8 USD</span>
            <i
              className="ml-4 text-textSubtle fa-solid fa-circle-info"
              data-for="gas"
              data-tip="this is a price"
              data-iscapture="true"
            ></i>
            <ReactTooltip id="gas" />
          </div>
        </div> */}
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
