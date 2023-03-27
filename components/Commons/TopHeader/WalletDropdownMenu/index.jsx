import { logout } from 'redux/auth';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import metamaskIcon from 'assets/images/modal/metamask.png';
import { useEffect, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { NETWORKS } from 'config/networks';
import Image from 'next/image';
import { getAccountBalance } from 'util/MetaMask';
import { walletAddressTruncate } from 'util/WalletUtils';
import AvatarDefault from 'assets/images/avatar-default.svg';
import { toast } from 'react-toastify';
import LanguageChanger from 'components/Commons/LanguageChanger';

const WalletDropDownMenu = ({ handleWalletDropDownClose, networkId }) => {
  let router = useRouter();
  const dispatch = useDispatch();
  const { walletAddress, wallet: userWallet } = useSelector(
    (state) => state.auth
  );
  const loadingStatus = useSelector((state) => state.user.status);
  const userinfo = useSelector((state) => state.user.userinfo);
  const [showWallet, setShowWallet] = useState(false);

  const [wallet, setWallet] = useState(userWallet ? userWallet : '');
  const [balance, setBalance] = useState(0);
  const userLoadingStatus = useSelector((state) => state.user.status);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: handleWalletDropDownClose });

  function showHideUserPopup() {
    const userDropDown = document.getElementById('userDropDown');
    userDropDown.classList.toggle('hidden');
  }

  function showHideWallet() {
    setShowWallet(!showWallet);
  }

  function handleLogout() {
    dispatch(logout());
    // showHideUserPopup();
    router.push('/');
    window?.location.reload();
  }
  const copyToClipboard = (text) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      toast.success(`Link successfully copied`);
    }
  };

  useEffect(() => {
    setWallet(userWallet ? userWallet : '');
    getBalance();
  }, [userLoadingStatus]);

  const getBalance = async () => {
    try {
      setIsLoadingBalance(true);
      if (walletAddress && walletAddress.length > 5) {
        const accountBalance = await getAccountBalance();
        setBalance(accountBalance);
        setIsLoadingBalance(false);
      }
    } catch {
      setIsLoadingBalance(false);
    }
  };

  return (
    <div
      ref={ref}
      className='border-slate-300  min-w-[250px] bg-[#fff] rounded-xl absolute top-[62px] right-6 md:right-[44px] z-20 shadow border'
    >
      {userinfo?.id && (
        <div className='p-4 border-b border-slate-300'>
          <div className='flex items-center justify-between flex-wrap mb-5'>
            <div className='flex items-center gap-2'>
              <Image
                unoptimized
                className='rounded-full w-[24px] h-[24px]'
                src={userinfo['avatar'] ? userinfo['avatar'] : AvatarDefault}
                height={24}
                width={24}
                alt='user icon'
              />
              <p className='font-bold'>
                {walletAddressTruncate(walletAddress)}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <div
                onClick={() => copyToClipboard(walletAddress)}
                className='h-[28px] w-[28px] bg-[#E8ECFB] rounded-full flex items-center justify-center'
              >
                <i className='fa-solid fa-copy cursor-pointer'></i>
              </div>
            </div>
          </div>
          <div className='text-center mb-4'>
            <p className='text-textSubtle font-semibold text-[14px]'>
              {NETWORKS[networkId] ? NETWORKS[networkId].cryto : ''} Balance
            </p>
          </div>

          <div className='text-textSubtle-200 text-[24px] font-semibold text-center'>
            {isLoadingBalance && (
              <i className='fa fa-spinner fa-pulse fa-fw'></i>
            )}
            {!isLoadingBalance && (
              <span>
                {balance && Number(balance)?.toFixed(4)}{' '}
                {NETWORKS[networkId] ? NETWORKS[networkId].cryto : ''}
              </span>
            )}
          </div>
          {NETWORKS[networkId] && (
            <div className='text-center text-[14px] text-textSubtle font-semibold text-[14px] flex items-center justify-center gap-2'>
              <Image
                className='rounded-full'
                src={NETWORKS[networkId]?.icon?.src}
                height={18}
                width={18}
                alt='network icon'
              />
              <p>{NETWORKS[networkId].networkName}</p>
            </div>
          )}
        </div>
      )}
      <div className='p-4'>
        {userinfo?.id && (
          <div className='flex items-center justify-between mb-4'>
            <p>Log Out</p>
            <div
              onClick={handleLogout}
              className='h-[28px] w-[28px] bg-[#E8ECFB] rounded-full flex items-center justify-center'
            >
              <i className='fa-solid fa-right-from-bracket cursor-pointer'></i>
            </div>
          </div>
        )}
        <div className='flex items-center justify-between'>
          <p>Language</p>
          <LanguageChanger />
        </div>
      </div>
    </div>
  );
};
export default WalletDropDownMenu;
