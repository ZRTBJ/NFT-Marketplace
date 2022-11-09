import React from "react";
import { Switch } from "react-router-dom";
import { Redirect, Route } from "react-router-dom";
import Home from "Pages/Home/Homepage";
import { useSelector } from "react-redux";

const AppRoutes = ({ component: Component, path, isPrivate, ...rest }) => {
  const { token } = useSelector((state) => state.auth);
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path={path}
        render={(props) =>
          isPrivate && !Boolean(token) ? (
            <Redirect to={{ pathname: "/" }} />
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
