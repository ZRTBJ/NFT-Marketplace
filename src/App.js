import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import routes from "routes/routes.js";
import { AuthProvider } from "./Context";
import AppRoute from "components/AppRoute";
import Header from "components/TopHeader/Header";
import FooterPage from "./Pages/Footer";
import Sidebar from "components/Sidebar/Sidebar";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Header />
          {/* Dynamic Body */}
          <main className="container min-h-[calc(100vh-71px)]">
            <div className="flex flex-row">
              <div className="mr-4">
                <Sidebar />
              </div>
              <div className="min-w-[calc(100vw-350px)]">
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
    </div>
  );
}

export default App;
