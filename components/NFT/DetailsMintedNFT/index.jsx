import { useEffect, useState } from 'react';
import { getMintedNftDetails } from 'services/nft/nftService';
import opensea from 'assets/images/icons/opensea.svg';
import rarible from 'assets/images/icons/rarible.svg';
import Link from 'next/link';
import Spinner from 'components/Commons/Spinner';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'react-share';
import FB from 'assets/images/facebook.svg';
import twitter from 'assets/images/twitter.svg';
import reddit from 'assets/images/reddit.svg';
import { toast } from 'react-toastify';
import { getUserInfo } from 'services/User/userService';
import { NETWORKS } from 'config/networks';
import { refreshNFT } from 'services/nft/nftService';
import ErrorModal from 'components/Modals/ErrorModal';
import { updateMetadata } from 'components/Profile/update-metadata';
import { createProvider } from 'util/smartcontract/provider';
import { createMintInstance } from 'config/ABI/mint-nft';
import { getCollectionDetailsById } from 'services/collection/collectionService';
import tickIcon from 'assets/images/tick.svg';
import Config from 'config/config';
import Image from 'next/image';

export default function DetailsNFT({ nftId, tokenId }) {
  const provider = createProvider();
  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNft] = useState({});
  const imageRegex = new RegExp('image');
  const [owner, setOwner] = useState({});
  const [refreshingNft, setRefreshingNft] = useState(false);
  const [nftErrorModalMessage, setNftErrorModalMessage] = useState('');
  const [nftErrorModal, setNftErrorModal] = useState(false);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const [collection, setCollection] = useState({});

  useEffect(() => {
    if (nftId && tokenId) {
      nftDetails();
    }
  }, [nftId]);
  async function nftDetails() {
    let nftOwnerId = '';
    let collectionId = '';
    await getMintedNftDetails(nftId, tokenId)
      .then((resp) => {
        if (resp.code === 0) {
          if (resp?.lnft?.metadata_url) {
            resp.lnft.ipfsUrl = `${Config.PINATA_URL}${resp?.lnft?.metadata_url}`;
          }
          if (resp?.mint_info?.refresh_status === 'required') {
            setShowRefreshButton(true);
          }
          setNft(resp);
          nftOwnerId = resp?.mint_info?.owner_uuid;
          collectionId = resp?.lnft?.collection_uuid;
        } else {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
    if (nftOwnerId) {
      await getUserInfo(nftOwnerId)
        .then((response) => {
          if (response.code === 0) {
            setOwner(response.user);
          } else {
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
    if (collectionId) {
      let payload = {
        id: collectionId,
      };
      await getCollectionDetailsById(payload)
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
  function largeViewAsset() {
    if (typeof window !== 'undefined') {
      window.open(`${nft?.lnft?.asset?.path}`, '_blank');
    }
  }
  function goToOpenSea() {
    const URL = `${NETWORKS[nft?.mint_info?.blockchain].openSeaNFTDetailsUrl}${
      nft?.mint_info?.contract_address
    }/${nft?.mint_info?.token_id}`;
    if (typeof window !== 'undefined') {
      window.open(URL, '_blank');
    }
  }
  function goToRaribale() {
    const URL = `${NETWORKS[nft?.mint_info?.blockchain].raribleNFTDetailsUrl}${
      nft?.mint_info?.contract_address
    }:${nft?.mint_info?.token_id}?tab=overview`;
    if (typeof window !== 'undefined') {
      window.open(URL, '_blank');
    }
  }
  async function refreshNFTWithtnx(payload) {
    return await refreshNFT(payload);
  }
  async function onRefreshNft() {
    // 1. set Loading true start
    setRefreshingNft(true);
    // 1. set loading true end

    // 2. call refresh api for getting config object
    const payload = {
      id: nftId,
      tokenId: tokenId,
    };
    let config = {};
    let hasConfigForNft = false;

    await refreshNFT(payload)
      .then((res) => {
        if (res.code === 0) {
          config = res.config;
          hasConfigForNft = true;
        } else {
          setNftErrorModalMessage(res.message);
          setNftErrorModal(true);
          setRefreshingNft(false);
        }
      })
      .catch((error) => {
        setNftErrorModalMessage(
          'Can not refresh right now,please Try Again later'
        );
        setNftErrorModal(true);
        setRefreshingNft(false);
      });
    if (hasConfigForNft) {
      try {
        const erc721CollectionContract = createMintInstance(
          config.collection_contract_address,
          provider
        );
        const result = await updateMetadata(
          erc721CollectionContract,
          provider,
          config
        );
        if (result) {
          const data = {
            id: nftId,
            tokenId: tokenId,
            tnxHash: result,
          };
          await refreshNFTWithtnx(data)
            .then((res) => {
              if (res.code === 0) {
                if (res.function.status === 'success') {
                  setRefreshingNft(false);
                  toast.success(
                    `Successfully refreshed ${nft?.lnft?.name} NFT`
                  );
                  setShowRefreshButton(false);
                }
                if (res.function.status === 'failed') {
                  setRefreshingNft(false);
                  setShowRefreshButton(true);
                  toast.error(`Error, ${res.function.message}`);
                }
              } else {
                setNftErrorModalMessage(res.message);
                setNftErrorModal(true);
                setRefreshingNft(false);
              }
            })
            .catch((err) => {
              setNftErrorModalMessage(err);
              setNftErrorModal(true);
              setRefreshingNft(false);
            });
        } else {
          setRefreshingNft(false);
        }
      } catch (error) {
        setRefreshingNft(false);
        toast.error(`Unexpected error or cancelled, Please try again`);
      }
    } else {
      setRefreshingNft(false);
    }
  }
  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
    }
    toast.success(`Link successfully copied`);
  };

  let info = nft?.more_info;
  let benefits = info?.benefits && JSON.parse(nft.more_info.benefits);

  return (
    <>
      {isLoading && <div className='loading'></div>}
      {!isLoading && (
        <section className='flex flex-col lg:flex-row py-5'>
          <div className='flex-1 w-full md:max-w-[471px] '>
            <div className='bg-white rounded-xl shadow border border-border-primary flex flex-col items-center justify-start self-start p-4 ml-4 md:ml-0 mr-4 mb-5 md:mb-0'>
              {imageRegex.test(nft?.lnft?.asset?.asset_type) && (
                <Image
                  className='rounded-xl  h-[200px] md:h-[421px] w-[421px] object-cover max-w-full'
                  src={nft?.lnft?.asset?.path}
                  alt='nft asset'
                  unoptimized
                  height={200}
                  width={421}
                />
              )}
              {nft?.lnft?.asset?.asset_type === 'movie' ||
              nft?.lnft?.asset?.asset_type === 'video/mp4' ? (
                <video
                  className='rounded-xl  h-[200px] md:h-[421px] w-[421px] object-cover max-w-full'
                  controls
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
                {showRefreshButton && (
                  <>
                    {refreshingNft ? (
                      <button className='rounded contained-button font-bold ml-4  !px-6 py-2'>
                        <Spinner forButton={true} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onRefreshNft()}
                        className='rounded contained-button font-bold ml-4  !px-6 py-2'
                      >
                        Refresh
                      </button>
                    )}
                  </>
                )}
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
              <div className='flex items-center'>
                {typeof window !== 'undefined' && (
                  <>
                    <FacebookShareButton
                      url={window.location.href}
                      quote={'NFT'}
                    >
                      <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[35px] w-[35px] flex items-center justify-center mr-2'>
                        <Image height={16} width={16} src={FB} alt='facebook' />
                      </div>
                    </FacebookShareButton>
                    <TwitterShareButton url={window.location.href}>
                      <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[35px] w-[35px] flex items-center justify-center mr-2'>
                        <Image
                          height={16}
                          width={16}
                          src={twitter}
                          alt='twitter'
                        />
                      </div>
                    </TwitterShareButton>
                    <RedditShareButton url={window.location.href}>
                      <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[35px] w-[35px] flex items-center justify-center'>
                        <Image
                          height={16}
                          width={16}
                          src={reddit}
                          alt='reddit'
                        />
                      </div>
                    </RedditShareButton>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className='bg-white md:px-4 pt-0 mt-6 md:mt-0 flex-1 mx-4 md:mx-0'>
            <div className='flex items-center'>
              <h1 className='text-txtblack'>{nft?.lnft?.name}</h1>
              <Image className='ml-1 mt-1' src={tickIcon} alt='' />
            </div>
            <p className='txtblack text-sm pb-4 mt-4'>Find it On</p>
            <div className='mb-4 flex items-center'>
              <div
                onClick={() => goToOpenSea()}
                className='inline-flex items-center mr-3 cursor-pointer border border-color-blue p-3 text-color-blue font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-color-blue hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out'
              >
                <Image src={opensea} alt='opensea' className='mr-1' />
                Opensea
              </div>
              <div
                onClick={() => goToRaribale()}
                className='inline-flex cursor-pointer items-center mr-3 border border-color-yellow p-3 text-color-yellow font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-color-yellow hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out'
              >
                <Image src={rarible} alt='rarible' className='mr-1' />
                Rarible
              </div>
            </div>
            <div className='my-4 border border-primary-border shadow rounded-xl w-full   md:max-w-[564px] p-3'>
              <div className='mt-2 ml-4 '>
                <div className='flex items-center mb-4'>
                  <h3 className='w-30  txtblack'>Contract Address</h3>
                  <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
                    :
                  </span>
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    className='no-underline'
                    href={`${
                      NETWORKS[nft?.mint_info?.blockchain]
                        .viewContractAddressUrl
                    }${nft?.mint_info?.contract_address}`}
                  >
                    {nft?.mint_info?.contract_address
                      ? nft?.mint_info?.contract_address
                      : 'No contract address found'}
                  </a>
                </div>
                <div className='flex items-center mb-4'>
                  <h3 className='w-30  txtblack'>Token ID</h3>
                  <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
                    :
                  </span>
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    className='no-underline'
                    href={`${nft?.lnft?.ipfsUrl}`}
                  >
                    {nft?.mint_info?.token_id
                      ? nft?.mint_info?.token_id
                      : 'No token id found'}
                  </a>
                </div>
                <div className='flex items-center mb-4'>
                  <h3 className='w-30  txtblack'>BlockChain</h3>
                  <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
                    :
                  </span>
                  <Image
                    src={`${
                      NETWORKS[parseInt(nft?.mint_info?.blockchain)]?.icon?.src
                    }`}
                    alt=''
                    className='h-[20px] w-[20px] mr-1'
                    height={20}
                    width={20}
                  />
                  {NETWORKS[nft?.mint_info?.blockchain].networkName}
                </div>
                <div className='flex items-center mb-4'>
                  <h3 className='w-35  txtblack'>Collection</h3>
                  <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
                    :
                  </span>
                  <Link
                    className='!no-underline'
                    href={`/collection-details/${collection?.id}`}
                  >
                    {collection?.name}
                  </Link>
                </div>
                <div className='flex items-center mb-4'>
                  <h3 className='w-35  txtblack'>Minted by</h3>
                  <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
                    :
                  </span>
                  <Link
                    href={`/profile/${owner?.id}`}
                    className='break-all !no-underline'
                  >
                    {owner?.display_name ? owner?.display_name : 'View profile'}
                  </Link>
                </div>
              </div>
            </div>
            <div className='flex items-center mb-4'>
              <h3 className='w-30  txtblack'>External Link</h3>
              <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
                :
              </span>
              {nft?.lnft?.external_url ? (
                <>
                  <a
                    href={nft?.lnft?.external_url}
                    target='_blank'
                    className='!no-underline'
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
                  <h3 className='txtblack'>Benefits</h3>
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
      {nftErrorModal && (
        <ErrorModal
          message={nftErrorModalMessage}
          buttonText={'Close'}
          handleClose={() => {
            setNftErrorModal(false);
            setNftErrorModalMessage('');
          }}
          show={nftErrorModal}
        />
      )}
    </>
  );
}
