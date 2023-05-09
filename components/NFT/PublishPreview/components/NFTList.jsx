import Tooltip from 'components/Commons/Tooltip';
import Image from 'next/image';
import audioWeb from 'assets/images/token-gated/audioWeb.svg';
import darkBg from 'assets/images/token-gated/darkBg.png';
import playIcon from 'assets/images/token-gated/audioPlay.svg';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
import Bnb from 'assets/images/network/bnb.svg';
import { cryptoConvert } from 'services/chainlinkService';
const imageRegex = new RegExp('image');
const currency = {
  eth: Eth,
  matic: Polygon,
  bnb: Bnb,
};
const NFTList = ({ nfts }) => {
  const TABLE_HEADERS = [
    { id: 0, label: 'Asset' },
    { id: 1, label: 'Name' },
    { id: 2, label: 'Pricing' },
    { id: 3, label: 'Supply' },
  ];

  console.log(nfts);
  return (
    <div className='section-collection mt-6'>
      <div className='flex items-center'>
        <Tooltip message='All NFT below will be saved to blockchain and ready to be minted' />
        <h3>NFT List</h3>
      </div>
      <div className='w-full mt-4 border-gray-300 border-2 border-dashed rounded-xl py-2 '>
        {nfts?.length ? (
          <table className='w-full text-left'>
            <thead>
              <tr className='border-b-2  border-dashed border-gray-300'>
                {TABLE_HEADERS.map((header) => (
                  <th scope='col' key={header.id} className='p-3 w-1/4'>
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {nfts.map((nft, index) => (
                <tr className='' key={index}>
                  <td className='p-3 w-1/4'>
                    <a target='blank' href={`${nft?.asset?.path}`}>
                      {imageRegex.test(nft?.asset?.asset_type) && (
                        <Image
                          className='rounded-xl h-[50px] w-[50px] object-cover'
                          src={nft?.asset?.path ? nft?.asset?.path : Cover}
                          alt='nft asset'
                          width={50}
                          height={50}
                          unoptimized
                        />
                      )}
                      {nft?.asset?.asset_type === 'movie' ||
                      nft?.asset?.asset_type === 'video/mp4' ? (
                        <div
                          className='rounded-xl relative'
                          style={{
                            backgroundImage: `url(${darkBg.src})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '50px',
                            width: '50px',
                          }}
                        >
                          <div className='absolute  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 social-icon-button cursor-pointer w-6 h-6  flex justify-center items-center rounded-md'>
                            <i className='fa-solid fa-circle-video gradient-text text-[18px]'></i>
                          </div>
                        </div>
                      ) : null}
                      {nft?.asset?.asset_type === 'audio' ||
                      nft?.asset?.asset_type === 'audio/mpeg' ? (
                        <div
                          className='rounded-xl relative'
                          style={{
                            backgroundImage: `url(${darkBg.src})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '50px',
                            width: '50px',
                          }}
                        >
                          <Image
                            src={audioWeb}
                            className='w-full  absolute  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'
                            height={100}
                            width={50}
                            unoptimized
                            alt='play png'
                          ></Image>
                          <Image
                            src={playIcon}
                            className='absolute  m-auto top-0 bottom-0 left-0 right-0 block h-[22px] w-[22px] object-cover'
                            height={30}
                            width={30}
                            unoptimized
                            alt='play png'
                          ></Image>
                        </div>
                      ) : null}
                    </a>
                  </td>
                  <td className='p-3 w-1/4'>
                    {nft?.name?.length > 15
                      ? nft?.name?.substring(0, 12) + '...'
                      : nft?.name}
                  </td>
                  <td className='p-3 w-1/4'>
                    <span className='text-[14px] font-bold'>
                      {nft?.more_info?.price}
                    </span>
                    <span className='uppercase text-[12px] ml-1'>
                      {nft?.more_info?.currency}
                    </span>
                    {nft?.more_info?.currency ? (
                      <>
                        <Image
                          className='inline-flex ml-2'
                          src={currency[nft?.more_info?.currency]}
                          alt='currency'
                          width={20}
                          height={20}
                        />
                      </>
                    ) : null}
                  </td>
                  <td className='p-3 w-1/4'>{nft?.supply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='text-center'>The Collection does not have any NFTs</p>
        )}
      </div>
    </div>
  );
};

export default NFTList;
