import { walletAddressTruncate } from 'util/WalletUtils';

const PricingRoyalty = ({ price, network, contributors }) => {
  const TABLE_HEADERS = [
    { id: 0, label: 'Wallet Address' },
    { id: 1, label: 'Name' },
    { id: 2, label: 'Percentage' },
    { id: 3, label: 'Role' },
  ];

  return (
    <div className='section-collection mt-6 '>
      <h3>Pricing & Royalty</h3>
      <div className='shadow-md text-center mt-2 collection-content border-gray-500 border border-dashed  py-3 rounded-xl'>
        <p className='border-b border-dashed border-gray-500'>
          Base Price:{' '}
          <span className='font-bold'>
            {price} {network?.cryto}
          </span>
        </p>
        <div className='mt-2'>
          <p className='font-black mb-2'>Contributors</p>
          {contributors.length ? (
            <table className='w-full'>
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th key={header.id} className='w-1/4'>
                    {header.label}
                  </th>
                ))}
              </tr>
              {contributors.map((item) => (
                <tr className='text-center' key={item?.user_eoa}>
                  <td className='w-1/4'>
                    {walletAddressTruncate(item?.user_eoa)}
                  </td>
                  <td className='w-1/4'>{item?.custom_name}</td>
                  <td className='w-1/4'>{item?.royalty_percent}%</td>
                  <td className='w-1/4'>{item?.custom_role}</td>
                </tr>
              ))}
            </table>
          ) : (
            <p>No Contributors</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingRoyalty;
