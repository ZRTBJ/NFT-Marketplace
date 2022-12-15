import ProfileContent from 'components/Profile/profileContent';
import { useSelector } from 'react-redux';

const Profile = () => {
  const userinfo = useSelector((state) => state.user.userinfo);
  return <ProfileContent id={userinfo?.id} />;
};

export default Profile;
