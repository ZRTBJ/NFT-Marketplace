import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const PrivateRoutes = [
  '/dashboard',
  '/profile/settings',
  '/token-gated/[id]',
  '/notifications',
  '/transactions',
];

const Auth = ({ children }) => {
  const router = useRouter();
  const userinfo = useSelector((state) => state.user.userinfo);

  useEffect(() => {
    let path = router?.pathname;
    let absolutePath = router?.asPath;
    if (
      !userinfo?.id &&
      PrivateRoutes.some(
        (route) => path === route && absolutePath !== '/token-gated/new-draft'
      )
    ) {
      router.push('/');
    }
  }, [router?.asPath]);
  return children;
};

export default Auth;
