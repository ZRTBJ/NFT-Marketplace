import '../styles/common.css';
import 'rsuite/dist/rsuite.min.css';
import Header from 'components/Commons/TopHeader';
import { useState } from 'react';
import store from 'redux/store';
import { Provider } from 'react-redux';
import { DAppProvider } from '@usedapp/core';
import Sidebar from 'components/Commons/Sidebar';
import '../styles/globals.css';
import Script from 'next/script';
// import 'tw-elements';

function MyApp({ Component, pageProps }) {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleToggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };
  return (
    <>
      <Script
        src='https://kit.fontawesome.com/6ebe0998e8.js'
        crossorigin='anonymous'
      ></Script>
      <Provider store={store}>
        <DAppProvider config={{}}>
          <div className='bg-light'>
            <Header
              handleSidebar={handleToggleSideBar}
              setShowModal={setShowModal}
              showModal={showModal}
            />
            <main className='container min-h-[calc(100vh-71px)]'>
              <div className='flex flex-row'>
                <div className='hidden md:block mr-4 '>
                  <Sidebar
                    setShowModal={setShowModal}
                    handleToggleSideBar={handleToggleSideBar}
                  />
                </div>
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
                <div className='w-full min-w-[calc(100vw-300px)]'>
                  <Component {...pageProps} />
                </div>
              </div>
            </main>
          </div>
        </DAppProvider>
      </Provider>
    </>
  );
}

export default MyApp;
