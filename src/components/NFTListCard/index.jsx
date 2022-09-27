import React from "react";
import { Link } from "react-router-dom";
import Eth from "assets/images/network/eth.svg";
import Polygon from "assets/images/network/polygon.svg";

export default function index({ nft, projectNetwork }) {
  return (
    <div
      key={nft?.id}
      className="min-h-auto md:min-h-[390px] rounded-xl mr-2 md:mr-4 mb-4 bg-white p-4"
    >
      <Link to={`/nft-details/${nft?.nft_type}/${nft.id}`}>
        <img
          className="rounded-xl h-[176px] md:h-[276px] w-[150px] md:w-[276px] object-contain"
          src={nft?.asset?.path}
          alt=""
        />
      </Link>
      <div className="py-2 md:py-5">
        <div className="flex w-[150px] md:w-[276px]">
          <h2 className="mb-2 text-txtblack truncate flex-1 mr-3 m-w-0 text-[24px]">
            {nft?.name}
          </h2>
          {/* <div className="relative">
            {Collection?.type === "membership" && (
              <button
                type="button"
                className="w-[20px]"
                onClick={(e) => handleShowOptions(e, nft.id)}
              >
                <i className="fa-regular fa-ellipsis-vertical text-textSubtle"></i>
              </button>
            )}

          
            {ShowOptions === nft.id && (
              <div className="z-10 w-48 bg-white border border-divide rounded-md  absolute left-0 top-8 mb-6 block">
                <ul className="text-sm">
                  Temporarily disable <li className="border-b border-divide">
                                <div
                                  onClick={(e) => handleEditNFT(e, nft.id)}
                                  className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                >
                                  Edit NFT
                                </div>
                              </li>
                              <li className="border-b border-divide">
                                <div
                                  onClick={(e) => handleUpdateMeta(e, nft.id)}
                                  className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                >
                                  Update Metadata
                                </div>
                              </li>
                  <li className="border-b border-divide">
                    <div
                      onClick={() => {
                        setShowTransferNFT(true);
                        setShowOptions(false);
                      }}
                      className="block p-4 hover:bg-gray-100 cursor-pointer"
                    >
                      Transfer NFT
                    </div>
                  </li>{" "}
                  {Collection?.type === "membership" && (
                    <li className="border-divide">
                      <div
                        onClick={(e) => salesPageModal(e, "membership", nft.id)}
                        className="block p-4 hover:bg-gray-100 cursor-pointer"
                      >
                        Sales Settings
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div> */}
        </div>
        <div className="flex  w-[150px] md:w-[276px]">
          <p className="text-[13px]">
            {nft?.price} {projectNetwork === "ethereum" ? "ETH" : "MATIC"}
          </p>
          <img
            className="ml-auto"
            src={projectNetwork === "ethereum" ? Eth : Polygon}
            alt={projectNetwork}
          />
        </div>
      </div>
    </div>
  );
}
