import React, { useState } from 'react';
import Image from 'next/image';
import thumbIcon from 'assets/images/profile/card.svg';
import SocialLink from 'components/Commons/SocialLink';
import { useSelector } from 'react-redux';
import ReportModal from 'components/Commons/ReportModal/ReportModal';

export default function PublicProjectInfoCard({ project, userId }) {
  const userinfo = useSelector((state) => state.user.userinfo);
  const [showReportModal, setShowReportModal] = useState(false);
  const [alreadyReported, setAlreadyReported] = useState(
    project?.is_scam_reported
  );
  return (
    <>
      <div className='my-4 md:my-10'>
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6`}>
          <div className='md:order-last col-span-2'>
            {project?.photoUrl && (
              <Image
                src={project?.photoUrl}
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
              src={project?.coverUrl ? project?.coverUrl : thumbIcon}
              height={100}
              width={100}
              alt='cover'
              className='w-[100px] h-[100px] object-cover rounded'
              unoptimized
            ></Image>
            <div className='mt-5 text-textSubtle font-bold text-[24px] leading-8'>
              {project?.title}
            </div>
            <div className='mt-5 text-txtblack font-black text-[30px] leading-relaxed leading-10'>
              {project?.headline}
            </div>
            <div className='mt-5'>
              <SocialLink links={project?.links} forTokenGated={true} />
            </div>
            <div className='mt-5'>
              {userinfo?.id && !alreadyReported && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className='py-2 px-4 rounded text-danger-1 border-danger-1 border'
                >
                  Report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showReportModal && (
        <ReportModal
          show={showReportModal}
          handleClose={() => setShowReportModal(false)}
          usedFor='Token Gated Project'
          id={project?.id}
          onReported={() => setAlreadyReported(true)}
        />
      )}
    </>
  );
}
