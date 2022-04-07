import React from "react";
import { Switch } from "react-router-dom";
import { Redirect, Route } from "react-router-dom";
import { useAuthState } from "../Context";
import Home from "../Pages/Home";

const AppRoutes = ({ component: Component, path, isPrivate, ...rest }) => {
  const userDetails = useAuthState();
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path={path}
        render={(props) =>
          isPrivate && !Boolean(userDetails.token) ? (
            <Redirect to={{ pathname: "/login" }} />
          ) : (
            <Component {...props} />
          )
        }
        {...rest}
      />
    </Switch>
  );
};

export default AppRoutes;
