import styles from './index.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { getUserInfo } from 'services/User/userService';
import { setUserInfo, setSideBar } from 'redux/user';
import Image from 'next/image';
import Logo from 'assets/images/header/logo.svg';
import Twitter from 'assets/images/header/twitter.svg';
import Discord from 'assets/images/header/discord.svg';
import Telegram from 'assets/images/header/telegram.svg';

const MENU_ITEMS = [
  { id: 0, label: '🌈 Home', path: 'https://decir.io/', external: true },
  { id: 1, label: '🎛️ Dashboard', path: '/dashboard', external: false },
  {
    id: 2,
    label: '👥 NFT Collections',
    path: '/list?type=collection&user=true',
    external: false,
  },
  { id: 3, label: '🎚️ DAO', path: '/list?type=dao', external: false },
  {
    id: 4,
    label: '🔒 Gated contents',
    path: '/list?type=tokenGated&user=true',
    external: false,
  },
  {
    id: 5,
    label: '📖 Learn',
    path: 'https://decir.gitbook.io/decir/',
    external: true,
  },
  { id: 6, label: '🤓 Profile', path: '/profile/settings', external: false },
  { id: 7, label: '🔔 Notifications', path: '/', external: false },
];

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
      <div
        className={`bg-light1 h-screen sticky top-0 ${styles.sidenav} border-r-1 border`}
      >
        <div
          className={`${styles.sidebarLinksContainer} flex flex-col items-center mt-5`}
        >
          <div
            className='cp lg:ml-1  mb-[35px]'
            onClick={() => router.push('/')}
          >
            <Image src={Logo} alt='DeCir' />
          </div>
          <div className='pl-6 pr-10 flex-0 flex flex-col'>
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.id}
                onClick={item?.external ? () => {} : accessCheck}
                passHref={true}
                rel='noopener noreferrer'
                target={item?.external ? '_blank' : ''}
                href={item.path}
                className='justify-start flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-3 font-bold   ease-in-out duration-300 hover:text-[#000] hover:font-black last:mt-auto text-textSubtle cursor-pointer text-[15px]'
              >
                <span className='ml-2'>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className='mt-auto text-left mr-auto ml-6'>
            <div className='mb-[40px]'>
              <p className='gradient-text-new'>DC price (24hrs) </p>
              <div className='flex items-center'>
                <p className='text-[#E9F2F6] text-[14px]'>$1.68</p>
                <p className='text-[#32E865] text-[14px] ml-2 mt-0'>+32%</p>
              </div>
            </div>
            <div>
              <h2 className='!text-[14px] !font-black mb-3'>Follow us</h2>
              <div className='flex items-center'>
                <Link
                  href='https://discord.com/channels/989012893737566208/989012893737566215'
                  passHref
                  target='_blank'
                >
                  <Image src={Discord} alt='Twitter' className='mr-6' />
                </Link>
                <Link href='#' passHref target='_blank'>
                  <Image src={Telegram} alt='Twitter' className='mr-6' />
                </Link>
                <Link
                  href='https://twitter.com/decentralcircle'
                  passHref
                  target='_blank'
                >
                  <Image src={Twitter} alt='Twitter' />
                </Link>
              </div>
            </div>
            <div className='mt-[15px]'>
              <p className='text-[12px] mb-0'>© 2023 DeCir</p>
              <p className='text-[12px] mt-0'> All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
