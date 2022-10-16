import React, { useState } from "react";
import { BrowserRouter as Router, Switch, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import routes from "routes/routes.js";
import { AuthProvider } from "./Context";
import AppRoute from "components/AppRoute";
import Header from "components/TopHeader/Header";
import FooterPage from "./Pages/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleToggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  let path = window?.location?.pathname;
  let pathItems = path && path.split("/");
  let isEmbedView = pathItems?.includes("embed-nft");

  return (
    <div>
      <Router>
        <AuthProvider>
          {!isEmbedView && (
            <Header
              handleSidebar={handleToggleSideBar}
              setShowModal={setShowModal}
              showModal={showModal}
            />
          )}
          {/* Dynamic Body */}
          <main className="container min-h-[calc(100vh-71px)]">
            <div className="md:flex md:flex-row">
              {!isEmbedView && (
                <div className="hidden md:block mr-4 ">
                  <Sidebar
                    setShowModal={setShowModal}
                    handleToggleSideBar={handleToggleSideBar}
                  />
                </div>
              )}
              {!isEmbedView && (
                <div
                  className={`${
                    showSideBar ? "translate-x-0" : "-translate-x-full"
                  } block md:hidden mr-4 absolute z-[100] ease-in-out duration-300`}
                >
                  <Sidebar
                    setShowModal={setShowModal}
                    handleToggleSideBar={handleToggleSideBar}
                  />
                </div>
              )}

              <div className="w-full min-w-[calc(100vw-300px)]">
                <Switch>
                  {routes.map((route) => (
                    <AppRoute
                      key={route.path}
                      path={route.path}
                      component={route.component}
                      isPrivate={route.isPrivate}
                    />
                  ))}
                </Switch>
              </div>
            </div>
          </main>
          {/* <FooterPage /> */}
        </AuthProvider>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
