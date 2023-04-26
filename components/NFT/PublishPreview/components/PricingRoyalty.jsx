const PricingRoyalty = () => {
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
          Base Price: <span className='font-bold'>0.01 ETH</span>
        </p>
        <div className='mt-2'>
          <p className='font-black mb-2'>Contributors</p>
          <table className='w-full'>
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th key={header.id} className='w-1/4'>
                  {header.label}
                </th>
              ))}
            </tr>
            <tr className='text-center'>
              <td className='w-1/4'>0xd98d...6443</td>
              <td className='w-1/4'>Maria</td>
              <td className='w-1/4'>50%</td>
              <td className='w-1/4'>Owner</td>
            </tr>
            <tr className='text-center'>
              <td>0xd98d...6443</td>
              <td>Chang</td>
              <td>50%</td>
              <td>Contributor</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricingRoyalty;
