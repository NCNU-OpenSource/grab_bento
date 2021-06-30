import React from "react";
import NavBar from "./NavBar";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import PrivateRouter from "../PrivateRoute";

import Dashboard from "../Dashboard";
import SignIn from "../SignIn";

function index() {
  return (
    <>
      <NavBar>
        <Switch>
          <Route exact path="/SignIn" component={SignIn} />
          <PrivateRouter path="/" render={Dashboard} />
          {/* <Route path="/" render={Dashboard} /> */}
        </Switch>
      </NavBar>
    </>
  );
}

export default index;
