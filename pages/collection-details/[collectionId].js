import CollectionContent from 'components/Collection/CollectionContent';
import { useRouter } from 'next/router';

const CollectionDetails = () => {
  const router = useRouter();
  const { collectionId } = router.query;
  return <CollectionContent collectionId={collectionId} />;
};

export default CollectionDetails;
