import { useDetectClickOutside } from 'react-detect-click-outside';
import { useRouter } from 'next/router';
import { markNotificationAsRead } from 'services/notification/notificationService';

const NotificatioMenu = ({
  handleNotifictionClose,
  notificationList,
  isNotificationLoading,
}) => {
  const router = useRouter();
  const ref = useDetectClickOutside({ onTriggered: handleNotifictionClose });

  function markAsRead(notification) {
    if (notification?.data?.project_uid) {
      markNotificationAsRead(notification.uuid)
        .then((res) => {})
        .catch(() => {});
      router.push(
        `/project-details/${
          notification?.data?.project_uid ? notification.data.project_uid : ''
        }`
      );
      handleNotifictionClose();
    }
  }

  return (
    <div
      ref={ref}
      className='w-screen md:w-1/4 max-h-[450px] overflow-y-auto md:h-auto md:border border-slate-300  bg-[#fff] rounded-xl absolute top-16 right-[-44px] md:right-20 z-20 pb-2'
    >
      <div className='mt-4 txtblack px-4'>
        <h3>Notifications</h3>
      </div>
      <div className='grid grid-cols-1 divide-y divide-slate-300 px-4'>
        {notificationList.map((notification, index) => (
          <div className='py-3 px-2' key={`user-notification-${index}`}>
            <div
              className='flex items-center'
              onClick={() => markAsRead(notification)}
              onTouchStart={() => markAsRead(notification)}
            >
              <div className='w-3/4 txtblack text-sm cursor-pointer'>
                <p className='ml-2'>{notification?.data?.project_name}</p>
                <p>
                  <small className='ml-2'>{notification?.data?.message}</small>
                </p>
              </div>
              <div className='w-1/4 text-right'>
                <i className='fa fa-angle-right text-[#199BD8]'></i>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isNotificationLoading && (
        <div className='text-center my-4'>
          <i className='fa fa-spinner fa-pulse fa-fw text-primary-900'></i>
        </div>
      )}
    </div>
  );
};
export default NotificatioMenu;
