import '../styles/common.css';
import dynamic from 'next/dynamic';
import 'rsuite/dist/rsuite.min.css';
import Header from 'components/Commons/TopHeader';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { DAppProvider } from '@usedapp/core';
import Sidebar from 'components/Commons/Sidebar';
import '../styles/globals.css';
import Script from 'next/script';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { useRouter } from 'next/router';
import Auth from 'components/Auth/Auth';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from '../redux';
import MetaHead from 'components/Commons/MetaHead/MetaHead';
import Head from 'next/head';
import Favicon from 'components/Commons/Favicon';
import axios from 'axios';
import Config from 'config/config';
import Maintenance from 'components/Commons/Maintenance';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import FloatingContactForm from 'components/Commons/FloatingContactForm';

dynamic(() => import('tw-elements'), { ssr: false });

export const persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEmbedView, setIsEmbedView] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isContentView, setIsContentView] = useState(false);
  const [isTokenGatedProjectPublicView, setIsTokenGatedProjectPublicView] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    const use = async () => {
      (await import('tw-elements')).default;
    };
    use();
  }, []);

  const handleToggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  const { data } = pageProps;
  const getMaintenanceInfo = async () => {
    await axios
      .get(`${Config.MAINTENANCE_MODE_URL}/status.json`)
      .then((res) => {
        if (res?.maintain) {
          setIsMaintenance(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getMaintenanceInfo();
    let path = typeof window !== 'undefined' && router?.asPath;
    let pathItems = path && path.split('/');
    let view =
      pathItems && pathItems.length ? pathItems.includes('embed-nft') : false;
    setIsEmbedView(view);
    let contentView =
      pathItems && pathItems.length ? pathItems.includes('content') : false;
    setIsContentView(contentView);
    let tokenGatedProjectPublicView =
      pathItems && pathItems.length ? pathItems.includes('public') : false;
    setIsTokenGatedProjectPublicView(tokenGatedProjectPublicView);
  }, [router?.asPath]);

  return (
    <>
      <GoogleAnalytics trackPageViews />
      <Head>
        <Favicon></Favicon>
      </Head>
      <MetaHead
        title={data?.title}
        description={data?.description}
        image={data?.image}
      />
      <Script
        src='https://kit.fontawesome.com/6ebe0998e8.js'
        crossorigin='anonymous'
      ></Script>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <DAppProvider config={{}}>
            {isMaintenance ? (
              <Maintenance />
            ) : (
              <Auth>
                <div className='bg-light'>
                  {!isEmbedView && (
                    <Header
                      handleSidebar={handleToggleSideBar}
                      setShowModal={setShowModal}
                      showModal={showModal}
                    />
                  )}
                  <main
                    className='container min-h-[calc(100vh-71px)]'
                    style={
                      isContentView
                        ? { width: '100%', maxWidth: '100%' }
                        : isTokenGatedProjectPublicView
                        ? { width: '100%', maxWidth: '100%' }
                        : {}
                    }
                  >
                    <div className='flex flex-row'>
                      {isEmbedView ||
                      isContentView ||
                      isTokenGatedProjectPublicView ? null : (
                        <div className='hidden md:block mr-4 '>
                          <Sidebar
                            setShowModal={setShowModal}
                            handleToggleSideBar={handleToggleSideBar}
                          />
                        </div>
                      )}
                      {isEmbedView ||
                      isContentView ||
                      isTokenGatedProjectPublicView ? null : (
                        <div
                          className={`${
                            showSideBar ? 'translate-x-0' : '-translate-x-full'
                          } block md:hidden mr-4 absolute z-[100] ease-in-out duration-300`}
                        >
                          <Sidebar
                            setShowModal={setShowModal}
                            handleToggleSideBar={handleToggleSideBar}
                          />
                        </div>
                      )}
                      <div className='w-full min-w-[calc(100vw-300px)]'>
                        <Component {...pageProps} />
                        <FloatingContactForm />
                        <ToastContainer
                          className='impct-toast'
                          position='top-right'
                          autoClose={3000}
                          newestOnTop
                          closeOnClick
                          rtl={false}
                          pauseOnVisibilityChange
                          draggable={false}
                          transition={Slide}
                        />
                      </div>
                    </div>
                  </main>
                </div>
              </Auth>
            )}
          </DAppProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
