import Modal from 'components/Commons/Modal';
import FB from 'assets/images/facebook.svg';
import twitter from 'assets/images/twitter.svg';
import reddit from 'assets/images/reddit.svg';
import { NETWORKS } from 'config/networks';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'react-share';
import { walletAddressTruncate } from 'util/WalletUtils';
import Image from 'next/image';
const NftSuccessModal = ({
  handleClose,
  show,
  nftName,
  collectionName,
  assetUrl,
  transactionHash,
  shareUrl,
  handleNext,
  mintData,
  nftId,
  tokenId,
}) => {
  const origin = window.location.origin;
  const copyToClipboardShare = (text) => {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-share-message-success');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
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
        <div className='font-black text-[16px] mx-auto'>Congratulation!</div>
        <p className='mb-4 mt-3 text-[14px] text-textSubtle'>
          You have successfully purchased the{' '}
          <span className='font-black'>{nftName}</span> from{' '}
          <span className='font-black'>{collectionName}</span>
        </p>
        <Image
          unoptimized
          src={assetUrl}
          alt='asset'
          height={150}
          width={150}
          className='h-[120px] mx-auto w-full max-w-[250px] md:h-[150px]  md:w-full rounded-[12px] object-cover'
        />
        <div className='mb-1 mt-2'>
          <div className='flex flex-wrap items-center border-b-[1px] border-b-[#C7CEE6]'>
            <p className='font-black text-[14px]'>Status</p>
            <p className=' ml-auto text-[14px]'>Minted</p>
          </div>
          <div className='md:flex flex-wrap items-center'>
            <p className='font-black text-[14px]'>Transaction Hash</p>
            <div className='ml-auto text-[14px] relative min-w-[200px] text-right'>
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='no-underline'
                href={`${
                  NETWORKS[mintData?.function?.blockchain]?.viewTxUrl
                }${transactionHash}`}
              >
                {walletAddressTruncate(transactionHash)}
              </a>
              <i
                className='fa fa-copy text-md cursor-pointer text-primary-900 ml-2'
                onClick={() => copyToClipboardShare(transactionHash)}
              ></i>
              <p
                id='copied-share-message-success'
                className='hidden text-green-500 text-[14px] text-right absolute top-4 right-0 word-break'
              >
                Copied Successfully!
              </p>
            </div>
          </div>
        </div>

        <div className='mt-2 mb-1 text-center'>
          <p className='mb-2'>Share on</p>
          <div className='flex items-center justify-center'>
            <FacebookShareButton
              url={`${origin}/minted-nft-details/${nftId}/${tokenId}`}
            >
              <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[34px] w-[34px] flex items-center justify-center mr-2'>
                <Image height={34} width={34} src={FB} alt='facebook' />
              </div>
            </FacebookShareButton>
            <TwitterShareButton
              url={`${origin}/minted-nft-details/${nftId}/${tokenId}`}
            >
              <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[34px] w-[34px] flex items-center justify-center mr-2'>
                <Image height={34} width={34} src={twitter} alt='twitter' />
              </div>
            </TwitterShareButton>
            <RedditShareButton
              url={`${origin}/minted-nft-details/${nftId}/${tokenId}`}
            >
              <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[34px] w-[34px] flex items-center justify-center'>
                <Image height={34} width={34} src={reddit} alt='reddit' />
              </div>
            </RedditShareButton>
          </div>
        </div>
        <button
          className='w-[200px]  mx-auto block font-bold mt-4 text-[16px] h-[44px] bg-primary-50 text-primary-900 '
          onClick={handleClose}
        >
          Finish
        </button>
      </div>
    </Modal>
  );
};

export default NftSuccessModal;
