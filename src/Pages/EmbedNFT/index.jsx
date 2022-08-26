import { useEffect, useState } from "react";
import { getNftDetails } from "services/nft/nftService";
import NFTImage from "../../assets/images/projectDetails/man-img.svg";

function EmbedNFT(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNft] = useState({});
  const nftId = props.match.params.id;

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

  return (
    <>
      {isLoading ? (
        <div className="loading"></div>
      ) : (
        <div
          className={`h-[calc(100vh-71px)] flex flex-col items-center justify-center`}
        >
          {nft?.asset?.asset_type.includes("image") && (
            <img src={nft.asset.path} alt="NFT" />
          )}
          <h2 className="text-white mt-8">{nft?.name}</h2>
        </div>
      )}
    </>
  );
}

export default EmbedNFT;
