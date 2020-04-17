import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import List from "./components/List";
import Welcome from "./components/Welcome"
import Auth from "./components/Auth";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Welcome} /> 
        <Route exact path="/auth" component={Auth} /> 
        <Route exact path="/list/:id" component={List} />
      </Switch>
    </Router>
  );
};

export default App;
