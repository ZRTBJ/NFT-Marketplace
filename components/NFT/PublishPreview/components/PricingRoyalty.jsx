import Tooltip from 'components/Commons/Tooltip';
import { walletAddressTruncate } from 'util/WalletUtils';
import { toast } from 'react-toastify';

const PricingRoyalty = ({ price, network, contributors }) => {
  const TABLE_HEADERS = [
    { id: 0, label: 'Wallet Address' },
    { id: 1, label: 'Name' },
    { id: 2, label: 'Percentage' },
    { id: 3, label: 'Role' },
  ];
  const copyToClipboard = (text) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      toast.success(`Link successfully copied`);
    }
  };

  return (
    <div className='section-collection mt-6 '>
      <div className='flex items-center'>
        <Tooltip message='Collection price and royalty setting will be saved to blockchain' />
        <h3>Pricing & Royalty</h3>
      </div>
      <div className='text-center mt-4 collection-content border shadow  py-3 rounded-xl'>
        <p className='border-b'>
          Base Price:{' '}
          <span className='font-bold'>
            {price} {network?.cryto}
          </span>
        </p>
        <div className='mt-2'>
          <p className='font-black mb-2'>Contributors</p>
          {contributors?.length ? (
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
                    <i
                      className='fa-solid fa-copy cursor-pointer ml-1'
                      onClick={() => copyToClipboard(item?.user_eoa)}
                    ></i>
                  </td>
                  <td className='w-1/4'>{item?.custom_name}</td>
                  <td className='w-1/4'>{item?.royalty_percent}%</td>
                  <td className='w-1/4'>{item?.custom_role}</td>
                </tr>
              ))}
            </table>
          ) : (
            <p>The Collection does not have any Contributors</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingRoyalty;
