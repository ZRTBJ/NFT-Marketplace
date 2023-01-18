import React, { useEffect, useState } from 'react';
import Spinner from 'components/Commons/Spinner';
import { getContentList } from 'services/tokenGated/tokenGatedService';
import emptyStateCommon from 'assets/images/profile/emptyStateCommon.svg';
import Image from 'next/image';
import VideoCard from '../card/VideoCard';
export default function VideoTab({ project }) {
  const [isLoading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    id: project?.id,
    page: 1,
    orderBy: 'newer',
    file_type: 'movie',
  });
  const [list, setList] = useState([]);
  const onContentListGet = async () => {
    setLoading(true);
    await getContentList(payload)
      .then((res) => {
        setLoading(false);
        if (res.code === 0) {
          setList(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (project?.id) {
      onContentListGet();
    }
  }, [project?.id]);
  return (
    <>
      {isLoading && (
        <div className='text-center mt-10 px-4'>
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <div className='px-4'>
          {list?.length === 0 && (
            <div className='text-center text-textSubtle'>
              <Image
                src={emptyStateCommon}
                className='h-[210px] w-[315px] m-auto'
                alt=''
                width={315}
                height={210}
              />
              <p className='text-textSubtle'>No Items found</p>
            </div>
          )}
          {list?.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {list?.map((content, index) => (
                <div key={index}>
                  {content?.file_type === 'movie' && (
                    <VideoCard content={content} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
