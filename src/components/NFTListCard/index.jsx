import React from "react";
import { Link } from "react-router-dom";
import Eth from "assets/images/network/eth.svg";
import Polygon from "assets/images/network/polygon.svg";

export default function index({ nft, projectNetwork }) {
  function refreshNft(nftId) {
    console.log(nftId);
  }
  return (
    <div
      key={nft?.id}
      className="min-h-auto md:min-h-[390px] rounded-xl mr-2 md:mr-4 mb-4 bg-white"
    >
      <Link to={`/nft-details/${nft?.nft_type}/${nft.id}`}>
        <img
          className="rounded h-[176px] md:h-[276px]  md:w-[276px] object-cover "
          src={nft?.asset?.path}
          alt=""
        />
      </Link>
      <div className="py-2 md:py-5 px-2">
        <div className="flex w-[150px] md:w-[276px]">
          <h2 className="mb-2 text-txtblack truncate flex-1 mr-3 m-w-0 text-[24px]">
            {nft?.name}
          </h2>
        </div>
        <div className="flex  flex-wrap ">
          <p className="text-[13px]">
            {nft?.price} {projectNetwork === "ethereum" ? "ETH" : "MATIC"}
          </p>
          <img
            className="ml-auto"
            src={projectNetwork === "ethereum" ? Eth : Polygon}
            alt={projectNetwork}
          />
        </div>
        <div className="text-right mt-2">
          <button
            onClick={() => refreshNft(nft?.id)}
            className="contained-button px-3 rounded"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
