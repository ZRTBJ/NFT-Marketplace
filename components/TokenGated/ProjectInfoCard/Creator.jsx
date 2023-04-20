import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import thumbIcon from 'assets/images/profile/card.svg';
import SocialLink from 'components/Commons/SocialLink';
import SettingModal from 'components/TokenGated/Modal/Setting';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'react-share';
import FB from 'assets/images/facebook.svg';
import twitter from 'assets/images/twitter.svg';
import reddit from 'assets/images/reddit.svg';

export default function Creator({ project, createMode, settingSaved, userId }) {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  const hostURL = `${origin}`;
  const publicDetailsLink = `${hostURL}/token-gated/public/${project?.slug}/${project?.id}`;
  const [showSettingModal, setShowSettingModal] = useState(false);

  const onSettingClick = async () => {
    setShowSettingModal(true);
  };
  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(publicDetailsLink);
    }
    toast.success(`Link successfully copied`);
  };
  return (
    <>
      <div className='flex flex-wrap gap-4 items-start md:border  rounded md:p-4'>
        <div className='flex flex-wrap items-start gap-4'>
          <div>
            <Image
              className='h-[81px] w-[81px] rounded object-cover'
              src={project?.coverUrl ? project?.coverUrl : thumbIcon}
              alt='token gated project logo'
              width={81}
              height={81}
              unoptimized
            />
          </div>
          <div>
            <p className='text-[18px] text-txtblack font-black'>
              {project?.title ? project?.title : 'Unnamed Project'}
            </p>
            {userId && (
              <div className='my-2 md:flex align-items-center pr-2'>
                <div className='w-[calc(100vw-20px)] md:w-[450px] truncate block'>
                  <span className='textSubtle font-bold'>Project Link: </span>

                  <span className='ml-2'>
                    <Link href={`${publicDetailsLink}`} rel='noreferrer'>
                      {publicDetailsLink}
                    </Link>
                  </span>
                </div>
                <i
                  className='fa-regular fa-copy text-lg cursor-pointer text-primary-900 md:ml-2 mt-2 md:mt-0'
                  onClick={() => copyToClipboard()}
                ></i>
              </div>
            )}
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
            className='outlined-button w-[120px] text-center !px-0  cursor-pointer font-satoshi-bold'
          >
            <span className='gradient-text'>Edit</span>
          </button>
          {userId && (
            <>
              <div className='flex items-center gap-y-4 mt-4'>
                <FacebookShareButton url={publicDetailsLink} quote={'NFT'}>
                  <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[35px] w-[35px] flex items-center justify-center mr-2'>
                    <Image height={16} width={16} src={FB} alt='facebook' />
                  </div>
                </FacebookShareButton>
                <TwitterShareButton url={publicDetailsLink}>
                  <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[35px] w-[35px] flex items-center justify-center mr-2'>
                    <Image height={16} width={16} src={twitter} alt='twitter' />
                  </div>
                </TwitterShareButton>
                <RedditShareButton url={publicDetailsLink}>
                  <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[35px] w-[35px] flex items-center justify-center'>
                    <Image height={16} width={16} src={reddit} alt='reddit' />
                  </div>
                </RedditShareButton>
              </div>
            </>
          )}
        </div>
      </div>
      {showSettingModal && (
        <SettingModal
          show={showSettingModal}
          handleClose={() => setShowSettingModal(false)}
          projectInfo={project}
          createMode={createMode}
          settingSaved={settingSaved}
          userId={userId}
        />
      )}
    </>
  );
}
