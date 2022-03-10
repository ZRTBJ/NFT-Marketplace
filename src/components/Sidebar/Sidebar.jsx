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
        <SidebarNavigationCard />
        <div className="sidebarDevider"></div>
        <div className="sidebarLinksContainer">
          {linksList.map((i) => (
            <Link key={i.id} to={i.to} className="cp">
              {i.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
