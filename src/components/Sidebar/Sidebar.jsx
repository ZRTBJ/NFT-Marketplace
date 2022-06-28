import "assets/css/Sidebar.css";
import { useAuthState } from "Context";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserInfo } from "services/User/userService";
import { setUserInfo } from "Slice/userSlice";
import SidebarNavigationCard from "./SideBarNavigationCard";
const openStyle = { width: "300px" };
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
    } catch {}
    dispatch(setUserInfo(userinfoResponse));
  }

  return (
    <div>
      <div
        id="mySidenav"
        style={show ? openStyle : closeStyle}
        className="sidenav"
      >
        <div className="closebtn cp" onClick={handleClose}>
          &times;
        </div>
        {/* <SidebarNavigationCard /> */}
        {/* <div className="sidebarDevider"></div> */}

        <div className="sidebarLinksContainer flex flex-col">
          <div className="py-10 px-10">
            <img
              className="rounded-full border border-gray-100 shadow-sm mb-3"
              src={
                userinfo["avatar"]
                  ? userinfo["avatar"]
                  : "/static/media/profile.a33a86e1109f4271bbfa9f4bab01ec4b.svg"
              }
              height={64}
              width={64}
              alt="user icon"
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

          <a
            href="#"
            className="flex content-center font-satoshi-bold mb-2 px-7 py-4 font-bold text-primary-500  ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 text-white last:mt-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <rect
                id="\u9577\u65B9\u5F62_645"
                data-name="\u9577\u65B9\u5F62 645"
                width="24"
                height="24"
                fill="none"
              ></rect>
              <path
                id="\u5408\u4F53_11"
                data-name="\u5408\u4F53 11"
                d="M.314,16.629a1.629,1.629,0,0,1-.3-1.163c.455-3.6,3.848-6.316,7.893-6.316s7.428,2.708,7.891,6.3a1.631,1.631,0,0,1-.3,1.163A9.384,9.384,0,0,1,7.9,20.15,9.391,9.391,0,0,1,.314,16.629Zm.68-1.051a.725.725,0,0,0,.134.519A8.377,8.377,0,0,0,7.9,19.211a8.369,8.369,0,0,0,6.782-3.128.725.725,0,0,0,.132-.519c-.4-3.122-3.373-5.476-6.909-5.476S1.39,12.449.995,15.578ZM7.9,8.52a4.265,4.265,0,1,1,.006,0ZM4.633,4.26A3.274,3.274,0,1,0,7.907.986,3.278,3.278,0,0,0,4.633,4.26Z"
                transform="translate(4 2)"
                fill="#fff"
              ></path>
            </svg>
            <span class="ml-2"> PROFILE</span>
          </a>

          <a
            href="#"
            className="flex content-center font-satoshi-bold mb-2 px-7 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 text-white last:mt-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <rect
                id="\u9577\u65B9\u5F62_645"
                data-name="\u9577\u65B9\u5F62 645"
                width="24"
                height="24"
                fill="none"
              ></rect>
              <path
                id="\u5408\u4F53_11"
                data-name="\u5408\u4F53 11"
                d="M.314,16.629a1.629,1.629,0,0,1-.3-1.163c.455-3.6,3.848-6.316,7.893-6.316s7.428,2.708,7.891,6.3a1.631,1.631,0,0,1-.3,1.163A9.384,9.384,0,0,1,7.9,20.15,9.391,9.391,0,0,1,.314,16.629Zm.68-1.051a.725.725,0,0,0,.134.519A8.377,8.377,0,0,0,7.9,19.211a8.369,8.369,0,0,0,6.782-3.128.725.725,0,0,0,.132-.519c-.4-3.122-3.373-5.476-6.909-5.476S1.39,12.449.995,15.578ZM7.9,8.52a4.265,4.265,0,1,1,.006,0ZM4.633,4.26A3.274,3.274,0,1,0,7.907.986,3.278,3.278,0,0,0,4.633,4.26Z"
                transform="translate(4 2)"
                fill="#fff"
              ></path>
            </svg>
            <span class="ml-2"> Create Project</span>
          </a>

          <a
            href="#"
            className="flex content-center font-satoshi-bold mb-2 px-7 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 text-white last:mt-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <rect
                id="\u9577\u65B9\u5F62_645"
                data-name="\u9577\u65B9\u5F62 645"
                width="24"
                height="24"
                fill="none"
              ></rect>
              <path
                id="\u5408\u4F53_11"
                data-name="\u5408\u4F53 11"
                d="M.314,16.629a1.629,1.629,0,0,1-.3-1.163c.455-3.6,3.848-6.316,7.893-6.316s7.428,2.708,7.891,6.3a1.631,1.631,0,0,1-.3,1.163A9.384,9.384,0,0,1,7.9,20.15,9.391,9.391,0,0,1,.314,16.629Zm.68-1.051a.725.725,0,0,0,.134.519A8.377,8.377,0,0,0,7.9,19.211a8.369,8.369,0,0,0,6.782-3.128.725.725,0,0,0,.132-.519c-.4-3.122-3.373-5.476-6.909-5.476S1.39,12.449.995,15.578ZM7.9,8.52a4.265,4.265,0,1,1,.006,0ZM4.633,4.26A3.274,3.274,0,1,0,7.907.986,3.278,3.278,0,0,0,4.633,4.26Z"
                transform="translate(4 2)"
                fill="#fff"
              ></path>
            </svg>
            <span class="ml-2"> Ecosystem</span>
          </a>

          <a
            href="#"
            className="flex content-center font-satoshi-bold mb-2 px-7 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 text-white last:mt-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <rect
                id="\u9577\u65B9\u5F62_645"
                data-name="\u9577\u65B9\u5F62 645"
                width="24"
                height="24"
                fill="none"
              ></rect>
              <path
                id="\u5408\u4F53_11"
                data-name="\u5408\u4F53 11"
                d="M.314,16.629a1.629,1.629,0,0,1-.3-1.163c.455-3.6,3.848-6.316,7.893-6.316s7.428,2.708,7.891,6.3a1.631,1.631,0,0,1-.3,1.163A9.384,9.384,0,0,1,7.9,20.15,9.391,9.391,0,0,1,.314,16.629Zm.68-1.051a.725.725,0,0,0,.134.519A8.377,8.377,0,0,0,7.9,19.211a8.369,8.369,0,0,0,6.782-3.128.725.725,0,0,0,.132-.519c-.4-3.122-3.373-5.476-6.909-5.476S1.39,12.449.995,15.578ZM7.9,8.52a4.265,4.265,0,1,1,.006,0ZM4.633,4.26A3.274,3.274,0,1,0,7.907.986,3.278,3.278,0,0,0,4.633,4.26Z"
                transform="translate(4 2)"
                fill="#fff"
              ></path>
            </svg>
            <span class="ml-2"> Log Out</span>
          </a>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
