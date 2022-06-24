import "assets/css/Sidebar.css";
import { Link } from "react-router-dom";
import SidebarNavigationCard from "./SideBarNavigationCard";
const openStyle = { width: "300px" };
const closeStyle = { width: "0px" };
const linksList = [
  { id: 0, title: "What’s CREABO", to: "/" },
  { id: 1, title: "Contact", to: "/" },
];
const Sidebar = ({ show, handleClose }) => {
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


          <div className="py-10 px-7">
            <img className="w-14 h-14 rounded-full mb-3 bg-gray-400" src="/static/media/profile.a33a86e1109f4271bbfa9f4bab01ec4b.svg" alt="profile-name" />
            <h4 className="font-satoshi-bold font-black text-white text-base">Muhammad Rifat</h4>
          </div>


          {/* {linksList.map((i) => (
            <Link key={i.id} to={i.to} className="cp">
              {i.title}
            </Link>

          ))} */}

          <a href="#" className="flex items-center font-satoshi-bold mb-2 px-7 py-4 font-bold text-primary-500  ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto">
            <i class="fa-regular fa-user"></i>
            <span class="ml-2"> PROFILE</span>
          </a>


          <a href="#" className="flex items-center font-satoshi-bold mb-2 px-7 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto">
            <i class="fa-regular fa-file-plus"></i>
            <span class="ml-2"> Create Project</span>
          </a>

          <a href="#" className="flex items-center font-satoshi-bold mb-2 px-7 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto">
            <i class="fa-regular fa-file-plus"></i>
            <span class="ml-2"> Ecosystem</span>
          </a>

          <a href="#" className="flex items-center font-satoshi-bold mb-2 px-7 py-4 font-bold text-primary-500 ease-in-out duration-300 hover:text-white rounded  active:bg-primary-500 active:text-white last:mt-auto">
            <i class="fa-regular fa-arrow-right-from-bracket"></i>
            <span class="ml-2">Log Out</span>
          </a>


        </div>
      </div>
    </div>
  );
};
export default Sidebar;
