import { useEffect, useState } from "react";
import { getNftDetails } from "services/nft/nftService";
import manImg from "assets/images/projectDetails/man-img.svg";
import { Link } from 'react-router-dom'
export default function DetailsNFT(props) {
  const nftId = props.match.params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNft] = useState({});

  useEffect(() => {
    if (nftId) {
      nftDetails();
    }
  }, [nftId]);

  async function nftDetails() {
    await getNftDetails(nftId)
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
      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <>
          <section className="flex flex-col lg:flex-row py-5">
            <div className="flex-1 pr-4 mb-5 md:mb-0">
              {nft.asset.asset_type.includes("image") && (
                <img
                  src={nft.asset.path}
                  className="rounded-3xl h-[616px] w-[616px] object-cover"
                  alt="nft"
                />
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="bg-color-dark-1 rounded-3xl p-5 mb-2">
                <h1 className="txtblack dark:text-white  pb-4">{nft.name}</h1>
                {/* <p className="txtblack dark:text-white text-sm pb-4">Find it On</p>
                <p className="txtblack dark:text-white-shade-600 text-sm">
                  Your NFT is not listed on any marketplace
                </p> */}
                <Link to={`/embed-nft/preview/${nftId}`}>
                  <button
                    className="btn-outline-primary-gradient btn-sm"
                  >
                    <span>Embed NFT</span>
                  </button>
                </Link>
              </div>

              <div className="bg-color-dark-1 rounded-3xl p-5 mb-2">
                <h1 className="txtblack dark:text-white  pb-4">Description</h1>
                <p className="text-white-shade-600 text-sm pb-4">
                  {nft.description}
                </p>
              </div>

              <div className="bg-color-dark-1 rounded-3xl p-5 ">
                <h1 className="txtblack dark:text-white  pb-4">Properties</h1>
                <div className="flex  flex-wrap">
                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
                      <h5 className="txtblack dark:text-white">Green</h5>
                      <p className="text-white-shade-600 text-sm">
                        Add 5% this trait
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
                      <h5 className="txtblack dark:text-white">Green</h5>
                      <p className="text-white-shade-600 text-sm">
                        Add 5% this trait
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
                      <h5 className="txtblack dark:text-white">Green</h5>
                      <p className="text-white-shade-600 text-sm">
                        Add 5% this trait
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 txtblack dark:text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
                      <h5 className="txtblack dark:text-white">Green</h5>
                      <p className="text-white-shade-600 text-sm">
                        Add 5% this trait
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="pb-5">
            <div className="bg-color-dark-1 rounded-3xl p-5 lg:w-2/5">
              <div className="flex txtblack dark:text-white mb-3">
                <div className="font-bold w-1/3 flex justify-between mr-1">
                  <span>Smart Contract </span>
                  <span>:</span>
                </div>
                <div className="text-ellipsis overflow-hidden flex-1 pr-4 relative">
                  {nft.smart_contract}
                  <i
                    onClick={() => {
                      navigator.clipboard.writeText(nft.smart_contract);
                    }}
                    className="fa-thin fa-copy cursor-pointer absolute top-1 right-0"
                  ></i>
                </div>
              </div>
              <div className="flex txtblack dark:text-white">
                <div className="font-bold w-1/3 flex justify-between mr-1">
                  <span>Token ID </span>
                  <span>:</span>
                </div>
                <div className="text-ellipsis overflow-hidden">
                  {nft.token_id}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
