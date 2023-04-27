import Image from 'next/image';
import { useEffect } from 'react';

const NFTStatusTable = ({ nfts }) => {
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
              <Image
                src={nft.asset}
                height={30}
                width={30}
                alt='NFT'
                className='mx-auto my-1'
              />
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
