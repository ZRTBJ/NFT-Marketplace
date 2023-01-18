import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Image from 'next/image';
import playIcon from 'assets/images/token-gated/audioPlay.png';
export default function VideoCard({ content }) {
  const userinfo = useSelector((state) => state.user.userinfo);
  const createdAt = moment(content?.created_at);
  const [showPoster, setShowPoster] = useState(true);
  const [duration, setDuration] = useState(0);
  const video_link =
    'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
  const thumbnail =
    'https://storage.googleapis.com/apollo_creabo_dev/tokengate/336a96cf-e968-4758-b8bf-79dae45a2846/img1.png?v=1673995247';
  const onPlay = () => {
    setShowPoster(false);
  };
  const onPause = () => {
    setShowPoster(true);
  };
  const onClickPoster = async () => {
    if (typeof window !== 'undefined') {
      const video = document.getElementById(`bVideo-${content?.id}`);
      setShowPoster(false);
      video.play();
    }
  };
  const durationFormat = (s) => {
    let m = Math.floor(s / 60);
    m = m >= 10 ? m : '0' + m;
    s = Math.floor(s % 60);
    s = s >= 10 ? s : '0' + s;
    return m + ':' + s;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const video = document.getElementById(`bVideo-${content?.id}`);
      if (video) {
        video.addEventListener('loadeddata', () => {
          if (video.readyState >= 4) {
            setDuration(durationFormat(video.duration));
          }
        });
      }
    }
  }, []);

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
                  {content?.config_names &&
                    content?.config_names.length > 2 && (
                      <div className='bg-textSubtle py-1 px-3 rounded  truncate'>
                        +{content?.config_names.length - 2}
                      </div>
                    )}
                </>
              )}
            </div>
            <div className='flex items-center justify-center my-16'>
              <i className='fa-solid fa-lock text-[34px] text-white cursor-pointer'></i>
            </div>
            <div className='flex gap-2 px-2 pt-2 text-white text-[12px] pb-3'>
              <div className='ml-auto bg-textSubtle py-1 px-3 rounded  truncate'>
                <i className='fa-light fa-clock mr-1'></i> 05:10
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
      ) : (
        <>
          <div className='relative'>
            <video
              className={`h-[240px] w-full object-cover rounded`}
              id={`bVideo-${content?.id}`}
              controls
              onPlay={() => onPlay()}
              onPause={() => onPause()}
            >
              <source
                src='https://www.w3schools.com/html/mov_bbb.mp4'
                type='video/mp4'
              />
            </video>
            {showPoster && (
              <div
                id={`${content?.id}`}
                className={`h-[240px] absolute w-full m-auto top-0 bottom-0 left-0 right-0 block  rounded`}
              >
                <Image
                  src={`https://storage.googleapis.com/apollo_creabo_dev/tokengate/336a96cf-e968-4758-b8bf-79dae45a2846/img1.png?v=1673995247`}
                  height={240}
                  width={240}
                  alt='poster'
                  className={`h-full w-full rounded object-cover relative`}
                  unoptimized
                ></Image>
                <div className='absolute top-0 left-0'>
                  <div className='flex flex-wrap items-center gap-2 px-2 pt-2 text-white text-[12px]'>
                    {content?.config_names &&
                      content?.config_names?.length > 0 && (
                        <>
                          {content?.config_names
                            .slice(0, 2)
                            ?.map((c, index) => (
                              <div key={index}>
                                <div className='bg-textSubtle py-1 px-3 rounded w-[60px] truncate'>
                                  {c}
                                </div>
                              </div>
                            ))}
                          {content?.config_names &&
                            content?.config_names.length > 2 && (
                              <div className='bg-textSubtle py-1 px-3 rounded  truncate'>
                                +{content?.config_names.length - 2}
                              </div>
                            )}
                        </>
                      )}
                  </div>
                </div>
                <Image
                  onClick={() => onClickPoster()}
                  src={playIcon}
                  className='absolute m-auto top-0 bottom-0 right-0 left-0 object-fit  h-[50px] w-[50px] block cursor-pointer'
                  height={50}
                  width={50}
                  unoptimized
                  alt='play png'
                ></Image>
                <div className='absolute bottom-0 right-0'>
                  <div className='flex gap-2 px-2 pt-2 text-white text-[12px] pb-3'>
                    <div className='ml-auto bg-textSubtle py-1 px-3 rounded  truncate'>
                      <i className='fa-light fa-clock mr-1'></i> {duration}
                    </div>
                  </div>
                </div>
              </div>
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
                {content?.view_count} VIEWS
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
