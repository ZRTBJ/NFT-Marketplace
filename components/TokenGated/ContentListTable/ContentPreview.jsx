import { useState } from 'react';
import { ls_GetUserToken } from 'util/ApplicationStorage';
import defaultThumbnail from 'assets/images/profile/card.svg';
import Config from 'config/config';
import Image from 'next/image';

const ROOT_URL = Config.API_ENDPOINT;

export default function ContentPreview({ content }) {
  const contentUrl = `${ROOT_URL}/tkg-content/${
    content?.id
  }/data?token=${ls_GetUserToken()}`;
  const [imageSrc, setImageSrc] = useState(
    content?.thumbnail ? content?.thumbnail : contentUrl
  );

  return (
    <>
      {content?.file_type === 'image' && (
        <>
          {content?.thumbnail ? (
            <Image
              unoptimized
              width={36}
              height={36}
              alt='token gated content image'
              className='w-9 h-9 object-cover rounded-md'
              src={imageSrc}
              onError={() => setImageSrc(defaultThumbnail.src)}
            ></Image>
          ) : content?.consumable_data ? (
            <Image
              unoptimized
              width={36}
              height={36}
              alt='token gated content image'
              className='w-9 h-9 object-cover rounded-md'
              src={imageSrc}
              onError={() => setImageSrc(defaultThumbnail.src)}
            ></Image>
          ) : (
            <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md'>
              <i className='fa-solid fa-image gradient-text text-[20px]'></i>
            </div>
          )}
        </>
      )}
      {content?.file_type === 'movie' && (
        <>
          {content?.thumbnail ? (
            <Image
              unoptimized
              width={36}
              height={36}
              alt='token gated content image'
              className='w-9 h-9 object-cover rounded-md'
              src={imageSrc}
              onError={() => setImageSrc(defaultThumbnail.src)}
            ></Image>
          ) : (
            <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md'>
              <i className='fa-solid fa-circle-video gradient-text text-[20px]'></i>
            </div>
          )}
        </>
      )}
      {content?.file_type === 'audio' && (
        <>
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md'>
            <i className='fa-solid fa-file-audio gradient-text text-[20px]'></i>
          </div>
        </>
      )}
      {content?.file_type === 'other' && (
        <>
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md'>
            <i className='fa-solid fa-file gradient-text text-[20px]'></i>
          </div>
        </>
      )}
    </>
  );
}
