import React, { useState } from "react";
import thumbIcon from "assets/images/profile/card.svg";
import Image from "next/image";
import Link from "next/link";
import CreateNFTModal from "components/Project/CreateDAOandNFT/components/CreateNFTModal.jsx";
import NFTPublishingSteps from "components/LandingPage/components/NFTPublishingSteps";
import { formatNumber } from "accounting";
import { useRouter } from "next/router";
import { NETWORKS } from "config/networks";
import { getCurrentNetworkId } from "util/MetaMask";

export default function CollectionTable({ tableData, setSwitchNetwork }) {
  const [showCreateNFTModal, setShowCreateNFTModal] = useState(false);
  const router = useRouter();
  const handleCreateCollection = async () => {
    let currentNetwork = await getCurrentNetworkId();
    if (NETWORKS?.[currentNetwork]) {
      router.push(`/collection/create`);
      setSwitchNetwork(false);
    } else {
      setSwitchNetwork(true);
    }
  };
  return (
    <>
      <div className="flex items-center gap-4 flex-wrap my-3">
        <p className="textSubtle-100 text-[20px] font-black ">
          {" "}
          NFT Collection
        </p>
        <button
          onClick={handleCreateCollection}
          className="contained-button rounded ml-auto !text-white"
        >
          Create Collection
        </button>
      </div>

      <div className=" relative gradient-border-new pt-5 md:h-[670px] custom-scrollbar hover:overflow-y-auto overflow-y-hidden">
        <div className="mb-5">
          {tableData &&
            tableData?.map((item, index) => (
              <Link
                href={`/collection/${item?.id}`}
                key={index}
                className="flex md:items-center gap-2 md:gap-4 mb-6 !no-underline hover:text-black text-black"
              >
                <div>
                  <Image
                    className="w-[88px] h-[88px] rounded-xl object-cover"
                    src={
                      item && item?.assets && item?.assets[0]
                        ? item?.assets[0]?.path
                        : thumbIcon
                    }
                    alt="cover"
                    width={88}
                    height={88}
                    unoptimized
                  />
                  {item?.blockchain && (
                    <Image
                      className={`rounded-full -mt-[15px] -ml-[6px]`}
                      src={NETWORKS?.[item?.blockchain]?.icon}
                      alt="blockChain"
                      height={25}
                      width={25}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="!font-black text-black text-[20px] mt-1 mb-4">
                    {item?.name?.length > 24
                      ? `${item?.name?.substring(0, 24)}...`
                      : item?.name}
                  </p>
                  <div className="grid grid-cols-12 ">
                    <div className="col-span-3 md:col-span-4">
                      <p className="text-[10px] md:text-[12px] m-0 truncate">
                        {item?.collection_symbol}
                      </p>
                      <p className="font-black m-0 text-black text-[10px] md:text-[12px] truncate">
                        {item?.summary?.holding_value_usd
                          ? `$${formatNumber(
                              item?.summary?.holding_value_usd.toFixed(2)
                            )}  USD`
                          : "$0 USD"}
                      </p>
                    </div>
                    <div className="col-span-6 md:col-span-4 text-center">
                      <p className="m-0 text-[10px] md:text-[12px]">
                        Remaining / Supply
                      </p>
                      {item?.status === "published" ? (
                        <p className="m-0 text-[10px] md:text-[12px] font-black text-black truncate">
                          {parseInt(item?.total_supply) -
                            parseInt(item?.summary?.sold_count)}
                          /{item?.total_supply}
                        </p>
                      ) : (
                        <p className="m-0 text-[10px] md:text-[12px] font-black text-black truncate">
                          Not for sale
                        </p>
                      )}
                    </div>
                    <div className="col-span-3 md:col-span-4 text-center">
                      <p className="m-0 text-[10px] md:text-[12px]">Owners</p>
                      <p className="m-0 text-[10px] md:text-[12px] font-black text-black truncate">
                        {item?.summary?.buyer_count}
                      </p>
                    </div>
                  </div>
                </div>
                <i className="self-center fa-solid fa-chevron-right"></i>
              </Link>
            ))}
          {tableData?.length === 1 && <NFTPublishingSteps />}
        </div>
        {tableData?.length > 1 && (
          <Link
            className="md:absolute md:left-[50%] md:-translate-x-1/2 md:-translate-y-1/2 absolute bottom-0  gradient-text-deep-pueple font-black border w-[160px] text-center h-[40px] rounded-lg border-secondary-900 ml-auto mt-2 flex items-center justify-center"
            href={`/list?type=collection&user=true`}
          >
            View All <i className=" ml-2 fa-sharp fa-solid fa-arrow-right"></i>
          </Link>
        )}
      </div>

      {showCreateNFTModal && (
        <CreateNFTModal
          show={showCreateNFTModal}
          handleClose={() => {
            setShowCreateNFTModal(false);
          }}
        />
      )}
    </>
  );
}
