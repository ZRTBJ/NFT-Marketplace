import ProfileContent from 'components/Profile/profileContent';
import { useRouter } from 'next/router';

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;
  return <ProfileContent id={id} />;
};

export default Profile;
