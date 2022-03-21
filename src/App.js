import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import routes from "routes/routes.js";
import { AuthProvider } from "./Context";
import { socket, SocketContext } from "./Context/socket";
import AppRoute from "components/AppRoute";
import Header from "components/Header";

function App() {
  return (
    <div>
      <SocketContext.Provider value={socket}>
        <Router>
          <AuthProvider>
            <Header />
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
          </AuthProvider>
        </Router>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
