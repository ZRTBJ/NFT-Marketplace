import { useEffect, useState } from "react";
import { getNftDetails } from "services/nft/nftService";
import manImg from "assets/images/projectDetails/man-img.svg";
import opensea from "assets/images/icons/opensea.svg";
import rarible from "assets/images/icons/rarible.svg";
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
      <section className="flex flex-col lg:flex-row py-5">
        <div className="bg-white rounded-xl boxShadow flex-1 flex flex-col items-center justify-start self-start p-4 mr-4 mb-5 md:mb-0">
          <img
            src={manImg}
            className="rounded-3xl h-[356px] w-[356px] object-cover max-w-full"
            alt="nft"
          />
          <div className="rounded bg-success-1 bg-opacity-20 font-satoshi-bold text-success-1 font-black p-4 mt-4">
            10.9 MATIC
          </div>

        </div>

        <div className="bg-white rounded-xl boxShadow p-4 flex-1">
          <h1 className="txtblack pb-4">Bored Ape #8295</h1>
          <p className="txtblack text-sm pb-4">Find it On</p>
          <div className="mb-4">
            <a className="inline-flex items-center mr-3 border border-color-blue p-3 text-color-blue font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-color-blue hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
              <img src={opensea} alt="opensea" className="mr-1" />
              Opensea
            </a>
            <a className="inline-flex items-center mr-3 border border-color-yellow p-3 text-color-yellow font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-color-yellow hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
              <img src={rarible} alt="rarible" className="mr-1" />
              Rarible
            </a>
          </div>

          <div className="flex mb-4">
            <span className="w-20 font-satoshi-bold font-black text-lg text-txtblack">Duration</span>
            <span className="font-satoshi-bold font-black text-lg text-txtblack mx-3">:</span>
            <span className="text-textSubtle">1 Month</span>
          </div>

          <div className="flex mb-4">
            <span className="w-20 font-satoshi-bold font-black text-lg text-txtblack">Supply</span>
            <span className="font-satoshi-bold font-black text-lg text-txtblack mx-3">:</span>
            <span className="text-textSubtle">10.000</span>
          </div>

          <h3 className="txtblack">Description</h3>
          <p className="txtblack text-sm mb-4">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. It is a long established fact that a reader will be
          </p>

          <h3 className="txtblack mb-4">Attribute</h3>
          <div className="flex flex-wrap">
            <div className="w-[138px] h-28  mr-3 mb-3 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-10 flex items-center justify-center flex-col">
              <p className="text-textSubtle text-sm mb-1">Background</p>
              <h5 className="text-primary-900 mb-1">Green</h5>
              <p className="text-textSubtle text-sm">
                Add 5% this trait
              </p>
            </div>
            <div className="w-[138px] h-28  mr-3 mb-3 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-10 flex items-center justify-center flex-col">
              <p className="text-textSubtle text-sm mb-1">Background</p>
              <h5 className="text-primary-900 mb-1">Green</h5>
              <p className="text-textSubtle text-sm">
                Add 5% this trait
              </p>
            </div>
            <div className="w-[138px] h-28  mr-3 mb-3 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-10 flex items-center justify-center flex-col">
              <p className="text-textSubtle text-sm mb-1">Background</p>
              <h5 className="text-primary-900 mb-1">Green</h5>
              <p className="text-textSubtle text-sm">
                Add 5% this trait
              </p>
            </div>
          </div>

          <h3 className="txtblack mb-4">Benefit</h3>
          <div className="mb-3 p-4 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-20 flex items-center">
            <div className="rounded-full bg-primary-900 bg-opacity-90 w-[30px] h-[30px] font-satoshi-bold text-sm mr-4 flex items-center justify-center">1</div>
            <p className="text-sm">
              Benefit text in here , listing the benefit with a lot of
              information
            </p>
          </div>

          <div className="mb-3 p-4 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-20 flex items-center">
            <div className="rounded-full bg-primary-900 bg-opacity-90 w-[30px] h-[30px] font-satoshi-bold text-sm mr-4 flex items-center justify-center">1</div>
            <p className="text-sm">
              Benefit text in here , listing the benefit with a lot of
              information
            </p>
          </div>

          <div className="mb-3 p-4 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-20 flex items-center">
            <div className="rounded-full bg-primary-900 bg-opacity-90 w-[30px] h-[30px] font-satoshi-bold text-sm mr-4 flex items-center justify-center">1</div>
            <p className="text-sm">
              Benefit text in here , listing the benefit with a lot of
              information
            </p>
          </div>

        </div>
      </section>


      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <>
          {/* <section className="flex flex-col lg:flex-row py-5">
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
                 <p className="txtblack dark:text-white text-sm pb-4">Find it On</p>
                <p className="txtblack dark:text-white-shade-600 text-sm">
                  Your NFT is not listed on any marketplace
                </p>
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
          </section>*/}

        </>
      )}
    </>
  );
}
