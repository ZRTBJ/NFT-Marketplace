import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { getUserInfo } from "services/User/userService";
import { setUserInfo, setSideBar } from "redux/user";
import Image from "next/image";
import Logo from "assets/images/header/logo.svg";
import Twitter from "assets/images/twitter-new.svg";
import Discord from "assets/images/discord.svg";
import Telegram from "assets/images/telegram.svg";
import FeatureRequest from "../FeatureRequest/FeatureRequest";
import { useRouter } from "next/router";

const MENU_ITEMS = [
  // {
  //   id: 0,
  //   label: '🌈 Home',
  //   path: 'https://decir.io/',
  //   external: true,
  //   isAuthenticated: false,
  // },
  {
    id: 1,
    label: "🎛️ Dashboard",
    path: "/dashboard",
    external: false,
    isAuthenticated: true,
  },
  {
    id: 2,
    label: "👥 NFT Collections",
    path: "/list?type=collection&user=true",
    external: false,
    isAuthenticated: true,
  },
  {
    id: 3,
    label: "🎚️ DAO",
    path: "/list?type=dao",
    external: false,
    isAuthenticated: true,
  },
  {
    id: 4,
    label: "🔒 Gated contents",
    path: "/list?type=tokenGated&user=true",
    external: false,
    isAuthenticated: true,
  },
  {
    id: 5,
    label: "📖 Learn",
    path: "https://decir.gitbook.io/decir/",
    external: true,
    isAuthenticated: false,
  },
  {
    id: 6,
    label: "🤓 Profile",
    path: "/profile/settings",
    external: false,
    isAuthenticated: true,
  },
  {
    id: 7,
    label: "🔔 Notifications",
    path: "/notifications",
    external: false,
    isAuthenticated: true,
  },
];

const Sidebar = ({ handleToggleSideBar, setShowModal }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showrequestModal, setShowRequestModal] = useState(false);
  const { userinfo, notifications } = useSelector((state) => state.user);
  useEffect(() => {
    if (userinfo?.id) {
      getUserDetails(userinfo.id);
    }
  }, []);

  let unReadNotifications = notifications?.notifications?.filter(
    (data) => data.unread
  );

  async function getUserDetails(userID) {
    const response = await getUserInfo(userID);
    let userinfoResponse;
    try {
      userinfoResponse = response["user"];
    } catch {}
    dispatch(setUserInfo(userinfoResponse));
  }

  const [navigateToPage, setNavigateToPage] = useState("");

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
      <FeatureRequest
        show={showrequestModal}
        handleClose={() => setShowRequestModal(false)}
      />
      <div
        className={`bg-light1 h-screen sticky top-0 ${styles.sidenav} border-r-1 border`}
      >
        <div
          className={`${styles.sidebarLinksContainer} flex flex-col items-center mt-5`}
        >
          <div
            className="cp lg:ml-1  mb-[35px]"
            onClick={() => router.push("/")}
          >
            <Image src={Logo} alt="DeCir" />
          </div>
          <div className="pl-6 pr-10 flex-0 flex flex-col">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.id}
                onClick={
                  item?.external || !item.isAuthenticated
                    ? () => {}
                    : accessCheck
                }
                passHref={true}
                rel="noopener noreferrer"
                target={item?.external ? "_blank" : ""}
                href={item.path}
                className="justify-start flex items-center font-satoshi-bold mb-1 pr-3 py-3 font-bold   ease-in-out duration-300 hover:text-[#000] hover:font-black last:mt-auto text-textSubtle cursor-pointer text-[15px]"
              >
                <span className="ml-2">{item.label}</span>
                {unReadNotifications?.length &&
                item.label === "🔔 Notifications" ? (
                  <span className="bg-[#12b4ff] text-[#fff] ml-2 text-[14px] px-1 rounded-[6px]">
                    {unReadNotifications.length}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
          <div className="mt-auto text-left mr-auto ml-6">
            <div className="mb-[40px]">
              <button
                className="gradient-border-new"
                onClick={() => setShowRequestModal(true)}
              >
                ✋{" "}
                <span className="gradient-text-new text-[14px] font-bold">
                  Feature request
                </span>
              </button>
            </div>
            <div>
              <h2 className="!text-[14px] !font-black mb-3">Follow us</h2>
              <div className="flex items-center">
                <Link
                  href="https://discord.com/channels/989012893737566208/989012893737566215"
                  passHref
                  target="_blank"
                  className="hover:opacity-[0.8]"
                >
                  <Image src={Discord} alt="Twitter" className="mr-6" />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/decir-nfts/"
                  passHref
                  target="_blank"
                  className="hover:text-textSubtle"
                >
                  <i className="fa-brands fa-linkedin mr-6 text-[18px]"></i>
                </Link>
                <Link
                  href="https://twitter.com/decentralcircle"
                  passHref
                  target="_blank"
                  className="hover:opacity-[0.8]"
                >
                  <Image src={Twitter} alt="Twitter" />
                </Link>
              </div>
            </div>
            <div className="mt-[15px]">
              <p className="text-[12px] mb-0">© 2023 DeCir</p>
              <p className="text-[12px] mt-0"> All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
