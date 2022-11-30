import styles from './index.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { getUserInfo } from 'services/User/userService';
import { setUserInfo, setSideBar } from 'redux/user';

const Sidebar = ({ handleToggleSideBar, setShowModal }) => {
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.user.userinfo);
  useEffect(() => {
    if (userinfo.id) {
      getUserDetails(userinfo.id);
    }
  }, []);

  async function getUserDetails(userID) {
    const response = await getUserInfo(userID);
    let userinfoResponse;
    try {
      userinfoResponse = response['user'];
    } catch {}
    dispatch(setUserInfo(userinfoResponse));
  }

  const [navigateToPage, setNavigateToPage] = useState('');

  function hideModal(e) {
    setShowModal(false);
    try {
      e.preventDefault();
      dispatch(setSideBar(false));
    } catch {}
  }

  function accessCheck(e) {
    handleToggleSideBar();
    if (!userinfo.id || userinfo.id.length < 1) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
    }
  }

  return (
    <>
      <div className={`bg-light1 h-screen sticky top-0 ${styles.sidenav}`}>
        <div className={`${styles.sidebarLinksContainer} flex flex-col`}>
          <div className='pl-6 pr-10 flex-0 flex flex-col'>
            {/* <NavLink
              to={"/"}
              id="nav-home"
              onClick={handleToggleSideBar}
              activeClassName="active-menu2 "
              className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-[#199BD8] hover:border-r-4"
            >
              <i className="fa-solid fa-home"></i>
              <span className="ml-2">Home</span>
            </NavLink> */}
            <Link
              onClick={accessCheck}
              href={`/profile/${userinfo?.id}`}
              activeClassName={styles.activeMenu}
              className='flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-[#199BD8] hover:border-r-4'
            >
              <i className='fa-solid fa-gauge'></i>
              <span className='ml-2'>Dashboard</span>
            </Link>
            <Link
              onClick={accessCheck}
              href={`/create`}
              activeClassName={styles.activeMenu}
              className='flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-[#199BD8] hover:border-r-4'
            >
              <i className='fa-solid fa-circle-plus'></i>
              <span className='ml-2'>Create Project</span>
            </Link>
          </div>
          {/* Gas price */}
          {/* <div className="pl-6 pr-10 flex-0 flex flex-col text-[#199BD8] mt-96">
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
      </div>
    </>
  );
};
export default Sidebar;
