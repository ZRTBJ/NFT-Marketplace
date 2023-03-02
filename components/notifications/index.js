import { useState, useEffect } from 'react';
import { getUserNotification } from 'redux/user/action';
import { markNotificationAsRead } from 'services/notification/notificationService';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import emptyStateCommon from 'assets/images/profile/emptyStateCommon.svg';
import Image from 'next/image';
const Notifications = () => {
  const [pagination, setPagination] = useState([]);
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
    console.log(arr);
    const page = calculatePageCount(15, notifications?.total);
    const pageList = [];
    for (let index = 1; index <= page; index++) {
      pageList.push(index);
    }
    setPagination(pageList);
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
  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };

  return (
    <div className='my-10 mx-4'>
      {notifications?.notifications?.length === 0 ? (
        <div className='p-5 text-center min-h-[100px] text-primary-700'>
          <div className='text-center mt-6 text-textSubtle'>
            <Image
              src={emptyStateCommon}
              className='h-[210px] w-[315px] m-auto'
              alt=''
              height={210}
              width={315}
            />
            <p className='text-subtitle font-bold'>
              You don't have any notification yet
            </p>
          </div>
        </div>
      ) : (
        <div className='w-full  md:max-w-[1000px] mx-auto shadow border rounded-2xl py-6'>
          <div className='text-right'>
            <p className='mr-8'>🔔 Notifications</p>
          </div>
          <div className='grid grid-cols-1  px-0 md:px-4 mx-1 md:mx-4 mt-5 gap-5'>
            {notifications?.notifications?.map((notification, index) => (
              <div
                className=' px-0 md:px-2 hover:bg-[#ccc] border-b mb-2'
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
                        <p className='ml-2 text-[16px]  font-bold border-r-[#000] pr-2 border-r-[1px] capitalize'>
                          {notification?.data?.project_name}
                        </p>
                        <p className='ml-2 text-[16xpx] md:text-[14px] mt-0'>
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
                        <p className='ml-2 text-[16px]  font-bold border-r-[#000] pr-2 border-r-[1px] capitalize'>
                          {notification?.data?.collection_name}
                        </p>
                        <p className='ml-2 text-[16xpx] md:text-[14px] mt-0'>
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
                        <p className='ml-2 text-[16px]  font-bold border-r-[#000] pr-2 border-r-[1px] capitalize'>
                          {notification?.title}
                        </p>
                        <p className='ml-2 text-[16xpx] md:text-[14px] mt-0'>
                          NFT minted successfully
                        </p>
                      </div>
                    </div>
                  </div>
                ) : notification.type === 'fileUploadTokengatedNotification' ? (
                  <div className='flex items-center'>
                    <div className='w-3/4 txtblack text-sm'>
                      <div className='flex items-center'>
                        <p className='ml-2 text-[16px]  font-bold border-r-[#000] pr-2 border-r-[1px] capitalize'>
                          Token Gate File
                        </p>
                        <p className='ml-2 text-[16xpx] md:text-[14px] mt-0'>
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
        </div>
      )}

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
