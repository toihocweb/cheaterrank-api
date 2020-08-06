import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const currentUser = useSelector((state) => state.authReducer.currentUser);

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser?.role === "admin" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;
