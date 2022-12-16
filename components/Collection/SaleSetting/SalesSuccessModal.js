import Modal from 'components/Commons/Modal';
import FB from 'assets/images/facebook.svg';
import twitter from 'assets/images/twitter.svg';
import reddit from 'assets/images/reddit.svg';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'react-share';
import Lottie from 'react-lottie';
import lottieJson from 'assets/lottieFiles/sales-setting-success';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const SalesSuccessModal = ({
  handleClose,
  show,
  nftShareURL,
  projectId,
  membershipNFTId,
}) => {
  const [iframeContent, setIframeContent] = useState('');
  const [isTextCopied, setIsTextCopied] = useState(false);
  const copyRef = useRef(null);
  let host = window.location.origin;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieJson,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  useEffect(() => {
    if (membershipNFTId) {
      setIframeContent(
        `<iframe src='${host}/embed-nft/membership/${membershipNFTId}' width='274px' height='477px' style="border:none" title='NFT'></iframe>`
      );
    }
  }, [host, membershipNFTId]);

  const router = useRouter();

  const copyToClipboardShare = (text) => {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-share-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
  };

  const handleNavigatetoDao = () => {
    router.push(`/dao/${projectId}`);
    handleClose();
  };

  const copyToClipboard = (e) => {
    copyRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    setIsTextCopied(true);
    setTimeout(() => {
      setIsTextCopied(false);
    }, 2000);
  };

  return (
    <Modal
      width={400}
      show={show}
      handleClose={() => handleClose(false)}
      showCloseIcon={true}
      overflow='auto'
    >
      <div>
        <div className='text-center'>
          <Lottie options={defaultOptions} height={150} width={150} />
          <p className='text-[16px] font-black mt-2'>
            Your Sales Page are set!
          </p>
          <p className='text-[14px] text-[#5F6479] mt-1 break-normal'>
            Your collections are set to sale. it’s already listed in the
            platform that you choose!
          </p>
        </div>

        <div className='relative w-fit mx-auto my-3'>
          <p
            className='text-[14px] inline-block md:max-w-[320px] max-w-[260px] py-[10px] pl-[15px] pr-[40px]  text-primary-900 bg-primary-50 w-full rounded-[12px]'
            id='iframe'
          >
            <span className='font-black truncate block'>{nftShareURL}</span>
          </p>
          <div className='text-primary-900 absolute top-2 right-2'>
            <i
              className='fa fa-copy text-lg cursor-pointer'
              onClick={() => copyToClipboardShare(`${nftShareURL}`)}
            ></i>
          </div>
          <p
            id='copied-share-message'
            className='hidden text-green-500 text-[14px] text-center'
          >
            Copied Successfully!
          </p>
        </div>

        {membershipNFTId ? (
          <div className='mt-2'>
            <textarea
              className='text-[14px] block mb-3 py-[10px] pl-[15px] pr-[15px] bg-[#122478] bg-opacity-[0.1] text-[#9499ae] w-full rounded-[12px]'
              id='iframe'
              name='iframe'
              ref={copyRef}
              value={iframeContent}
            />
            <div className='text-center mt-5 relative'>
              <button
                onClick={copyToClipboard}
                className='bg-primary-100 text-primary-900 py-2 px-3 rounded-[4px] text-[14px] font-black'
              >
                Copy Embed Code
              </button>
              {isTextCopied && (
                <p className=' text-green-500 text-[14px] text-center'>
                  Copied Successfully!
                </p>
              )}
            </div>
          </div>
        ) : null}

        {nftShareURL && (
          <div className='mt-3 mb-4 text-center'>
            <p className='mb-2 text-[14px]'>Share on Social Media</p>
            <div className='flex items-center justify-center'>
              <FacebookShareButton url={`${nftShareURL}`} quote={'NFT'}>
                <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[34px] w-[34px] flex items-center justify-center mr-2'>
                  <Image src={FB} alt='facebook' />
                </div>
              </FacebookShareButton>
              <TwitterShareButton title='NFT' url={`${nftShareURL}`}>
                <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[34px] w-[34px] flex items-center justify-center mr-2'>
                  <Image src={twitter} alt='twitter' />
                </div>
              </TwitterShareButton>
              <RedditShareButton title='NFT' url={`${nftShareURL}`}>
                <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[34px] w-[34px] flex items-center justify-center'>
                  <Image src={reddit} alt='reddit' />
                </div>
              </RedditShareButton>
            </div>
          </div>
        )}
        <button
          className='w-[200px] mx-auto block contained-button font-bold mt-2 text-[16px] h-[44px]'
          onClick={handleNavigatetoDao}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default SalesSuccessModal;
