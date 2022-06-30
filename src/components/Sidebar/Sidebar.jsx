import "assets/css/Sidebar.css";
import { useAuthState } from "Context";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserInfo } from "services/User/userService";
import { setUserInfo } from "Slice/userSlice";
import SidebarNavigationCard from "./SideBarNavigationCard";
const openStyle = { width: "271px" };
const closeStyle = { width: "0px" };
const linksList = [
  { id: 0, title: "What’s CREABO", to: "/" },
  { id: 1, title: "Contact", to: "/" },
];
const Sidebar = ({ show, handleClose }) => {
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
    } catch { }
    dispatch(setUserInfo(userinfoResponse));
  }

  return (
    <>
      <div
        id=""
        style={show ? openStyle : closeStyle}
        className="sidenav"
      >
        <div className="closebtn cp" onClick={handleClose}>
          &times;
        </div>
        {/* <SidebarNavigationCard /> */}
        {/* <div className="sidebarDevider"></div> */}

        <div className="sidebarLinksContainer flex flex-col">
          <div className="pt-10 pr-10 pb-5 pl-[52px]">
            <img
              className="rounded-full border border-gray-100 shadow-sm mb-3 h-16"
              src={
                userinfo["avatar"]
                  ? userinfo["avatar"]
                  : "/static/media/profile.a33a86e1109f4271bbfa9f4bab01ec4b.svg"
              }
              width={64}
              alt={userinfo["display_name"]}
            />
            <h4 className="font-satoshi-bold font-black text-white text-base">
              {userinfo["display_name"]}
            </h4>
          </div>

          {/* {linksList.map((i) => (
            <Link key={i.id} to={i.to} className="cp">
              {i.title}
            </Link>

          ))} */}
          <div className="pl-6 pr-10 flex-1 flex flex-col">
            <a href="#" className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto       bg-primary-500 text-white ">
              <i class="fa-regular fa-user"></i>
              <span class="ml-2"> PROFILE</span>
            </a>


            <a href="#" className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto">
              <i class="fa-regular fa-circle-plus"></i>
              <span class="ml-2"> Create Project</span>
            </a>

            <a href="#" className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto">
              <i class="fa-regular fa-cubes-stacked"></i>
              <span class="ml-2"> Ecosystem</span>
            </a>

            <a href="#" className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto">
              <i class="fa-regular fa-arrow-right-from-bracket"></i>
              <span class="ml-2">Log Out</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
