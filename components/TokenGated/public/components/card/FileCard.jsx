import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useRouter } from 'next/router';

export default function FileCard({ content }) {
  const router = useRouter();
  const userinfo = useSelector((state) => state.user.userinfo);
  const createdAt = moment(content?.created_at);
  const lockIcon = (
    <div className='absolute  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'>
      <i className='fa-solid fa-lock text-[34px]  cursor-pointer '></i>
    </div>
  );

  return (
    <>
      <div
        className='relative cursor-pointer'
        onClick={() => router.push(`/token-gated/content/${content?.id}`)}
        style={{
          backgroundColor: 'rgba(18, 36, 120, 0.05)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '240px',
          width: '100%',
        }}
      >
        <div className='flex flex-wrap items-center gap-2 px-2 pt-2 text-white text-[12px]'>
          {content?.sensitive && (
            <div className='bg-danger-1 py-1 px-3 rounded'>18+</div>
          )}
          {content?.config_names && content?.config_names?.length > 0 && (
            <>
              {content?.config_names.slice(0, 2)?.map((c, index) => (
                <div key={index}>
                  <div className='bg-textSubtle py-1 px-3 rounded  truncate'>
                    {c}
                  </div>
                </div>
              ))}
              {content?.config_names && content?.config_names?.length > 2 && (
                <div className='bg-textSubtle py-1 px-3 rounded  truncate'>
                  +{content?.config_names?.length - 2}
                </div>
              )}
            </>
          )}
        </div>
        {content?.consumable_data ? (
          <i class='text-[34px] absolute  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 fa-solid fa-file'></i>
        ) : (
          lockIcon
        )}
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
            {content?.view_count} Views
          </span>
        </div>
      </div>
    </>
  );
}
