import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const PrivateRoutes = [
  'dashboard',
  'create',
  'dao/create',
  'collection-create',
  'profile-settings',
];

const Auth = ({ children }) => {
  const router = useRouter();
  const userinfo = useSelector((state) => state.user.userinfo);

  useEffect(() => {
    let paths = router?.asPath?.split('/');
    if (
      !userinfo?.id &&
      PrivateRoutes.some((routes) => paths.includes(routes))
    ) {
      router.push('/');
    }
  }, [router?.asPath]);
  return children;
};

export default Auth;
