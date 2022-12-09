import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import MetaHead from 'components/Commons/MetaHead/MetaHead';

export default function Home() {
  const userinfo = useSelector((state) => state.user.userinfo);
  const router = useRouter();
  useEffect(() => {
    if (userinfo?.id) {
      router.push(`/profile/${userinfo.id}`);
    }
  }, [userinfo?.id]);
  return (
    <>
      <MetaHead />
      <div className={styles.container}>
        <>
          <WalletConnectModal
            showModal={true}
            showCloseMenu={false}
            closeModal={() => null}
            noRedirection={false}
            navigateToPage={false}
          />
        </>
      </div>
    </>
  );
}
