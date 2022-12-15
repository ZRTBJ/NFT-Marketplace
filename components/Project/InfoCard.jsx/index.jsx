import bigImg from 'assets/images/gallery/big-img.svg';
import tickSvg from 'assets/images/icons/tick.svg';
import { walletAddressTruncate } from 'util/WalletUtils';
import avatar from 'assets/images/dummy-img.svg';
import SocialLink from 'components/Commons/SocialLink';
import Link from 'next/link';
import { NETWORKS } from 'config/networks';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Image from 'next/image';

const InfoCard = ({
  coverImages,
  project,
  links,
  setShowTransferFundModal,
  handlePublishModal,
  getProjectNetWorth,
  balanceLoading,
  newWorth,
  collection,
}) => {
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
  }
  return (
    <div className='bg-[#122478]/[0.03]  rounded-xl mt-4 pt-4 px-4 md:py-8 md:px-6'>
      <div className='flex flex-col md:flex-row '>
        <div className='md:w-2/3 '>
          <div className='flex'>
            <Image
              src={coverImages?.path ? coverImages.path : bigImg}
              className='rounded-full self-start w-14 h-14 md:w-[98px] object-cover md:h-[98px] bg-color-ass-6'
              alt='User profile'
              width={98}
              height={98}
            />
            <div className='flex-1 min-w-0  px-4'>
              <div className='flex items-center mb-1 md:mb-2'>
                <h2 className='truncate'>{project.name}</h2>
                {project?.project_status === 'published' && (
                  <Image className='ml-1 mt-1' src={tickSvg} alt='' />
                )}
              </div>

              <p className='text-textLight text-sm '>
                {project?.contract_address
                  ? walletAddressTruncate(project.contract_address)
                  : 'Smart Contract not released'}
                <i
                  className={`fa-solid fa-copy ml-2 ${
                    project?.contract_address
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed'
                  }`}
                  disabled={!project?.contract_address}
                  onClick={() => copyToClipboard(project?.contract_address)}
                ></i>
                <span id='copied-message' className='hidden ml-2'>
                  Copied !
                </span>
              </p>
            </div>
          </div>
        </div>

        <div
          className='flex flex-wrap mt-5 items-start md:justify-end md:w-1/3 md:mt-0'
          role='group'
        >
          <div className='flex items-center'>
            {project &&
              project.members &&
              project.members.length > 0 &&
              project.members.map((img, index) => (
                <div key={`member-img-${index}`}>
                  {index < 5 && (
                    <Image
                      className='rounded-full object-cover w-9 h-9 mr-2 border-2 border-white'
                      src={img.avatar ? img.avatar : avatar}
                      alt=''
                      width={36}
                      height={36}
                    />
                  )}
                </div>
              ))}
            {project && project.members && project.members.length > 5 && (
              <span className='ml-2 bg-primary-900 bg-opacity-5  text-primary-900 rounded p-1 text-xs  '>
                +{project.members.length - 5}
              </span>
            )}
          </div>
          <SocialLink links={links} />
        </div>
      </div>
      <div className='mt-2'>
        <h3>About</h3>
        <div className='lg:flex'>
          <div className='whitespace-pre-line  text-textLight text-sm break-normal w-full md:max-w-[800px] md:flex md:flex-col justify-between'>
            <ReactReadMoreReadLess
              className='dao-details-read-less-more'
              charLimit={400}
              readMoreText={'Read more ▼'}
              readLessText={'Read less ▲'}
              readMoreClassName='font-bold'
              readLessClassName='font-bold'
            >
              {project?.overview
                ? project.overview
                : 'Please add description to show here'}
            </ReactReadMoreReadLess>
            <div className={`flex mt-4 mb-4 md:mb-0`}>
              {project?.is_owner && (
                <>
                  {project?.project_status === 'published' ? (
                    <>
                      <button
                        onClick={() => setShowTransferFundModal(true)}
                        className='contained-button w-[120px] text-center !px-0 mr-4 cursor-pointer font-satoshi-bold cursor-pointer'
                      >
                        Transfer Funds
                      </button>
                      <Link href={`/dao/create?id=${project?.id}`}>
                        <button className='outlined-button w-[120px] text-center !px-0 mr-4 cursor-pointer font-satoshi-bold cursor-pointer'>
                          <span className='gradient-text'>Edit</span>
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handlePublishModal}
                        className='contained-button w-[120px] text-center !px-0 mr-4 cursor-pointer font-satoshi-bold cursor-pointer'
                      >
                        Publish
                      </button>
                      <Link href={`/dao/create?id=${project?.id}`}>
                        <button className='outlined-button w-[120px] text-center !px-0 mr-4 cursor-pointer font-satoshi-bold cursor-pointer'>
                          <span className='gradient-text'>Edit</span>
                        </button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className='md:flex md:items-center pb-4 md:pb-0  md:ml-auto md:flex-wrap   md:mt-0'>
            {project?.project_status === 'published' ? (
              <div className='bg-[#122478]/[0.05]    rounded-md py-4 px-4 relative w-full md:min-w-[260px]'>
                <div className='flex'>
                  <p className=' text-textSubtle mt-1'>
                    Net Worth{' '}
                    <i
                      onClick={getProjectNetWorth}
                      className={`fa-regular fa-arrows-rotate text-textSubtle text-sm ${
                        balanceLoading ? 'fa-spin' : ''
                      } cursor-pointer`}
                    ></i>
                  </p>
                  <div className='ml-auto'>
                    <p className='pb-0 text-black font-black text-[16px] md:text-[20px] '>
                      {newWorth?.balance} {newWorth?.currency?.toUpperCase()}
                    </p>
                    <p className='text-sm  mt-0 text-textSubtle'>
                      (${newWorth?.balanceUSD?.toFixed(2)})
                    </p>
                  </div>
                </div>
                <div className='flex items-center mb-1'>
                  <p className=' text-textSubtle mt-1'>Collections</p>
                  <div className='ml-auto'>
                    <p className='text-black mr-2 text-black font-black text-[16px] md:text-[20px]'>
                      {collection?.total}
                    </p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <p className=' text-textSubtle mt-1'>BlockChain</p>
                  <div className='ml-auto'>
                    <Image
                      src={NETWORKS[Number(project?.blockchain)].icon}
                      className=' h-[24px] w-[24px] object-cover rounded-full'
                      alt=''
                      height={24}
                      width={24}
                    />
                  </div>
                </div>
                <div className='text-right mt-2 mr-2'>
                  <p className='text-sm	 mt-1'>
                    Powered by{' '}
                    <a
                      target='_blank'
                      rel='noreferrer'
                      className='ml-1 font-bold'
                      href='https://www.coingecko.com/'
                    >
                      CoinGecko
                    </a>
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
