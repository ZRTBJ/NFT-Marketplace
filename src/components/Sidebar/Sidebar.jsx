import 'assets/css/Sidebar.css';
import { useAuthState } from 'Context';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getUserInfo } from 'services/User/userService';
import { setUserInfo, setSideBar } from 'Slice/userSlice';
import WalletConnectModal from 'components/modalDialog/WalletConnectModal';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import CreateRightAttachedNFT from 'components/modalDialog/CreateRightAttachNFT';

const openStyle = { width: '271px' };
const closeStyle = { width: '0px' };
const linksList = [
  { id: 0, title: 'What’s CREABO', to: '/' },
  { id: 1, title: 'Contact', to: '/' },
];
const Sidebar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const context = useAuthState();
  const [userId, setUserId] = useState(context ? context.user : '');
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isExpend, setIsExpend] = useState(false);
  const [ShowCreateRANFT, setShowCreateRANFT] = useState(false);

  useEffect(() => {
    if (userId && !userinfo.display_name) {
      getUserDetails(userId);
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

  const [showModal, setShowModal] = useState(false);
  const [navigateToPage, setNavigateToPage] = useState('');

  function hideModal(e) {
    setShowModal(false);
    try {
      e.preventDefault();
      dispatch(setSideBar(false));
    } catch {}
  }

  function accessCheck(e) {
    if (!userId || userId.length < 1) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
    }
  }

  return (
    <div style={openStyle} className='sidenav bg-light1 dark:dark-background'>
      <div className='sidebarLinksContainer flex flex-col'>
        <div className='pl-6 pr-10 flex-0 flex flex-col'>
          <NavLink
            to={'/'}
            id='nav-home'
            activeClassName='active-menu2 '
            className='flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-[#199BD8] hover:border-r-4'
          >
            <i className='fa-solid fa-home'></i>
            <span className='ml-2'>Home</span>
          </NavLink>
          <NavLink
            onClick={accessCheck}
            to={`/profile/${userId}`}
            activeClassName='active-menu'
            className='flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-[#199BD8] hover:border-r-4'
          >
            <i className='fa-solid fa-gauge'></i>
            <span className='ml-2'>Dashboard</span>
          </NavLink>
          <NavLink
            onClick={accessCheck}
            to={`/create`}
            activeClassName='active-menu'
            className='flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-[#199BD8] hover:border-r-4'
          >
            <i className='fa-solid fa-circle-plus'></i>
            <span className='ml-2'>Create Project</span>
          </NavLink>
          {/* <NavLink
            onClick={accessCheck}
            to={`/project-create`}
            activeClassName="active-menu"
            className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-[#199BD8] hover:border-r-4"
          >
            <span>Create DAO</span>
          </NavLink> */}

          {/* <div
            onClick={() => setIsExpend(!isExpend)}
            activeClassName="active-menu2"
            className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold   ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer"
          >
            <div className="w-32">Create NFT</div>
            <div className="w-24 text-right">
              <i
                className={`fa-solid fa-angle-${isExpend ? "down" : "right"}`}
              ></i>
            </div> */}
          {/* </div> */}
          {/* {isExpend && (
            <div className="ml-4">
              <NavLink
                onClick={accessCheck}
                to={`/membershipNFT`}
                activeClassName="active-menu"
                className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold text-sm ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-border-[#199BD8] hover:border-r-4"
              >
                <span>Create Membership</span>
              </NavLink>
              <NavLink
                onClick={accessCheck}
                to={`/product-nft`}
                activeClassName="active-menu"
                className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold text-sm ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-border-[#199BD8] hover:border-r-4"
              >
                <span>Create Product</span>
              </NavLink>
              <div
                onClick={() => {
                  if (userId && userId.length > 1) {
                    setShowCreateRANFT(true);
                  } else {
                    setShowModal(true);
                  }
                }}
                activeClassName="active-menu"
                className="flex items-center font-satoshi-bold mb-1 pl-5 pr-3 py-4 font-bold text-sm ease-in-out duration-300 hover:text-[#199BD8] last:mt-auto text-textSubtle cursor-pointer hover:border-border-[#199BD8] hover:border-r-4"
              >
                <span>Create Right Attached</span>
              </div>
            </div>
          )} */}
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
      <WalletConnectModal
        showModal={showModal}
        closeModal={hideModal}
        navigateToPage={navigateToPage}
      />
      {ShowCreateRANFT && (
        <CreateRightAttachedNFT
          show={ShowCreateRANFT}
          handleClose={() => setShowCreateRANFT(false)}
        />
      )}
    </div>
  );
};
export default Sidebar;
