import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import Lang from "./components/Assignment/Lang";
import Admin from "./components/Admin/Admin";
import Login from "./components/Login/Login";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import { setCurrentUser, logoutUser } from "./components/actions";
import PrivateRoute from "./components/common/PrivateRoute";
import Register from "./components/Register/Register";
import AuthRoute from "./components/common/AuthRoute";
import jwt from "jsonwebtoken";
import AdminLayout from "./components/Admin/AdminLayout";

// const decodedToken = jwt.verify(token, keys.secretOrKey);
// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  try {
    const decoded = jwt.verify(
      localStorage.jwtToken.split(" ")[1],
      process.env.REACT_APP_PRIVATE_KEY
    );
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser());
      // Redirect to login
      window.location.href = "/login";
    }
  } catch (error) {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  }
}

const App = () => {
  return (
    <Router>
      <Switch>
        <Route component={Home} path="/" exact />
        <Route component={Login} path="/login" />
        <Route component={Register} path="/register" />
        <PrivateRoute component={AdminLayout} path="/admin" />
        <AuthRoute component={Lang} path="/:lang" />
        <Route render={(props) => <h1>Page Not Found</h1>} path="*" exact />
      </Switch>
    </Router>
  );
};

export default App;
