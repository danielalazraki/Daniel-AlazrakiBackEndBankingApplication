import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import React, { createContext, useState } from "react";
import { NavBar } from "./components/navbar";
import { Home } from "./components/home";
import { CreateAccount } from "./components/createaccount";
import { Login } from "./components/login";
import Deposit from "./components/deposit";
import { Dashboard } from "./components/dashboard";
import { Withdraw } from "./components/withdraw";
import { auth } from "./api/firebase-client-helper.js";

export const UserContext = createContext(null);

export function App() {
  const [value, setValue] = useState(null);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setValue(user);
    } else {
      setValue(null);
    }
  });

  return (
    <UserContext.Provider value={value}>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
        <Switch>
          <Route path="/CreateAccount/" component={CreateAccount} />
        </Switch>
        <Switch>
          <Route path="/login/" component={Login} />
        </Switch>
        <Switch>
          <Route path="/deposit/" component={Deposit} />
        </Switch>
        <Switch>
          <Route path="/dashboard/" component={Dashboard} />
        </Switch>
        <Switch>
          <Route path="/withdraw/" component={Withdraw} />
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}
