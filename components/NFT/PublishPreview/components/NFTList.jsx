import Image from 'next/image';

const NFTList = ({ nfts }) => {
  const TABLE_HEADERS = [
    { id: 0, label: 'Asset' },
    { id: 1, label: 'Name' },
    { id: 2, label: 'Pricing' },
    { id: 3, label: 'Supply' },
  ];
  return (
    <div className='section-collection mt-6'>
      <h3>NFT List</h3>
      <div className='w-full mt-2 border-gray-500 border border-dashed rounded-xl py-2 shadow-md'>
        {nfts?.length ? (
          <table className='w-full'>
            <tr className='border-collaspe border-b border-dashed border-gray-500'>
              {TABLE_HEADERS.map((header) => (
                <th key={header.id} className='w-1/4'>
                  {header.label}
                </th>
              ))}
            </tr>
            {nfts.map((nft, index) => (
              <tr className='text-center' key={index}>
                <td className='w-1/4'>
                  <Image
                    src={nft?.image}
                    height={50}
                    width={50}
                    alt='Collection'
                    className='mx-auto my-1'
                  />
                </td>
                <td className='w-1/4'>{nft?.label}</td>
                <td className='w-1/4'>{nft?.price}</td>
                <td className='w-1/4'>{nft?.supply}</td>
              </tr>
            ))}
          </table>
        ) : (
          <p className='text-center'>The Collection does not have any NFTs</p>
        )}
      </div>
    </div>
  );
};

export default NFTList;
