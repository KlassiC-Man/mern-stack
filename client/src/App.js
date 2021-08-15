import "./App.css";
import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import LandingPage from "./components/layout/LandingPage";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthToken";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import CreateProfile from "./components/profile-form/CreateProfile";
import EditProfile from "./components/profile-form/EditProfile";

// This checks before itself that if the localStorage has a token, and if it does updates the setAuthToken method
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={LandingPage} />
          <section className="container">
            <Alert />
            <Switch>
              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
              <PrivateRoute path="/dashboard" exact component={Dashboard} />
              <PrivateRoute
                path="/create-profile"
                exact
                component={CreateProfile}
              />
              <PrivateRoute
                path="/edit-profile"
                exact
                component={EditProfile}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
