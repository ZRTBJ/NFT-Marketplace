// import { useHistory } from "react-router-dom";
import dummyImage from "assets/images/dummy.png";

import { useState, useRef, useEffect } from "react";
const NotificatioMenu = ({
  showNotificationList,
  showHideNotificationpopUp,
}) => {
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      img: dummyImage,
      tag: "MEET UP",
      text: "  User NAME applied your project “cat cat cat…”.",
    },
    {
      id: 2,
      img: dummyImage,
      tag: "PROJECT",
      text: "  User NAME applied your project “cat cat cat…”.",
    },
    {
      id: 3,
      img: dummyImage,
      tag: "POLL",
      text: "  User NAME applied your project “cat cat cat…”.",
    },
    {
      id: 4,
      img: dummyImage,
      tag: "PROJECT",
      text: "  User NAME applied your project “cat cat cat…”.",
    },
    {
      id: 5,
      img: dummyImage,
      tag: "MEET UP",
      text: "  User NAME applied your project “cat cat cat…”.",
    },
  ]);
  // let history = useHistory();
  return (
    <div>
      {showNotificationList && (
        <div className="border border-[#F4F4F4]">
          <div className="shadow-lg roboto ">
            <div className="flex justify-between px-[11px] mb-2">
              <div className="text-[14px] text-[#192434] font-semibold roboto mt-[13px]">
                NOTIFICATION
              </div>
              <div className="cursor-pointer  w-[60px] bg-[#0AB4AF] text-[#ffff] text-center mt-3 rounded-full text-[12px] font-semibold">
                more
              </div>
            </div>
            {notificationsList.map((notification) => (
              <div
                key={notification.id}
                className="flex border-t border-b border-[#F4F4F4]  py-4 pl-[12px] pr-[12px] w-full items-start"
              >
                <img
                  src={notification.img}
                  className="rounded h-[50px] w-[50px]"
                  alt=""
                />
                <div className="ml-3">
                  <div className="text-[14px] text-[#192434] border border-[#0AB4AF] rounded-2xl w-[78px] text-center font-semibold">
                    {notification.tag}
                  </div>
                  <div className="text-[14px] roboto">{notification.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default NotificatioMenu;
