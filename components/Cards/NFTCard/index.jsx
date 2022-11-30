import NFTSample from "assets/images/createDAO/nft-sample.svg";
import { getCollectionNFTs } from "services/collection/collectionService";
import { useState, useEffect } from "react";
import ProfileImage from "assets/images/createDAO/user.svg";
import { Link } from "react-router-dom";

const NFTCard = ({ item }) => {
  const [NFTs, setNFTs] = useState([]);

  useEffect(() => {
    getCollectionNFTs(item.id)
      .then((resp) => {
        if (resp.code === 0) {
          if (resp?.lnfts) {
            setNFTs(resp?.lnfts);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const truncateArray = (users) => {
    let slicedItems = users.slice(0, 3);
    return { slicedItems, restSize: users.length - slicedItems.length };
  };

  return (
    <Link
      to={
        item.type === "right_attach"
          ? `/royality-management/${item.id}`
          : `/collection-details/${item.id}`
      }
      className="rounded-[12px] relative flex flex-col cursor-pointer hover:no-underline text-black hover:text-black"
    >
      <img
        src={item.assets && item.assets[0] ? item.assets[0].path : NFTSample}
        alt={item.name}
        className="md:w-[276px] md:h-[276px] h-[180px] w-[180px]  rounded-[10px] object-cover"
      />
      <h3 className="text-[18px] md:text-[24px] font-bold">
        {item.name
          ? item?.name?.length > 20
            ? item.name.substring(0, 17) + "..."
            : item.name
          : "No name"}
      </h3>
      {item.description ? (
        <p>
          {item.description
            ? item?.description?.length > 40
              ? item.description.substring(0, 35) + "..."
              : item.description
            : ""}
        </p>
      ) : null}
      <div className="flex mt-3 ml-3">
        {NFTs?.length
          ? truncateArray(NFTs).slicedItems.map((nft, index) => (
              <img
                key={index}
                src={nft?.asset?.path ? nft.asset.path : ProfileImage}
                alt={nft?.asset?.name}
                className=" rounded-[50px] w-[24px] h-[24px] -ml-3 object-cover"
              />
            ))
          : null}
        {NFTs?.length > 3 && (
          <div className="flex items-center mt-[2px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[22px] h-[22px]">
            <p className="text-[8px] text-[#9A5AFF]">
              +{truncateArray(NFTs).restSize}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default NFTCard;
