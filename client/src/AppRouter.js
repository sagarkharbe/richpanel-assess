import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import DashBoard from "./components/DashBoard";

export const AppRouter = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/dashboard" component={DashBoard} />
        </Switch>
      </div>
    </Router>
  );
};
