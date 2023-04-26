import { useState } from 'react';
import CollectionPreview from './components/CollectionPreview';
import PricingRoyalty from './components/PricingRoyalty';
import NFTList from './components/NFTList';
import PublishingModal from './components/PublishingModal';

const PublishPreview = () => {
  const [showPublishing, setShowPublishing] = useState(false);
  return (
    <div className='pt-6 md:pt-0 md:mt-[40px] mx-10 mb-10'>
      <h2 className='text-center'>Publish Preview</h2>
      <div className='max-w-[600px]  mx-4 md:mx-auto pt-5'>
        <CollectionPreview />
        <PricingRoyalty />
        <NFTList />
        <div className='w-full mt-8'>
          <button
            className='contained-button mx-auto block shadow-md'
            onClick={() => setShowPublishing(true)}
          >
            Publish to Blockchain
          </button>
        </div>
      </div>
      {showPublishing && (
        <PublishingModal
          show={showPublishing}
          handleClose={() => setShowPublishing(false)}
        />
      )}
    </div>
  );
};

export default PublishPreview;
