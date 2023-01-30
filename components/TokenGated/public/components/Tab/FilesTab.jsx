import React, { useEffect, useState } from 'react';
import Spinner from 'components/Commons/Spinner';
import { getContentList } from 'services/tokenGated/tokenGatedService';
import emptyStateCommon from 'assets/images/profile/emptyStateCommon.svg';
import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroll-component';
import FileCard from '../card/FileCard';
import { uniqBy } from 'lodash';
export default function FilesTab({ project, sortBy }) {
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    id: project?.id,
    page: 1,
    orderBy: sortBy ? sortBy : 'newer',
    file_type: 'other',
    limit: 10,
  });
  const [list, setList] = useState([]);
  const onContentListGet = async () => {
    setLoading(true);
    await getContentList(payload)
      .then((res) => {
        setLoading(false);
        if (res.code === 0) {
          let oldList = [...list];
          const mergedList = oldList.concat(res.data);
          const uniqList = uniqBy(mergedList, function (e) {
            return e.id;
          });
          setList(uniqList);
          if (res?.data?.length === 0) {
            setHasMore(false);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const fetchData = async () => {
    let oldPayload = { ...payload };
    oldPayload.page = oldPayload.page + 1;
    setPayload(oldPayload);
  };
  useEffect(() => {
    if (project?.id) {
      onContentListGet();
    }
  }, [payload]);

  return (
    <>
      <div>
        {list?.length === 0 && !isLoading && (
          <div className='text-center text-textSubtle'>
            <Image
              src={emptyStateCommon}
              className='h-[210px] w-[315px] m-auto'
              alt=''
              width={315}
              height={210}
            />
            <p className='text-textSubtle'>No Contents Found!</p>
          </div>
        )}
        {list?.length > 0 && (
          <InfiniteScroll
            dataLength={list.length} //This is important field to render the next data
            next={fetchData}
            hasMore={hasMore}
            scrollThreshold='300px'
            endMessage={
              <div className='pt-10 text-center'>
                <p className='text-txtSubtle text-[14px]'>
                  No more contents! You have seen it all
                </p>
              </div>
            }
          >
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'>
              {list?.map((content, index) => (
                <div key={index}>
                  {content?.file_type === 'other' && (
                    <FileCard content={content} projectId={project?.id} />
                  )}
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
      {isLoading && (
        <div className='text-center mt-10 px-4'>
          <Spinner />
        </div>
      )}
    </>
  );
}
