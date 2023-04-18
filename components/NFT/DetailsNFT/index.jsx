/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { formatNumber } from 'accounting';
import {
  getNftDetails,
  mintProductOrMembershipNft,
} from 'services/nft/nftService';
import manImg from 'assets/images/defaultImage.svg';
import opensea from 'assets/images/icons/opensea.svg';
import rarible from 'assets/images/icons/rarible.svg';
import Link from 'next/link';
import { format } from 'date-fns';
import SuccessModal from 'components/Modals/SuccessModal';
import { useSelector } from 'react-redux';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'react-share';
import FB from 'assets/images/facebook.svg';
import twitter from 'assets/images/twitter.svg';
import reddit from 'assets/images/reddit.svg';
import TransactionModal from 'components/NFT/DetailsNFT/MintNFT/TransactionModal';
import WaitingModal from 'components/NFT/DetailsNFT/MintNFT/WaitingModal';
import NftSuccessModal from 'components/NFT/DetailsNFT/MintNFT/NftSuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
import MoonpayModal from 'components/Modals/MoonpayModal';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import { createMintNFT } from 'components/NFT/DetailsNFT/MintNFT/deploy-mintnft';
import { createProvider } from 'util/smartcontract/provider';
import { createMintInstance } from 'config/ABI/mint-nft';
import { createMembsrshipMintInstance } from 'config/ABI/mint-membershipNFT';
import { createMembershipMintNFT } from 'components/NFT/DetailsNFT/MintNFT/deploy-membershipNFTMint';
import EmbedNFTModal from 'components/NFT/Embed/EmbedNFTModal';
import { NETWORKS } from 'config/networks';
import { ls_GetChainID } from 'util/ApplicationStorage';
import { getCurrentNetworkId, getAccountBalance } from 'util/MetaMask';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
import Bnb from 'assets/images/network/bnb.svg';
import { toast } from 'react-toastify';
import { cryptoConvert } from 'services/chainlinkService';
import tickIcon from 'assets/images/tick.svg';
import { getCollectionDetailsById } from 'services/collection/collectionService';
import Image from 'next/image';
import { event } from 'nextjs-google-analytics';
import TagManager from 'react-gtm-module';
import { ls_GetWalletType } from 'util/ApplicationStorage';
import { useSigner } from 'wagmi';

const currency = {
  eth: Eth,
  matic: Polygon,
  bnb: Bnb,
};

export default function DetailsNFT({ type, id }) {
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNft] = useState({});
  const [comingSoon, setComingSoon] = useState(false);
  const [showTransactionModal, setTransactionModal] = useState(false);
  const [showTransactionWaitingModal, setTransactionWaitingModal] =
    useState(false);
  const [showNftSuccessModal, setNftSuccessModal] = useState(false);
  const [funcId, setFuncId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showMoonpayModal, setShowMoonpayModal] = useState(false);
  const [mintData, setMintData] = useState();
  const [hash, setHash] = useState('');
  const [showEmbedNFT, setShowEmbedNFT] = useState(false);
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);
  const imageRegex = new RegExp('image');
  const provider = createProvider();
  const [usdValue, setUsdValue] = useState();
  const [collection, setCollection] = useState({});
  let walletType = ls_GetWalletType();
  const { data: wagmiSigner } = useSigner();
  const handleContract = async (config) => {
    try {
      const mintContract = createMintInstance(config.contract, provider);
      const membershipMintContract = createMembsrshipMintInstance(
        config.contract,
        provider
      );
      let nftPrice = config.price;
      const accountBalance = await getAccountBalance();
      if (Number(accountBalance) > Number(nftPrice)) {
        const response =
          type === 'membership'
            ? await createMembershipMintNFT(
                membershipMintContract,
                config.metadataUrl,
                id,
                provider,
                config.price,
                wagmiSigner
              )
            : await createMintNFT(
                mintContract,
                config.metadataUrl,
                config.price,
                provider,
                wagmiSigner
              );
        if (response) {
          setHash(response?.transactionHash);
          let data = {
            hash: response?.transactionHash,
            blockNumber: response?.blockNumber,
          };
          handleProceedPayment(data);
        }
      } else {
        setTransactionWaitingModal(false);
        if (process.env.NEXT_PUBLIC_ENV !== 'production') {
          setShowMoonpayModal(true);
        } else {
          setErrorMsg(
            "You don't have enough balance in your wallet to Mint NFT"
          );
        }
      }
    } catch (err) {
      setTransactionWaitingModal(false);
      if (err.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Minting failed. Please try again later');
      }
    }
  };

  async function dollarConvert(formUnit, price) {
    await cryptoConvert(formUnit).then((res) => {
      if (res) {
        const usdValue = res.USD * price;
        setUsdValue(usdValue);
      }
    });
  }

  useEffect(() => {
    if (id) {
      nftDetails();
    }
  }, [id]);

  async function nftDetails() {
    let collectionId = '';
    await getNftDetails(type, id)
      .then((resp) => {
        if (resp.code === 0) {
          setNft(resp);
          if (resp.more_info?.currency) {
            dollarConvert(
              resp?.more_info?.currency?.toUpperCase(),
              resp?.more_info?.price
            );
          }
          collectionId = resp?.lnft?.collection_uuid;
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });

    if (collectionId) {
      await getCollectionDetailsById({ id: collectionId })
        .then((resp) => {
          if (resp.code === 0) {
            setCollection(resp.collection);
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        })
        .catch((err) => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }

  async function handleProceedPayment(response) {
    event('mint_nft', {
      category: 'nft',
      label: 'type',
      value: nft?.lnft?.nft_type,
    });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'nft',
        pageTitle: 'mint_nft',
        label: 'type',
        value: nft?.lnft?.nft_type,
      },
    });
    setTransactionModal(false);
    setTransactionWaitingModal(true);
    let formData = new FormData();

    response.hash && formData.append('transaction_hash', response.hash);
    response.blockNumber &&
      formData.append('block_number', response.blockNumber);
    const payload = {
      id: nft?.lnft?.id,
      data: formData,
      type: nft?.lnft?.nft_type,
    };
    await mintProductOrMembershipNft(payload)
      .then((resp) => {
        if (resp.code === 0) {
          if (response.hash) {
            setFuncId(resp.function_uuid);
            setErrorMsg('');
            if (resp?.function?.status === 'success') {
              nftDetails();
              setHash(response.hash);
              setTransactionWaitingModal(false);
              setNftSuccessModal(true);
              setMintData(resp);
              setErrorMsg('');
            } else if (resp?.function?.status === 'failed') {
              setTransactionWaitingModal(false);
              let message = resp?.function?.message;
              setErrorMsg(message);
            }
          } else {
            handleContract(resp.config);
          }
        } else {
          let message = resp?.function?.message || resp.message;
          setErrorMsg(message);
          setTransactionWaitingModal(false);
        }
      })
      .catch((err) => {
        setTransactionWaitingModal(false);
      });
  }
  const [showModal, setShowModal] = useState(false);

  function hideModal(e) {
    setShowModal(false);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  const getCurrentNftNetwork = () => {
    let currency = nft?.more_info?.currency;
    let networks = Object.values(NETWORKS);
    let currentNetwork = networks.find((value) => value.value === currency);

    return currentNetwork.network;
  };

  const handlePublishModal = async () => {
    if (userinfo.eoa) {
      if (!nft.more_info.currency) {
        setErrorMsg('This NFT is not for sale yet, please try again later');
        return;
      }
      if (nft?.lnft?.minted_amount >= nft?.lnft?.supply) {
        setErrorMsg('This NFT can not buy, Maximum minted amount exceed!');
        return;
      }
      let nftNetwork = await getCurrentNftNetwork();
      let networkId = await getCurrentNetworkId();
      if (walletType === 'metamask') {
        if (nftNetwork === networkId) {
          setTransactionModal(true);
        } else {
          setShowNetworkHandler(true);
        }
      } else if (walletType === 'magicwallet') {
        setTransactionModal(true);
      }
    } else {
      setShowModal(true);
    }
  };
  function largeViewAsset() {
    if (typeof window !== 'undefined') {
      window.open(`${nft?.lnft?.asset?.path}`, '_blank');
    }
  }

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success(`Link successfully copied`);
    }
  };
  const openExternalLink = () => {
    if (window !== 'undefined') {
      let url = nft?.lnft?.external_url;
      if (!url.match(/^https?:\/\//i)) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    }
  };

  let info = nft?.more_info;

  let benefits = info?.benefits && JSON.parse(nft.more_info.benefits);
  const minted_amount = nft?.lnft?.minted_amount ? nft?.lnft?.minted_amount : 0;
  let availableSupply = nft?.lnft?.supply - minted_amount;

  return (
    <>
      {showNetworkHandler && (
        <NetworkHandlerModal
          show={showNetworkHandler}
          handleClose={() => setShowNetworkHandler(false)}
          projectNetwork={getCurrentNftNetwork()}
        />
      )}
      {comingSoon && (
        <SuccessModal
          show={comingSoon}
          message='Coming Soon'
          subMessage='This feature is not supported yet.'
          buttonText='OK'
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
          collectionName={collection?.name}
          blockChain={getCurrentNftNetwork()}
          price={info?.price}
          currency={info?.currency}
          handleNext={() => handleProceedPayment('')}
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
          transactionHash={mintData?.function?.response_data?.txn_hash}
          collectionName={collection?.name}
          mintData={mintData}
          nftId={nft?.lnft?.id}
          tokenId={mintData?.function?.response_data?.token_id}
          // handleNext={handleProceedPayment}
        />
      )}
      {errorMsg && (
        <ErrorModal
          title={'Mint NFT'}
          message={`${errorMsg}`}
          handleClose={() => {
            setErrorMsg('');
          }}
          show={errorMsg}
        />
      )}
      {showMoonpayModal && process.env.NEXT_PUBLIC_ENV !== 'production' && (
        <MoonpayModal
          handleClose={() => {
            setShowMoonpayModal(false);
          }}
          show={showMoonpayModal}
        />
      )}
      {showModal && (
        <WalletConnectModal
          showModal={showModal}
          closeModal={(e) => hideModal(e)}
          noRedirection={true}
        />
      )}
      {showEmbedNFT && (
        <EmbedNFTModal
          show={showEmbedNFT}
          handleClose={setShowEmbedNFT}
          nftId={nft?.lnft?.id}
          type={type}
        />
      )}

      {isLoading && <div className='loading'></div>}
      {!isLoading && (
        <section className='flex flex-col lg:flex-row py-5 mx-4'>
          <div className='flex-1 w-full md:max-w-[471px] '>
            <div className='bg-white rounded-xl shadow border border-border-primary flex flex-col items-center justify-start self-start p-4 ml-4 md:ml-0 mr-4 mb-5 md:mb-0'>
              {imageRegex.test(nft?.lnft?.asset?.asset_type) && (
                <Image
                  unoptimized
                  height={421}
                  width={421}
                  className='rounded-xl  h-[200px] md:h-[421px] w-[421px] object-cover max-w-full'
                  src={nft?.lnft?.asset?.path}
                  alt='nft asset'
                />
              )}
              {nft?.lnft?.asset?.asset_type === 'movie' ||
              nft?.lnft?.asset?.asset_type === 'video/mp4' ? (
                <video
                  className='rounded-xl  h-[200px] md:h-[421px] w-[421px] object-cover max-w-full'
                  controls
                  loop
                  autoPlay
                  muted
                >
                  <source src={nft?.lnft?.asset?.path} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              ) : null}
              {nft?.lnft?.asset?.asset_type === 'audio' ||
              nft?.lnft?.asset?.asset_type === 'audio/mpeg' ? (
                <audio
                  src={nft?.lnft?.asset?.path}
                  controls
                  autoPlay={false}
                  className='rounded-xl h-[100px] w-[421px] object-cover max-w-full'
                />
              ) : null}

              <div className='flex mt-4 flex-wrap items-center justify-center'>
                <button
                  onClick={() => largeViewAsset()}
                  className='rounded bg-primary-900 bg-opacity-20 font-bold text-primary-900 px-4 py-2'
                >
                  View Large Asset
                </button>
                {nft?.lnft?.is_owner ? (
                  <button
                    onClick={() => setShowEmbedNFT(true)}
                    className='rounded-[4px] ml-4  px-4 py-2 border-[1px] font-black font-[14px] text-primary-900 border-primary-900'
                  >
                    Embed NFT
                  </button>
                ) : null}
              </div>
            </div>
            <div className='my-6 mx-4 md:ml-0 mr-4'>
              <p className='mb-2'>Share with link</p>
              <div className='w-fit flex items-center bg-primary-900/[0.2] rounded '>
                <div className='p-3 text-primary-900'>
                  <span className='font-black  mr-2'>
                    {typeof window !== 'undefined' && (
                      <>{window.location.href}</>
                    )}
                  </span>
                </div>
                <div className='text-primary-900 p-3'>
                  <i
                    className='fa-regular fa-copy text-lg cursor-pointer'
                    onClick={() => copyToClipboard()}
                  ></i>
                </div>
              </div>
              <p className='my-3'>Share on social media</p>
              {typeof window !== 'undefined' && (
                <div className='flex items-center'>
                  <FacebookShareButton url={window.location.href} quote={'NFT'}>
                    <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[35px] w-[35px] flex items-center justify-center mr-2'>
                      <Image src={FB} alt='facebook' />
                    </div>
                  </FacebookShareButton>
                  <TwitterShareButton title='NFT' url={window.location.href}>
                    <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[35px] w-[35px] flex items-center justify-center mr-2'>
                      <Image src={twitter} alt='twitter' />
                    </div>
                  </TwitterShareButton>
                  <RedditShareButton title='NFT' url={window.location.href}>
                    <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[35px] w-[35px] flex items-center justify-center'>
                      <Image src={reddit} alt='reddit' />
                    </div>
                  </RedditShareButton>
                </div>
              )}
            </div>
          </div>

          <div className='bg-white md:px-4 pt-0 mt-6 md:mt-0 flex-1 mx-4 md:mx-0'>
            <div className='flex items-center'>
              <h1 className='text-txtblack'>{nft?.lnft?.name}</h1>
              {info?.currency && (
                <Image className='ml-1 mt-1' src={tickIcon} alt='' />
              )}
            </div>
            <div>
              <Link
                className='!no-underline text-txtblack'
                href={`/collection/${collection?.id}`}
              >
                {collection?.name}
              </Link>
            </div>

            <div className='my-4 border border-primary-border shadow rounded-xl w-full   md:max-w-[564px] p-3'>
              <div className='p-4 rounded-xl gray-linear-gradient-background'>
                <p className='ml-2'>Price</p>
                <div className='flex flex-wrap items-center mt-2'>
                  <div>
                    {info?.currency ? (
                      <Image
                        className='h-[22px] w-[22px]'
                        src={currency[info?.currency]}
                        // src={info?.currency === 'eth' ? Eth : Polygon}
                        alt={'Currency Logo'}
                      />
                    ) : null}
                  </div>
                  <span className='uppercase text-[18px] ml-2 font-black text-txtblack'>
                    {info?.price} {''}
                    {info?.currency}
                  </span>
                  <span className='text text-[18px] text-textSubtle ml-2'>
                    (${usdValue})
                  </span>
                </div>
                <p className='text-sm	text-right'>
                  Powered by{' '}
                  <a
                    href='https://www.coingecko.com/'
                    target='_blank'
                    rel='noreferrer'
                    className='ml-1 font-bold'
                  >
                    CoinGecko
                  </a>
                </p>
              </div>
              <div className='mt-6'>
                <button
                  disabled={
                    nft?.lnft?.minted_amount >= nft?.lnft?.supply ||
                    !nft?.more_info?.currency
                  }
                  className={`w-[264px] !text-[16px] h-[44px]   ${
                    nft?.lnft?.minted_amount >= nft?.lnft?.supply
                      ? 'bg-color-asss-3 text-white'
                      : !nft?.more_info?.currency
                      ? 'bg-color-asss-3 text-white'
                      : 'contained-button'
                  }`}
                  onClick={handlePublishModal}
                >
                  {availableSupply > 0 ? 'BUY NOW' : 'SOLD OUT'}
                </button>
              </div>
            </div>

            <div className='flex items-center mb-4'>
              <span className='w-20 font-satoshi-bold font-black text-lg text-txtblack'>
                Duration
              </span>
              <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
                :
              </span>
              {info?.currency && info?.start_datetime ? (
                <span className='text-textSubtle leading-8'>
                  {format(new Date(info.start_datetime), 'dd/MM/yy (HH:mm)')} -{' '}
                  {format(new Date(info.end_datetime), 'dd/MM/yy (HH:mm)')}
                </span>
              ) : (
                'Not for sale'
              )}
            </div>
            <div className='flex mb-4'>
              <span className='w-20 font-satoshi-bold font-black text-lg text-txtblack'>
                Supply
              </span>
              <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
                :
              </span>
              <span className='text-textSubtle leading-8'>
                {formatNumber(availableSupply)} /{' '}
                {formatNumber(nft?.lnft?.supply)}
              </span>
            </div>
            <div className='flex items-center mb-4'>
              <h3 className='w-30  txtblack'>External Link</h3>
              <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
                :
              </span>
              {nft?.lnft?.external_url ? (
                <>
                  <a
                    onClick={() => openExternalLink()}
                    className='!no-underline cursor-pointer'
                    rel='noreferrer'
                  >
                    {nft?.lnft?.external_url}
                  </a>
                </>
              ) : (
                'No external url found'
              )}
            </div>
            <h3 className='txtblack'>Description:</h3>
            <p className='txtblack text-sm mb-4'>
              {nft?.lnft?.description
                ? nft?.lnft?.description
                : 'No description found'}
            </p>
            <h3 className='txtblack mb-4'>Attribute</h3>
            <div className='flex flex-wrap mb-6 md:max-w-[564px]'>
              {nft?.lnft?.attributes?.length ? (
                nft?.lnft?.attributes.map((item, index) => (
                  <div key={index}>
                    {item.key !== '' && (
                      <div
                        key={index}
                        className='min-w-[138px]  truncate p-3 min-h-28  mr-3 mb-3 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-10 flex items-center justify-center flex-col'
                      >
                        <p className='text-textSubtle mt-2 text-sm mb-1'>
                          {item.key}
                        </p>
                        <p className='text-primary-900 font-bold mb-2 mx-2'>
                          {item.value}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No attributes to show</p>
              )}
            </div>
            {nft?.lnft?.nft_type === 'membership' && (
              <div>
                <div className='flex mb-4 items-center flex-wrap md:max-w-[564px]'>
                  <h3 className='txtblack'>Benefit</h3>
                  {nft?.lnft?.is_owner && (
                    <Link
                      href={`/nft/membership/create?dao_id=${nft?.lnft?.project_uuid}&collection_id=${nft?.lnft?.collection_uuid}&nftId=${nft?.lnft?.id}`}
                      className='!no-underline txtblack text-primary-900 ml-auto mr-2 md:mr-0 font-black'
                    >
                      Edit Benefit
                    </Link>
                  )}
                </div>
                {benefits && benefits.length ? (
                  benefits.map((benefit, index) => (
                    <div
                      className='mb-3 p-4 md:max-w-[564px] rounded-xl border border-primary-900 bg-primary-900 bg-opacity-20 flex items-center'
                      key={index}
                    >
                      <div className='rounded-full text-white bg-primary-900 bg-opacity-90 w-[30px] h-[30px] font-satoshi-bold text-sm mr-4 flex items-center justify-center'>
                        {index + 1}
                      </div>
                      <p className='text-sm w-[90%]'>{benefit.title}</p>
                    </div>
                  ))
                ) : (
                  <p>No benefits to show</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
