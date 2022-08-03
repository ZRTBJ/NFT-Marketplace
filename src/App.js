import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import routes from "routes/routes.js";
import { AuthProvider } from "./Context";
import AppRoute from "components/AppRoute";
import Header from "components/TopHeader/Header";
import FooterPage from "./Pages/Footer";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Header />
          {/* Dynamic Body */}
          <main className="container mx-auto px-4 min-h-[calc(100vh-71px)]">
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
          </main>
          {/* <FooterPage /> */}
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
