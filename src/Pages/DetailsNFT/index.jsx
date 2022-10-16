import { useEffect, useState } from "react";
import {
  getNftDetails,
  mintProductOrMembershipNft,
} from "services/nft/nftService";
import manImg from "assets/images/defaultImage.svg";
import opensea from "assets/images/icons/opensea.svg";
import rarible from "assets/images/icons/rarible.svg";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import SuccessModal from "components/modalDialog/SuccessModal";
import { useDispatch, useSelector } from "react-redux";
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from "react-share";
import FB from "assets/images/facebook.svg";
import twitter from "assets/images/twitter.svg";
import reddit from "assets/images/reddit.svg";
import TransactionModal from "components/modalDialog/TransactionModal";
import WaitingModal from "components/modalDialog/WaitingModal";
import NftSuccessModal from "components/modalDialog/NftSuccessModal";
import { getNotificationData } from "Slice/notificationSlice";
import ErrorModal from "components/modalDialog/ErrorModal";
import WalletConnectModal from "components/modalDialog/WalletConnectModal";
import { createMintNFT } from "eth/deploy-mintnft";
import { createProvider } from "eth/provider";
import { createMintInstance } from "eth/mint-nft";
import EmbedNFTModal from "components/modalDialog/EmbedNFTModal";

export default function DetailsNFT(props) {
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNft] = useState({});
  const [comingSoon, setComingSoon] = useState(false);
  const [showTransactionModal, setTransactionModal] = useState(false);
  const [showTransactionWaitingModal, setTransactionWaitingModal] =
    useState(false);
  const [showNftSuccessModal, setNftSuccessModal] = useState(false);
  const [funcId, setFuncId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mintData, setMintData] = useState();
  const [hash, setHash] = useState("");
  const [showEmbedNFT, setShowEmbedNFT] = useState(false);

  const provider = createProvider();

  const dispatch = useDispatch();

  // useEffect(() => {
  //   const mintDataStatus = inviteData.find((x) => x.function_uuid === funcId);
  //   if (mintDataStatus && mintDataStatus.data) {
  //     const data = JSON.parse(mintDataStatus.data);
  //     console.log(data);
  //     if (data?.fn_status === "success") {
  //       nftDetails();
  //       setHash(data?.fn_response_data?.transactionHash);
  //       setTransactionWaitingModal(false);
  //       setNftSuccessModal(true);
  //       setMintData(data);
  //       setErrorMsg("");
  //     } else {
  //       setTransactionWaitingModal(false);
  //       let message = data?.fn_response_data?.ErrorReason;
  //       let errorMessage = message && JSON.parse(message);
  //       setErrorMsg(errorMessage?.reason);
  //     }
  //   } else {
  //     let message = mintDataStatus?.data?.fn_response_data?.ErrorReason;
  //     let errorMessage = message && JSON.parse(message);
  //     if (errorMessage) {
  //       setTransactionWaitingModal(false);
  //       setErrorMsg(errorMessage?.reason);
  //     }
  //   }
  // }, [inviteData]);

  const handleContract = async (config) => {
    try {
      const mintContract = createMintInstance(config.contract, provider);
      const response = await createMintNFT(
        mintContract,
        config.metadataUrl,
        config.price,
        provider
      );

      if (response) {
        let data = {
          hash: response?.transactionHash,
          blockNumber: response?.blockNumber,
        };
        handleProceedPayment(data);
      }
    } catch (err) {
      console.log(err);
      if (err.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Minting failed. Please try again later");
      }
    }
  };

  const { type, id } = useParams();
  useEffect(() => {
    if (id) {
      nftDetails();
    }
  }, [id]);

  async function nftDetails() {
    await getNftDetails(type, id)
      .then((resp) => {
        if (resp.code === 0) {
          setNft(resp);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  const copyToClipboardShare = (text) => {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById("copied-share-message");
    copyEl.classList.toggle("hidden");
    setTimeout(() => {
      copyEl.classList.toggle("hidden");
    }, 2000);
  };

  async function handleProceedPayment(response) {
    setTransactionModal(false);
    setTransactionWaitingModal(true);
    const payload = {
      id: nft?.lnft?.id,
      data: {
        transaction_hash: response.hash,
        token_id: "",
        block_number: response.blockNumber,
      },
      type: nft?.lnft?.nft_type,
    };
    await mintProductOrMembershipNft(payload)
      .then((resp) => {
        if (resp.code === 0) {
          const deployData = {
            function_uuid: resp.function_uuid,
            data: "",
          };
          if (response.hash) {
            setFuncId(resp.function_uuid);
            // dispatch(getNotificationData(deployData));
            setErrorMsg("");
            if (resp?.function?.status === "success") {
              console.log("success");
              nftDetails();
              setHash(resp?.function?.transactionHash);
              setTransactionWaitingModal(false);
              setNftSuccessModal(true);
              setMintData(resp);
              setErrorMsg("");
            } else if (resp?.function?.status === "failed") {
              setTransactionWaitingModal(false);
              let message = resp?.function?.message;
              setErrorMsg(message);
            }
          } else {
            handleContract(resp.config);
          }
        } else {
          setErrorMsg(resp.message);
          setTransactionWaitingModal(false);
        }
      })
      .catch((err) => {
        setTransactionWaitingModal(false);
      });
  }
  const [showModal, setShowModal] = useState(false);
  const [navigateToPage, setNavigateToPage] = useState("");

  function hideModal(e) {
    setShowModal(false);
  }

  function handleMint(params) {
    // console.log(userinfo);
    if (userinfo.eoa) {
      setTransactionModal(true);
    } else {
      setShowModal(true);
    }
  }

  let info =
    nft?.lnft?.nft_type === "membership" ? nft?.more_info : nft?.sale_info;

  let benefits = info?.benefits && JSON.parse(nft.more_info.benefits);
  let availableSupply = nft?.lnft?.supply - nft?.lnft?.minted_amount;

  return (
    <>
      {comingSoon && (
        <SuccessModal
          show={comingSoon}
          message="Coming Soon"
          subMessage="This feature is not supported yet."
          buttonText="OK"
          showCloseIcon={true}
          handleClose={() => setComingSoon(false)}
        />
      )}
      {showTransactionModal && (
        <TransactionModal
          show={showTransactionModal}
          handleClose={() => setTransactionModal(false)}
          nftName={nft?.lnft?.name}
          address={userinfo?.eoa}
          collectionName={"Collection1"}
          blockChain={"Ethereum"}
          price={nft?.more_info?.price}
          handleNext={() => handleProceedPayment("")}
        />
      )}
      {showTransactionWaitingModal && (
        <WaitingModal
          show={showTransactionWaitingModal}
          handleClose={() => setTransactionWaitingModal(false)}
        />
      )}
      {showNftSuccessModal && (
        <NftSuccessModal
          show={showNftSuccessModal}
          handleClose={() => setNftSuccessModal(false)}
          nftName={nft?.lnft?.name}
          assetUrl={nft?.lnft?.asset?.path ? nft?.lnft?.asset?.path : manImg}
          address={"sjdklsjlksd4654054f654fds5df0sd4f6d54f56d"}
          transactionHash={hash}
          collectionName={"Collection1"}
          shareUrl={`${nft?.lnft?.invitation_code}`}
          // handleNext={handleProceedPayment}
        />
      )}
      {errorMsg && (
        <ErrorModal
          title={"Minting NFT failed !"}
          message={`${errorMsg}`}
          handleClose={() => {
            setErrorMsg("");
          }}
          show={errorMsg}
        />
      )}
      <WalletConnectModal
        showModal={showModal}
        closeModal={(e) => hideModal(e)}
        noRedirection={true}
      />
      {showEmbedNFT && (
        <EmbedNFTModal
          show={showEmbedNFT}
          handleClose={setShowEmbedNFT}
          nftId={nft?.lnft?.id}
          type={type}
        />
      )}

      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <section className="flex flex-col lg:flex-row py-5">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-main flex flex-col items-center justify-start self-start p-4 ml-4 md:ml-0 mr-4 mb-5 md:mb-0">
              <img
                src={nft?.lnft?.asset?.path ? nft?.lnft?.asset?.path : manImg}
                className="rounded-3xl h-[356px] w-[356px] object-cover max-w-full"
                alt="nft"
              />
              <div className="rounded bg-success-1 bg-opacity-20 font-satoshi-bold text-success-1 font-black p-4 mt-4">
                {info?.price} MATIC
              </div>
            </div>
            <div className="flex w-100 items-center justify-center mt-4 ">
              <button
                onClick={() => setShowEmbedNFT(true)}
                className="rounded-[4px] p-3 border-[1px] font-black font-[14px] text-primary-900 border-primary-900"
              >
                Embed NFT
              </button>
            </div>
            {nft?.lnft?.invitation_code && (
              <div className="bg-white rounded-xl shadow-main mt-3 flex flex-col items-center justify-start self-start p-4 mr-4 mb-5 md:mb-0">
                <div className="mt-2">
                  <p className="text-[14px] text-center text-[#5F6479] mb-1">
                    Share with link
                  </p>
                  <div className="relative w-fit">
                    <p
                      className="text-[16px] block py-[10px] pl-[15px] pr-[40px]  text-primary-900 bg-primary-50 w-full rounded-[12px]"
                      id="iframe"
                    >
                      Link:{" "}
                      <span className="font-black">
                        {origin}/{nft?.lnft?.invitation_code}
                      </span>
                    </p>
                    <div className="text-primary-900 absolute top-2 right-2">
                      <i
                        className="fa fa-copy text-lg cursor-pointer"
                        onClick={() =>
                          copyToClipboardShare(
                            `${origin}/${nft?.lnft?.invitation_code}`
                          )
                        }
                      ></i>
                    </div>
                    <p
                      id="copied-share-message"
                      className="hidden text-green-500 text-[14px] text-center"
                    >
                      Copied Successfully!
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[14px] text-[#5F6479] text-center mt-[46px] mb-1">
                    Share on Social Media
                  </p>
                  <div className="flex items-center">
                    <FacebookShareButton
                      url={`${origin}/${nft?.lnft?.invitation_code}`}
                      quote={"NFT"}
                    >
                      <div className="cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2">
                        <img src={FB} alt="facebook" />
                      </div>
                    </FacebookShareButton>
                    <TwitterShareButton
                      title="NFT"
                      url={`${origin}/${nft?.lnft?.invitation_code}`}
                    >
                      <div className="cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2">
                        <img src={twitter} alt="twitter" />
                      </div>
                    </TwitterShareButton>
                    <RedditShareButton
                      title="NFT"
                      url={`${origin}/${nft?.lnft?.invitation_code}`}
                    >
                      <div className="cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center">
                        <img src={reddit} alt="reddit" />
                      </div>
                    </RedditShareButton>
                    {/* <div className='cursor-pointer rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                    <img src={instagram} alt='instagram' />
                  </div> */}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-main p-4 flex-1 mx-4 md:mx-0">
            <h1 className="txtblack pb-4">{nft?.lnft?.name}</h1>
            <p className="txtblack text-sm pb-4">Find it On</p>
            <div className="mb-4">
              <div
                onClick={() => setComingSoon(true)}
                className="inline-flex items-center mr-3 cursor-pointer border border-color-blue p-3 text-color-blue font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-color-blue hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              >
                <img src={opensea} alt="opensea" className="mr-1" />
                Opensea
              </div>
              <div
                onClick={() => setComingSoon(true)}
                className="inline-flex cursor-pointer items-center mr-3 border border-color-yellow p-3 text-color-yellow font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-color-yellow hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              >
                <img src={rarible} alt="rarible" className="mr-1" />
                Rarible
              </div>
            </div>
            <div className="flex mb-4">
              <span className="w-20 font-satoshi-bold font-black text-lg text-txtblack">
                Duration
              </span>
              <span className="font-satoshi-bold font-black text-lg text-txtblack mx-3">
                :
              </span>
              {info?.start_datetime ? (
                <span className="text-textSubtle leading-8">
                  {format(new Date(info.start_datetime), "dd/MM/yy (HH:mm)")} -{" "}
                  {format(new Date(info.end_datetime), "dd/MM/yy (HH:mm)")}
                </span>
              ) : null}
            </div>
            <div className="flex mb-4">
              <span className="w-20 font-satoshi-bold font-black text-lg text-txtblack">
                Supply
              </span>
              <span className="font-satoshi-bold font-black text-lg text-txtblack mx-3">
                :
              </span>
              <span className="text-textSubtle leading-8">
                {availableSupply} / {nft?.lnft?.supply}
              </span>
            </div>
            <h3 className="txtblack">Description</h3>
            <p className="txtblack text-sm mb-4">{nft?.lnft?.description}</p>
            <h3 className="txtblack mb-4">Attribute</h3>
            <div className="flex flex-wrap mb-6">
              {nft?.lnft?.attributes?.length ? (
                nft?.lnft?.attributes.map((item, index) => (
                  <>
                    {item.key !== "" ? (
                      <div
                        key={index}
                        className="w-[138px] h-28  mr-3 mb-3 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-10 flex items-center justify-center flex-col"
                      >
                        <p className="text-textSubtle text-sm mb-1">
                          {item.key}
                        </p>
                        <h5 className="text-primary-900 mb-1">{item.value}</h5>
                        {/* <p className='text-textSubtle text-sm'>Add 5% this trait</p> */}
                      </div>
                    ) : (
                      <p>No attributes to show</p>
                    )}
                  </>
                ))
              ) : (
                <p>No attributes to show</p>
              )}

              {/* <div className='w-[138px] h-28  mr-3 mb-3 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-10 flex items-center justify-center flex-col'>
              <p className='text-textSubtle text-sm mb-1'>Background</p>
              <h5 className='text-primary-900 mb-1'>Green</h5>
              <p className='text-textSubtle text-sm'>Add 5% this trait</p>
            </div>
            <div className='w-[138px] h-28  mr-3 mb-3 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-10 flex items-center justify-center flex-col'>
              <p className='text-textSubtle text-sm mb-1'>Background</p>
              <h5 className='text-primary-900 mb-1'>Green</h5>
              <p className='text-textSubtle text-sm'>Add 5% this trait</p>
            </div> */}
            </div>
            {nft?.lnft?.nft_type === "membership" && (
              <div>
                <h3 className="txtblack mb-4">Benefit</h3>
                {benefits && benefits.length ? (
                  benefits.map((benefit, index) => (
                    <div
                      className="mb-3 p-4 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-20 flex items-center"
                      key={index}
                    >
                      <div className="rounded-full bg-primary-900 bg-opacity-90 w-[30px] h-[30px] font-satoshi-bold text-sm mr-4 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <p className="text-sm w-[90%]">{benefit.title}</p>
                    </div>
                  ))
                ) : (
                  <p>No benefits to show</p>
                )}
              </div>
            )}
            {/* {!nft.lnft.is_owner && ( */}
            <>
              {nft?.lnft.minted_amount < nft?.lnft.supply && (
                <div className="text-center mt-[62px] mb-5">
                  <button
                    className=" w-[140px] !text-[16px] h-[44px] contained-button "
                    onClick={() => setTransactionModal(true)}
                  >
                    Mint NFT
                  </button>
                </div>
              )}
            </>
            {/* )} */}
          </div>
        </section>
      )}
    </>
  );
}
