import { useDetectClickOutside } from "react-detect-click-outside";
import { useHistory } from "react-router-dom";
import { markNotificationAsRead } from "services/notification/notificationService";

const NotificatioMenu = ({
  handleNotifictionClose,
  notificationList,
  isNotificationLoading,
}) => {
  const history = useHistory();
  const ref = useDetectClickOutside({ onTriggered: handleNotifictionClose });

  function markAsRead(notification) {
    if (notification?.data?.project_uid) {
      markNotificationAsRead(notification.uuid)
        .then((res) => { })
        .catch(() => { });
      history.push(
        `/project-details/${notification?.data?.project_uid ? notification.data.project_uid : ""
        }`
      );
      handleNotifictionClose();
    }
  }

  return (
    <div
      ref={ref}
      className="w-screen md:w-1/4 h-screen md:h-auto md:border border-primary-500  bg-light dark:bg-dark-background rounded-xl absolute top-16 right-[-44px] md:right-20 z-20 px-4 pb-2"
    >
      <div className="mt-4 txtblack dark:text-white">
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
              <div className="w-3/4 txtblack dark:text-white text-sm cursor-pointer">
                <p className="ml-2">{notification?.data?.project_name}</p>
                <p>
                  <small className="ml-2">{notification?.data?.message}</small>
                </p>
              </div>
              <div className="w-1/4 text-right">
                <i className="fa fa-angle-right text-primary-900"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isNotificationLoading && (
        <div className="text-center my-4">
          <i className="fa fa-spinner fa-pulse fa-fw text-primary-900"></i>
        </div>
      )}
    </div>
  );
};
export default NotificatioMenu;
