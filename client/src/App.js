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
  const [isAuthenticated, setIsAuthenticated] = useState(null);
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
      const res = await Axios.get("/auth/");
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return loading ? (
    <Loading isFullScreen={true} />
  ) : (
    <Router>
      <div className="container p-0">
        <div className="col-sm-12 col-md-10 offset-md-1 p-0">
          <Switch>
            {isAuthenticated ? (
              <Fragment>
                <Route exact path="/">
                  <Dashboard user={user} />
                </Route>
                <Route exact path="/list/:id" component={List} />
                <Route exact path="/(login|signup)">
                  <Redirect to="/" />
                </Route>
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
              </Fragment>
            )}
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
