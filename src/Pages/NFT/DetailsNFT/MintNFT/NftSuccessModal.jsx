import Modal from "components/Commons/Modal";
import FB from "assets/images/facebook.svg";
import twitter from "assets/images/twitter.svg";
import reddit from "assets/images/reddit.svg";
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from "react-share";
const NftSuccessModal = ({
  handleClose,
  show,
  nftName,
  collectionName,
  assetUrl,
  transactionHash,
  address,
  shareUrl,
  handleNext,
}) => {
  return (
    <Modal
      width={532}
      show={show}
      handleClose={() => handleClose(false)}
      showCloseIcon={true}
      overflow="auto"
      height={750}
    >
      <div>
        <div className="font-black text-[24px] md:text-[42px]">
          Congratulation!
        </div>
        <p className="mb-4 mt-3 text-textSubtle">
          You have successfully purchased the{" "}
          <span className="font-black">{nftName}</span> from{" "}
          <span className="font-black">{collectionName}</span>
        </p>
        <img
          src={assetUrl}
          alt="asset"
          className="h-[150px] mx-auto w-[320px] md:h-[380px]  md:w-[380px] rounded-[12px] object-contain"
        />
        <div className="text-center mt-4 mb-6">
          <p className="text-[18px] text-txtblack">
            You successfully purchased{" "}
            <span className="font-black">{nftName}</span>
          </p>
        </div>
        <div className="mb-6">
          <div className="flex flex-wrap items-center border-b-[1px] border-b-[#C7CEE6] pb-3">
            <p className="font-black text-[14px]">Status</p>
            <p className=" ml-auto text-[14px]">Mined</p>
          </div>
          <div className="mt-4  md:flex flex-wrap items-center">
            <p className="font-black text-[14px]">Transaction Hash</p>
            <p className=" ml-auto text-[14px]">{transactionHash}</p>
          </div>
        </div>

        {shareUrl && (
          <div className="mt-3 mb-4 text-center">
            <p className="mb-5">Share on</p>
            <div className="flex items-center justify-center">
              <FacebookShareButton url={`${origin}/${shareUrl}`} quote={"NFT"}>
                <div className="cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2">
                  <img src={FB} alt="facebook" />
                </div>
              </FacebookShareButton>
              <TwitterShareButton title="NFT" url={`${origin}/${shareUrl}`}>
                <div className="cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2">
                  <img src={twitter} alt="twitter" />
                </div>
              </TwitterShareButton>
              <RedditShareButton title="NFT" url={`${origin}/${shareUrl}`}>
                <div className="cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center">
                  <img src={reddit} alt="reddit" />
                </div>
              </RedditShareButton>
              {/* <div className='cursor-pointer rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                    <img src={instagram} alt='instagram' />
                  </div> */}
            </div>
          </div>
        )}
        <button
          className="w-full font-bold mt-6 text-[16px] h-[44px] bg-primary-50 text-primary-900 "
          onClick={handleClose}
        >
          Finish
        </button>
      </div>
    </Modal>
  );
};

export default NftSuccessModal;
