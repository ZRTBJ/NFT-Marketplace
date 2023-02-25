import { useState, useEffect } from 'react';
import { getUserNotification } from 'redux/user/action';
import { markNotificationAsRead } from 'services/notification/notificationService';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';

const Notifications = () => {
  const [pagination, setPagination] = useState([1, 2]);
  const [isActive, setIsactive] = useState(1);
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.user);
  const router = useRouter();
  const payload = {
    page: 1,
    limit: 10,
  };
  useEffect(() => {
    dispatch(getUserNotification(isActive));
  }, [isActive]);

  useEffect(() => {
    let arr = Array.from({ length: notifications?.pageSize }, (v, k) => k + 1);
    setPagination(arr);
  }, [notifications]);
  function markAsRead(notification) {
    if (notification?.data?.collection_id || notification?.data?.project_uid) {
      markNotificationAsRead(notification.uuid)
        .then((res) => {})
        .catch(() => {});
      if (notification?.type === 'CollectionPublish') {
        router.push(
          `/collection/${
            notification?.data?.collection_id
              ? notification.data.collection_id
              : ''
          }`
        );
      } else if (notification?.type === 'projectPublish') {
        router.push(
          `/dao/${
            notification?.data?.project_uid ? notification.data.project_uid : ''
          }`
        );
      }
    }
  }

  const handlePageClick = (event) => {
    setIsactive(event.selected + 1);
  };

  return (
    <div>
      <div className='grid grid-cols-1 divide-y divide-slate-300 px-0 md:px-4 mx-1 md:mx-4 mt-5'>
        {notifications?.notifications?.map((notification, index) => (
          <div
            className='py-3 px-0 md:px-2 hover:bg-[#ccc]'
            key={`user-notification-${index}`}
          >
            {notification.type === 'projectPublish' ? (
              <div
                className='flex items-center'
                onClick={() => markAsRead(notification)}
                onTouchStart={() => markAsRead(notification)}
              >
                <div className='w-3/4 txtblack text-sm cursor-pointer'>
                  <div className='flex items-center'>
                    <p className='ml-2 text-[16px] md:text-[24px] font-bold border-r-[#000] pr-2 border-r-[1px] capitalize'>
                      {notification?.data?.project_name}
                    </p>
                    <p className='ml-2 text-[16xpx] md:text-[20px] mt-0'>
                      {notification?.title}
                    </p>
                  </div>
                </div>
                <div className='w-1/4 text-right'>
                  <i className='fa fa-angle-right text-[#199BD8]'></i>
                </div>
              </div>
            ) : notification.type === 'CollectionPublish' ? (
              <div
                className='flex items-center'
                onClick={() => markAsRead(notification)}
                onTouchStart={() => markAsRead(notification)}
              >
                <div className='w-3/4 txtblack text-sm cursor-pointer'>
                  <div className='flex items-center'>
                    <p className='ml-2 text-[16px] md:text-[24px] font-bold border-r-[#000] pr-2 border-r-[1px] capitalize'>
                      {notification?.data?.collection_name}
                    </p>
                    <p className='ml-2 text-[16xpx] md:text-[20px] mt-0'>
                      {notification?.title}
                    </p>
                  </div>
                </div>
                <div className='w-1/4 text-right'>
                  <i className='fa fa-angle-right text-[#199BD8]'></i>
                </div>
              </div>
            ) : notification.type === 'NFTMinted' ? (
              <div className='flex items-center'>
                <div className='w-3/4 txtblack text-sm'>
                  <div className='flex items-center'>
                    <p className='ml-2 text-[16px] md:text-[24px] font-bold border-r-[#000] pr-2 border-r-[1px] capitalize'>
                      {notification?.title}
                    </p>
                    <p className='ml-2 text-[16xpx] md:text-[20px] mt-0'>
                      NFT minted successfully
                    </p>
                  </div>
                </div>
              </div>
            ) : notification.type === 'fileUploadTokengatedNotification' ? (
              <div className='flex items-center'>
                <div className='w-3/4 txtblack text-sm'>
                  <div className='flex items-center'>
                    <p className='ml-2 text-[16px] md:text-[24px] font-bold border-r-[#000] pr-2 border-r-[1px] capitalize'>
                      Token Gate File
                    </p>
                    <p className='ml-2 text-[16xpx] md:text-[20px] mt-0'>
                      {notification?.title}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className='flex items-center'
                onClick={() => markAsRead(notification)}
                onTouchStart={() => markAsRead(notification)}
              >
                <div className='w-3/4 txtblack text-sm'>
                  <p className='ml-2 text-[24px]'>{notification?.title}</p>
                </div>
                <div className='w-1/4 text-right'>
                  <i className='fa fa-angle-right text-[#199BD8]'></i>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {pagination.length > 0 && (
        <ReactPaginate
          className='flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6'
          pageClassName='px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack '
          breakLabel='...'
          nextLabel='>'
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pagination.length}
          previousLabel='<'
          renderOnZeroPageCount={null}
          activeClassName='text-primary-900 bg-primary-900 !no-underline'
          activeLinkClassName='!text-txtblack !no-underline'
        />
      )}
    </div>
  );
};

export default Notifications;
