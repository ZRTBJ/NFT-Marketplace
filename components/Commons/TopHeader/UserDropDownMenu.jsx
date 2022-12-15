import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';

const UserDropDownMenu = ({ handleUserDropdownClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [userId, setUserId] = useState(user ? user : '');
  const ref = useDetectClickOutside({ onTriggered: handleUserDropdownClose });

  return (
    <>
      <div
        ref={ref}
        className='w-screen md:w-52 h-screen md:h-auto md:border border-slate-300  bg-light rounded-xl absolute top-11 right-[-44px] md:right-0 z-20 mt-3'
      >
        <Link
          href={`/dashboard`}
          activeClassName='notActive'
          onClick={handleUserDropdownClose}
        >
          <div className='items-center txtblack flex content-center font-base text-sm cursor-pointer pl-10 pr-3 py-3 border-b border-slate-300'>
            <i className='fa-solid fa-user'></i>
            <span className='ml-2'>My Profile</span>
          </div>
        </Link>
        <Link
          href={'/profile-settings'}
          activeClassName='notActive'
          onClick={handleUserDropdownClose}
        >
          <div className='items-center txtblack flex content-center font-base text-sm cursor-pointer pl-10 pr-3 my-3'>
            <i className='fa-solid fa-gear'></i>
            <span className='ml-2'>Settings</span>
          </div>
        </Link>
      </div>
    </>
  );
};
export default UserDropDownMenu;
