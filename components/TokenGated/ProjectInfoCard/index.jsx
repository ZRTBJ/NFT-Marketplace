import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import thumbIcon from 'assets/images/profile/card.svg';
import SocialLink from 'components/Commons/SocialLink';
import SettingModal from 'components/TokenGated/Modal/Setting';
export default function ProjectInfoCard({ project, createMode }) {
  const [showSettingModal, setShowSettingModal] = useState(false);
  const onSettingClick = async () => {
    setShowSettingModal(true);
  };
  return (
    <>
      <div className='flex flex-wrap gap-4 items-start border border-divider rounded p-4'>
        <div className='flex flex-wrap items-start gap-4'>
          <div>
            <Image
              className='h-[81px] w-[81px] rounded object-cover'
              src={thumbIcon}
              alt='token gated project logo'
              width={81}
              height={81}
            />
          </div>
          <div>
            <p className='text-[18px] text-txtblack font-black'>
              {project?.name ? project?.name : 'Unnamed Project'}
            </p>
            <p className='text-textSubtle text-[12px] w-full md:max-w-[471px]'>
              {project?.description
                ? project?.description
                : 'Add description about this project so that people can understand more easily'}
            </p>
            <div className='mt-3'>
              <SocialLink links={project?.links} forTokenGated={true} />
            </div>
          </div>
        </div>
        <div className='md:ml-auto'>
          <button
            onClick={() => onSettingClick()}
            className='py-2 px-4 border  border-divider text-txtblack  font-bold rounded'
          >
            <i className='fa-solid fa-gear mr-2'></i>
            Setting
          </button>
        </div>
      </div>
      {showSettingModal && (
        <SettingModal
          show={showSettingModal}
          handleClose={() => setShowSettingModal(false)}
          projectInfo={project}
          createMode={createMode}
        />
      )}
    </>
  );
}
