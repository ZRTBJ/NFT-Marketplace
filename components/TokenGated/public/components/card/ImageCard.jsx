import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function ImageCard({ content }) {
  const userinfo = useSelector((state) => state.user.userinfo);
  const createdAt = moment(content?.created_at);
  return (
    <div>
      {!userinfo?.id || content?.sensitive.toString() === 'true' ? (
        <>
          <div className='w-full bg-black-shade-900 rounded min-h-[240px]'>
            <div className='flex flex-wrap items-center gap-2 px-2 pt-2 text-white text-[12px]'>
              <div className='bg-danger-1 py-1 px-3 rounded'>18+</div>
              {content?.config_names && content?.config_names?.length > 0 && (
                <>
                  {content?.config_names.slice(0, 2)?.map((c, index) => (
                    <div key={index}>
                      <div className='bg-textSubtle py-1 px-3 rounded w-[60px] truncate'>
                        {c}
                      </div>
                    </div>
                  ))}
                  <div className='bg-textSubtle py-1 px-3 rounded  truncate'>
                    +{content?.config_names.length - 2}
                  </div>
                </>
              )}
            </div>
            <div className='flex items-center justify-center my-16'>
              <i className='fa-solid fa-lock text-[34px] text-white'></i>
            </div>
            <div className='flex gap-2 px-2 pt-6 text-white text-[12px] pb-3'>
              <div className='ml-auto  py-1 px-3 rounded  truncate'></div>
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center justify-between'>
              <p className='text-txtblack text-[18px] font-black w-[95%] truncate'>
                <Link
                  href={`/token-gated/content/${content?.id}`}
                  className='!no-underline !text-txtblack'
                >
                  {content?.title}
                </Link>
              </p>
              <i className='fa-solid fa-ellipsis-vertical cursor-pointer'></i>
            </div>
            <div className='mt-2 flex items-center gap-2'>
              {content?.status === 'draft' ? (
                <span className='text-[12px] text-txtSubtle'>
                  Not Published yet
                </span>
              ) : (
                <span className='text-[12px] text-txtSubtle'>
                  Created On: {createdAt.fromNow()}
                </span>
              )}
              <span>-</span>
              <span className='text-[12px] text-txtSubtle'>
                {content?.view_count} VIEWS
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='w-full bg-black-shade-900 rounded min-h-[240px]'>
            <div className='flex flex-wrap items-center gap-2 px-2 pt-2 text-white text-[12px]'>
              {content?.config_names && content?.config_names?.length > 0 && (
                <>
                  {content?.config_names.slice(0, 2)?.map((c, index) => (
                    <div key={index}>
                      <div className='bg-textSubtle py-1 px-3 rounded w-[60px] truncate'>
                        {c}
                      </div>
                    </div>
                  ))}
                  <div className='bg-textSubtle py-1 px-3 rounded  truncate'>
                    +{content?.config_names.length - 2}
                  </div>
                </>
              )}
            </div>
            <div className='flex items-center justify-center  my-16'>
              <i className='fa-solid fa-lock text-[34px] text-white'></i>
            </div>
            <div className='flex gap-2 px-2 pt-2 text-white text-[12px] pb-3'>
              <div className='ml-auto bg-textSubtle py-1 px-3 rounded w-[60px] truncate'>
                05:10
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center justify-between'>
              <p className='text-txtblack text-[18px] font-black w-[95%] truncate'>
                <Link
                  href={`/token-gated/content/${content?.id}`}
                  className='!no-underline !text-txtblack'
                >
                  {content?.title}
                </Link>
              </p>
              <i className='fa-solid fa-ellipsis-vertical cursor-pointer'></i>
            </div>
            <div className='mt-2 flex items-center gap-2'>
              {content?.status === 'draft' ? (
                <span className='text-[12px] text-txtSubtle'>
                  Not Published yet
                </span>
              ) : (
                <span className='text-[12px] text-txtSubtle'>
                  Created On: {createdAt.fromNow()}
                </span>
              )}
              <span>-</span>
              <span className='text-[12px] text-txtSubtle'>
                {content?.view_count} VIEWS
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
