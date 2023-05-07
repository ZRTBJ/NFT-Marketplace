import Image from 'next/image';

const CollectionPreview = ({ tokenStandard, collection, network }) => {
  const collectionLogo = collection?.assets.find(
    (asset) => asset.asset_purpose === 'logo'
  );

  return (
    <div className='section-collection'>
      <h3>Collection</h3>
      <div className='shadow-md mt-2 collection-content border-gray-500 border border-dashed px-4 py-3 rounded-xl'>
        <div className='flex items-center mb-8'>
          <Image
            src={collectionLogo?.path}
            alt='Collection'
            className='object-cover w-[200px] h-[200px]'
            unoptimized
            width={200}
            height={200}
          />

          <div className='flex items-start ml-8'>
            <div>
              <p>
                <span className='block text-xs text-gray-400'>Name</span>
                {collection?.name}
              </p>
              <p>
                <span className='block text-xs text-gray-400'>Token</span>
                {tokenStandard}
              </p>
              <p>
                <span className='block text-xs text-gray-400'>Chain</span>
                <span className='flex'>
                  {network?.networkName}{' '}
                  <Image
                    src={network?.icon?.src}
                    height={network?.icon?.height}
                    width={network?.icon?.width}
                    alt='Chain Icon'
                    className='ml-1'
                  />
                </span>
              </p>
            </div>
            <div className='ml-4'>
              <p>
                <span className='block text-xs text-gray-400'>Symbol</span>
                {collection?.collection_symbol}
              </p>
              <p>
                <span className='block text-xs text-gray-400'>Supply</span>
                {collection?.total_supply}
              </p>
            </div>
          </div>
        </div>
        <p className='text-center text-sm'>
          NFT {collection?.token_transferable ? 'can' : 'can not'} be
          transferable (Soulbound token)
        </p>
        {collection?.token_limit_duration ? (
          <p className='text-center text-sm'>
            NFT having limited time (Timebound token)
          </p>
        ) : null}

        <div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPreview;
