import React, { useState, useEffect, Fragment } from "react";
import { Redirect, Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import List from "./components/List";
import Welcome from "./components/Welcome";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import Axios from "axios";
import { setAuthToken } from "./utils";
import Loading from "./components/Loading";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authenticate = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      setAuthToken(localStorage.token);
      setIsAuthenticated(true);
      loadUser();
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const res = await Axios.get("/api/auth/");
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const initialize = async () => {
    if (localStorage.token) {
      await loadUser();
    }
    setLoading(false);
  };

  useEffect(() => {
    initialize();
  }, []);

  return loading ? (
    <Loading isFullScreen={true} />
  ) : (
    <Router>
      <div className="container p-0">
        <div className="col-sm-12 col-md-10 offset-md-1 p-0">
          <Switch>
            {isAuthenticated === true ? (
              <Fragment>
                <Route exact path="/">
                  <Dashboard authenticate={authenticate} user={user} />
                </Route>
                <Route exact path="/list/:id" component={({ match }) => <List match={match} user={user} />} />
                <Route exact path="/(login|signup)">
                  <Redirect to="/" />
                </Route>
                <Redirect to="/" />
              </Fragment>
            ) : (
              <Fragment>
                <Route exact path="/" component={Welcome} />
                <Route isAuthenticated={isAuthenticated} exact path="/login">
                  <Auth authenticate={authenticate} isLogin={true} />
                </Route>
                <Route exact path="/signup">
                  <Auth authenticate={authenticate} isLogin={false} />
                </Route>
                <Redirect to="/" />
              </Fragment>
            )}
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
