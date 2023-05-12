import Image from 'next/image';
import { useEffect } from 'react';
import audioWeb from 'assets/images/token-gated/audioWeb.svg';
import darkBg from 'assets/images/token-gated/darkBg.png';
import playIcon from 'assets/images/token-gated/audioPlay.svg';

const NFTStatusTable = ({ nfts }) => {
  const imageRegex = new RegExp('image');
  const TABLE_HEADERS = [
    { id: 0, label: 'Asset' },
    { id: 1, label: 'Name' },
    { id: 2, label: 'Status' },
  ];

  return (
    <div className='w-2/4 ml-auto'>
      <p className='mb-2'>NFT Publishing Status</p>
      <table className='w-full border border-gray-500 rounded-xl'>
        <tr className='border-collaspe border-b border-dashed border-gray-500'>
          {TABLE_HEADERS.map((header) => (
            <th key={header.id} className='w-1/4'>
              {header.label}
            </th>
          ))}
        </tr>
        {nfts.map((nft) => (
          <tr className='text-center' key={nft?.id}>
            <td className='w-1/4'>
              <div className='mb-2 ml-2 mt-1'>
                {imageRegex.test(nft?.asset?.asset_type) && (
                  <Image
                    className='rounded-xl h-[50px] w-[50px] object-cover'
                    src={nft?.asset?.path}
                    alt='nft asset'
                    width={30}
                    height={30}
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
                      height: '30px',
                      width: '30px',
                    }}
                  >
                    <div className='absolute  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md'>
                      <i className='fa-solid fa-circle-video gradient-text text-[20px]'></i>
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
                      height: '30px',
                      width: '30px',
                    }}
                  >
                    <Image
                      src={audioWeb}
                      className='w-full  absolute  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'
                      height={30}
                      width={30}
                      unoptimized
                      alt='play png'
                    ></Image>
                    <Image
                      src={playIcon}
                      className='absolute  m-auto top-0 bottom-0 left-0 right-0 block h-[30px] w-[30px] object-cover'
                      height={30}
                      width={30}
                      unoptimized
                      alt='play png'
                    ></Image>
                  </div>
                ) : null}
              </div>
            </td>
            <td className='w-1/4'>{nft?.name}</td>
            <td className='w-1/4'>
              {nft?.status === 'pending' ? (
                <i class='fa-sharp fa-regular fa-arrows-rotate animate-spin'></i>
              ) : (
                <svg
                  aria-hidden='true'
                  className='w-5 h-5 text-green-500 dark:text-green-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default NFTStatusTable;
