import Modal from "components/Commons/Modal";
import { useState, useRef, useEffect } from "react";

const EmbedNFTModal = ({ show, type, handleClose, nftId }) => {
  const [height, setHeight] = useState(477);
  const [width, setWidth] = useState(274);
  const [iframeContent, setIframeContent] = useState("");
  const [isTextCopied, setIsTextCopied] = useState(false);
  const copyRef = useRef(null);
  let host = window.location.origin;

  useEffect(() => {
    setIframeContent(
      `<iframe src='${host}/embed-nft/${type}/${nftId}' width='${width}px' height='${height}px' style="border:none" title='NFT'></iframe>`
    );
  }, [height, width]);

  const copyToClipboard = (e) => {
    copyRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    setIsTextCopied(true);
    setTimeout(() => {
      setIsTextCopied(false);
    }, 2000);
  };

  return (
    <Modal
      width={520}
      height={620}
      overflow={"auto"}
      show={show}
      handleClose={() => handleClose(false)}
    >
      <div className="embed-nft-modal py-6">
        <p className="text-[24px] font-bold">Embed NFT</p>
        <p className="text-textSubtle text-[15px] mb-5">
          Embed the NFT and put it in your website using embed code
        </p>
        <div className="w-4/4 mt-10 md:mt-0 flex item-center justify-center">
          <iframe
            src={`${host}/embed-nft/${type}/${nftId}`}
            width={`${width}px`}
            height={`${height}px`}
            style={{ border: "none" }}
            title="NFT"
          ></iframe>
        </div>
        <div className="flex items-center w-full space-x-2 justify-between mt-4">
          <div className="w-[1/2]">
            <div className="relative">
              <p className="text-[#9499ae] text-md absolute left-2 top-3 text-[14px]">
                Width
              </p>
              <input
                className="block mb-3"
                id="width"
                name="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
              <p className="text-[#9499ae] text-md absolute right-2 top-2">
                px
              </p>
            </div>
          </div>
          <div className="w-[1/2]">
            <div className="relative">
              <p className="text-[#9499ae] text-md absolute left-2 top-3 text-[14px]">
                Height
              </p>
              <input
                className="block mb-3 pl-4"
                id="name"
                name="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <p className="text-[#9499ae] text-md absolute right-2 top-2">
                px
              </p>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <textarea
            className=" text-[14px] block mb-3 py-[10px] pl-[15px] pr-[40px] bg-[#122478] bg-opacity-[0.1] text-[#9499ae] w-full rounded-[12px]"
            id="iframe"
            name="iframe"
            ref={copyRef}
            value={iframeContent}
            readOnly={true}
          />
          <div className="text-center mt-5 relative">
            <button
              onClick={copyToClipboard}
              className="bg-primary-100 text-primary-900 py-2 px-3 rounded-[4px] text-[14px] font-black"
            >
              Copy Embed Code
            </button>
            {isTextCopied && (
              <p className="right-10 bottom-2 absolute txtblack text-center text-xs text-success-900">
                Copied Successfully!
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EmbedNFTModal;
