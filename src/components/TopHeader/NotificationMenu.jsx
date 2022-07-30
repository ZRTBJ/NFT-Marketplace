import { useEffect, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "services/notification/notificationService";

const NotificatioMenu = ({ handleNotifictionClose }) => {
  const history = useHistory();
  const [notificationList, setNotificationList] = useState([]);
  const projectDeploy = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: handleNotifictionClose });

  useEffect(() => {
    getNotificationList();
  }, [projectDeploy]);

  function getNotificationList() {
    setIsLoading(true);
    getUserNotifications()
      .then((res) => {
        if (res && res.notifications) {
          setNotificationList(res.notifications);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  function markAsRead(notification) {
    if (notification?.data?.project_uid) {
      markNotificationAsRead(notification.data.project_uid)
        .then((res) => {})
        .catch(() => {});
      history.push(
        `/project-details/${
          notification?.data?.project_uid ? notification.data.project_uid : ""
        }`
      );
      handleNotifictionClose();
    }
  }

  return (
    <div
      ref={ref}
      className="w-screen md:w-1/4 h-screen md:h-auto md:border border-primary-500  bg-dark-background rounded-xl absolute top-16 right-[-44px] md:right-20 z-20 px-4 pb-2"
    >
      <div className="mt-4 text-white">
        <h3>Notifiction</h3>
        <small>Recent Activity</small>
      </div>
      <div className="grid grid-cols-1 divide-y divide-neutral-700 ">
        {notificationList.map((notification, index) => (
          <div className="py-3 px-2" key={`user-notification-${index}`}>
            <div
              className="flex items-center"
              onClick={() => markAsRead(notification)}
              onTouchStart={() => markAsRead(notification)}
            >
              <div className="text-white text-sm cursor-pointer">
                <p className="ml-2">{notification?.data?.project_name}</p>
                <p>
                  <small className="ml-2">{notification?.data?.message}</small>
                </p>
              </div>
              <div className="pl-16">
                <i className="fa fa-angle-right text-primary-900"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="text-center my-4">
          <i className="fa fa-spinner fa-pulse fa-fw text-primary-900"></i>
        </div>
      )}
    </div>
  );
};
export default NotificatioMenu;
