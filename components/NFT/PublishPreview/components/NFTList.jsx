import Image from 'next/image';
import MockImage from 'assets/images/magic-wallet.png';

const NFTList = () => {
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
        <table className='w-full'>
          <tr className='border-collaspe border-b border-dashed border-gray-500'>
            {TABLE_HEADERS.map((header) => (
              <th key={header.id} className='w-1/4'>
                {header.label}
              </th>
            ))}
          </tr>
          <tr className='text-center'>
            <td className='w-1/4'>
              <Image
                src={MockImage}
                height={50}
                width={50}
                alt='Collection'
                className='mx-auto my-1'
              />
            </td>
            <td className='w-1/4'>Maria</td>
            <td className='w-1/4'>0.4 ETH</td>
            <td className='w-1/4'>3</td>
          </tr>
          <tr className='text-center'>
            <Image
              src={MockImage}
              height={50}
              width={50}
              alt='Collection'
              className='mx-auto my-1'
            />
            <td>Chang</td>
            <td>0.9 ETH</td>
            <td>5</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default NFTList;
