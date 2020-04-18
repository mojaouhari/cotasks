import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import List from "./components/List";
import Welcome from "./components/Welcome";
import Auth from "./components/Auth";
import Axios from "axios";

const App = () => {
  // Axios.defaults.headers["Conten-Type"] = "application/json";
  // Axios.defaults.proxy.host = "http://localhost";
  // Axios.defaults.proxy.port = "5000";

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/login" component={() => <Auth isLogin={true} />} />
        <Route exact path="/signup" component={Auth} />
        <Route exact path="/list/:id" component={List} />
      </Switch>
    </Router>
  );
};

export default App;
