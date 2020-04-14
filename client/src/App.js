import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import List from "./components/List";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/list/:id" component={List} />
      </Switch>
    </Router>
  );
};

export default App;
