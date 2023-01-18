import React from 'react';
import Image from 'next/image';
import thumbIcon from 'assets/images/profile/card.svg';
import SocialLink from 'components/Commons/SocialLink';
export default function PublicProjectInfoCard({ project, userId }) {
  return (
    <div className='my-4 md:my-10 px-4 md:px-0'>
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6`}>
        <div className='md:order-last col-span-2'>
          {project?.coverUrl && (
            <Image
              src={project?.coverUrl}
              height={415}
              width={907}
              alt='cover'
              className='w-full  h-[200px] md:h-[415px] object-cover rounded'
              unoptimized
            ></Image>
          )}
        </div>
        <div className=''>
          <Image
            src={project?.photoUrl ? project?.photoUrl : thumbIcon}
            height={100}
            width={100}
            alt='cover'
            className='w-[100px] h-[100px] object-cover rounded'
            unoptimized
          ></Image>
          <p className='mt-5 text-textSubtle font-bold text-[24px]'>
            {project?.title}
          </p>
          <p className='mt-5 text-txtblack font-black text-[30px] leading-relaxed'>
            {project?.headline}
          </p>
          <div className='mt-5'>
            <SocialLink links={project?.links} forTokenGated={true} />
          </div>
          <div className='mt-5'>
            {userId && (
              <button className='py-2 px-4 rounded text-danger-1 border-danger-1 border'>
                Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
