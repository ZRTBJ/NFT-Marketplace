import { useEffect, useState } from 'react';
import { getNftDetails } from 'services/nft/nftService';
import manImg from 'assets/images/defaultImage.svg';
import opensea from 'assets/images/icons/opensea.svg';
import rarible from 'assets/images/icons/rarible.svg';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import SuccessModal from 'components/modalDialog/SuccessModal';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'react-share';
import FB from 'assets/images/facebook.svg';
import twitter from 'assets/images/twitter.svg';
import reddit from 'assets/images/reddit.svg';

export default function DetailsNFT() {
  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNft] = useState({});
  const [comingSoon, setComingSoon] = useState(false);
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
        console.log(e);
        setIsLoading(false);
      });
  }

  const copyToClipboardShare = (text) => {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-share-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
  };

  let info =
    nft?.lnft?.nft_type === 'membership' ? nft?.more_info : nft?.sale_info;

  let benefits = info?.benefits && JSON.parse(nft.more_info.benefits);
  let availableSupply = nft?.lnft?.supply - nft?.lnft?.minted_amount;
  return (
    <>
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

      <section className='flex flex-col lg:flex-row py-5'>
        <div className='flex-1'>
          <div className='bg-white rounded-xl shadow-main flex flex-col items-center justify-start self-start p-4 mr-4 mb-5 md:mb-0'>
            <img
              src={nft?.lnft?.asset?.path ? nft?.lnft?.asset?.path : manImg}
              className='rounded-3xl h-[356px] w-[356px] object-cover max-w-full'
              alt='nft'
            />
            <div className='rounded bg-success-1 bg-opacity-20 font-satoshi-bold text-success-1 font-black p-4 mt-4'>
              {info?.price} MATIC
            </div>
          </div>
          {nft?.lnft?.invitation_code && (
            <div className='bg-white rounded-xl shadow-main mt-3 flex flex-col items-center justify-start self-start p-4 mr-4 mb-5 md:mb-0'>
              <div className='mt-2'>
                <p className='text-[14px] text-center text-[#5F6479] mb-1'>
                  Share with link
                </p>
                <div className='relative w-fit'>
                  <p
                    className='text-[16px] block py-[10px] pl-[15px] pr-[40px]  text-primary-900 bg-primary-50 w-full rounded-[12px]'
                    id='iframe'
                  >
                    Link:{' '}
                    <span className='font-black'>
                      {origin}/{nft?.lnft?.invitation_code}
                    </span>
                  </p>
                  <div className='text-primary-900 absolute top-2 right-2'>
                    <i
                      className='fa fa-copy text-lg cursor-pointer'
                      onClick={() =>
                        copyToClipboardShare(
                          `${origin}/${nft?.lnft?.invitation_code}`
                        )
                      }
                    ></i>
                  </div>
                  <p
                    id='copied-share-message'
                    className='hidden text-green-500 text-[14px] text-center'
                  >
                    Copied Successfully!
                  </p>
                </div>
              </div>
              <div>
                <p className='text-[14px] text-[#5F6479] text-center mt-[46px] mb-1'>
                  Share on Social Media
                </p>
                <div className='flex items-center'>
                  <FacebookShareButton
                    url={`${origin}/${nft?.lnft?.invitation_code}`}
                    quote={'NFT'}
                  >
                    <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2'>
                      <img src={FB} alt='facebook' />
                    </div>
                  </FacebookShareButton>
                  <TwitterShareButton
                    title='NFT'
                    url={`${origin}/${nft?.lnft?.invitation_code}`}
                  >
                    <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2'>
                      <img src={twitter} alt='twitter' />
                    </div>
                  </TwitterShareButton>
                  <RedditShareButton
                    title='NFT'
                    url={`${origin}/${nft?.lnft?.invitation_code}`}
                  >
                    <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center'>
                      <img src={reddit} alt='reddit' />
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

        <div className='bg-white rounded-xl shadow-main p-4 flex-1'>
          <h1 className='txtblack pb-4'>{nft?.lnft?.name}</h1>
          <p className='txtblack text-sm pb-4'>Find it On</p>
          <div className='mb-4'>
            <a
              onClick={() => setComingSoon(true)}
              className='inline-flex items-center mr-3 border border-color-blue p-3 text-color-blue font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-color-blue hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out'
            >
              <img src={opensea} alt='opensea' className='mr-1' />
              Opensea
            </a>
            <a
              onClick={() => setComingSoon(true)}
              className='inline-flex items-center mr-3 border border-color-yellow p-3 text-color-yellow font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-color-yellow hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out'
            >
              <img src={rarible} alt='rarible' className='mr-1' />
              Rarible
            </a>
          </div>
          <div className='flex mb-4'>
            <span className='w-20 font-satoshi-bold font-black text-lg text-txtblack'>
              Duration
            </span>
            <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
              :
            </span>
            {info?.start_datetime ? (
              <span className='text-textSubtle'>
                {format(new Date(info.start_datetime), 'dd/MM/yy (HH:mm)')} -{' '}
                {format(new Date(info.end_datetime), 'dd/MM/yy (HH:mm)')}
              </span>
            ) : null}
          </div>
          <div className='flex mb-4'>
            <span className='w-20 font-satoshi-bold font-black text-lg text-txtblack'>
              Supply
            </span>
            <span className='font-satoshi-bold font-black text-lg text-txtblack mx-3'>
              :
            </span>
            <span className='text-textSubtle'>
              {availableSupply} / {nft?.lnft?.supply}
            </span>
          </div>
          <h3 className='txtblack'>Description</h3>
          <p className='txtblack text-sm mb-4'>{nft?.lnft?.description}</p>
          <h3 className='txtblack mb-4'>Attribute</h3>
          <div className='flex flex-wrap'>
            {nft?.lnft?.attributes?.length ? (
              nft?.lnft?.attributes.map((item, index) => (
                <div
                  key={index}
                  className='w-[138px] h-28  mr-3 mb-3 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-10 flex items-center justify-center flex-col'
                >
                  <p className='text-textSubtle text-sm mb-1'>{item.key}</p>
                  <h5 className='text-primary-900 mb-1'>{item.value}</h5>
                  {/* <p className='text-textSubtle text-sm'>Add 5% this trait</p> */}
                </div>
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
          {nft?.lnft?.nft_type === 'membership' && (
            <div>
              <h3 className='txtblack mb-4'>Benefit</h3>
              {benefits && benefits.length ? (
                benefits.map((benefit, index) => (
                  <div
                    className='mb-3 p-4 rounded-xl border border-primary-900 bg-primary-900 bg-opacity-20 flex items-center'
                    key={index}
                  >
                    <div className='rounded-full bg-primary-900 bg-opacity-90 w-[30px] h-[30px] font-satoshi-bold text-sm mr-4 flex items-center justify-center'>
                      {index + 1}
                    </div>
                    <p className='text-sm'>{benefit.title}</p>
                  </div>
                ))
              ) : (
                <p>No benefits to show</p>
              )}
            </div>
          )}
        </div>
      </section>
      {isLoading && <div className='loading'></div>}
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
