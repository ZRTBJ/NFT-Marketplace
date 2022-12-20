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
    if (userinfo?.id) {
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
            <Link
              onClick={accessCheck}
              href={`/dashboard`}
              className='flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-[#199BD8] hover:border-r-4'
            >
              <i className='fa-solid fa-gauge'></i>
              <span className='ml-2'>Dashboard</span>
            </Link>
            <Link
              onClick={accessCheck}
              href={`/create`}
              className='flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-[#199BD8] hover:border-r-4'
            >
              <i className='fa-solid fa-circle-plus'></i>
              <span className='ml-2'>Create DAO</span>
            </Link>
            <Link
              onClick={accessCheck}
              href={`/collection/create`}
              className='flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-[#199BD8] hover:border-r-4'
            >
              <i className='fa-solid fa-circle-plus'></i>
              <span className='ml-2'>Create Collection</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
