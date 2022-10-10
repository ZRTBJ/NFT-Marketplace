import { useEffect, useState } from "react";
import { getNftDetails } from "services/nft/nftService";
import NFTImage from "../../assets/images/projectDetails/man-img.svg";
import WalletConnectModal from "components/modalDialog/WalletConnectModal";
import { useDispatch, useSelector } from "react-redux";

function EmbedNFT(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nft, setNft] = useState({});
  const nftId = props.match.params.id;
  const userinfo = useSelector((state) => state.user.userinfo);

  useEffect(() => {
    if (nftId) {
      nftDetails();
    }
  }, [nftId]);

  function nftDetails() {
    getNftDetails(nftId)
      .then((e) => {
        setNft(e.nft);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }

  const hideModal = () => {
    setShowModal(false);
  };

  const handleModal = () => {
    setShowModal(true);
  };
  return (
    <>
      {isLoading ? (
        <div className="loading"></div>
      ) : (
        <>
          <div
            className={`h-[calc(100vh-71px)] flex flex-col items-center justify-center`}
          >
            {/* {nft?.asset?.asset_type.includes("image") && (
            <img src={nft.asset.path} alt="NFT" />
          )}
          <h2 className="text-white mt-8">{nft?.name}</h2> */}
            <button className="outlined-button" onClick={handleModal}>
              {userinfo.id ? "Mint NFT" : "Connect Wallet"}
            </button>
          </div>
          <WalletConnectModal showModal={showModal} closeModal={hideModal} />
        </>
      )}
    </>
  );
}

export default EmbedNFT;
