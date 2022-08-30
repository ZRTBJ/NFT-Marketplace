import Modal from "../Modal";
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
      overflow="scroll"
      height={650}
    >
      <div className=" mt-2">
        <h2>Congratulation!</h2>
        <p className="mb-4 mt-3 text-textSubtle">
          You have successfully purchase the{" "}
          <span className="font-black">{nftName}</span> from{" "}
          <span className="font-black">{collectionName}</span>
        </p>
        <img
          src={assetUrl}
          alt="asset"
          className=" h-[443px] w-[443px] rounded-[12px] object-cover"
        />
        <div className="text-center mt-4 mb-6">
          <p className="text-[18px] text-txtblack">
            You successfully purchase{" "}
            <span className="font-black">{nftName}</span>
          </p>
        </div>
        <div className="mb-6">
          <div className="flex flex-wrap items-center border-b-[1px] border-b-[#C7CEE6] pb-3">
            <p className="font-black text-[14px]">status</p>
            <p className=" ml-auto text-[14px]">{transactionHash}</p>
          </div>
          <div className="mt-4  flex flex-wrap items-center">
            <p className="font-black text-[14px]">Processing</p>
            <p className=" ml-auto text-[14px]">{address}</p>
          </div>
        </div>
        <div className="mt-3 mb-4 text-center">
          <p className="mb-5">Share on</p>
          <div className="flex items-center justify-center">
            <FacebookShareButton url={shareUrl} quote={"NFT"}>
              <div className="cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2">
                <img src={FB} alt="facebook" />
              </div>
            </FacebookShareButton>
            <TwitterShareButton title="NFT" url={shareUrl}>
              <div className="cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2">
                <img src={twitter} alt="twitter" />
              </div>
            </TwitterShareButton>
            <RedditShareButton title="NFT" url={shareUrl}>
              <div className="cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center">
                <img src={reddit} alt="reddit" />
              </div>
            </RedditShareButton>
            {/* <div className='cursor-pointer rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                    <img src={instagram} alt='instagram' />
                  </div> */}
          </div>
        </div>
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
