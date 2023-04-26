import CollectionDetailsDraft from 'components/Collection/Draft/CollectionDetailsDraft';
import { useSelector } from 'react-redux';

const Draft = (query) => {
  const userinfo = useSelector((state) => state.user.userinfo);
  return <CollectionDetailsDraft userId={userinfo?.id} />;
};

export default Draft;
