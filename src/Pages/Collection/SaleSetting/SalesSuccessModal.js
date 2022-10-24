import Modal from "components/Common/Modal";
import FB from "assets/images/facebook.svg";
import twitter from "assets/images/twitter.svg";
import reddit from "assets/images/reddit.svg";
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from "react-share";
import Lottie from "react-lottie";
import lottieJson from "assets/lottieFiles/nft-minting-process";

const SalesSuccessModal = ({ handleClose, show, shareUrl }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieJson,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Modal
      width={532}
      show={show}
      handleClose={() => handleClose(false)}
      showCloseIcon={true}
      overflow="auto"
    >
      <div>
        <div className="text-center">
          {" "}
          <Lottie options={defaultOptions} height={305} width={305} />
          <h1 className="text-[28px] mt-5">Your Sales Page are set!</h1>
          <p className="text-[14px] text-[#5F6479] mt-5 w-[400px] mx-auto">
            Your collections are set to sale. it’s already listed in the
            platform that you choose!
          </p>
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
          className="w-full contained-button font-bold mt-6 text-[16px] h-[44px] bg-primary-50 text-primary-900 "
          onClick={handleClose}
        >
          Back to DAO detail
        </button>
      </div>
    </Modal>
  );
};

export default SalesSuccessModal;
