import { hot } from 'react-hot-loader';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Calendar from './pages/calendar'

const App = () => (
  <Router>
    <Switch>
      <Route path="/calendar/:week?/:year?" component={Calendar}>
      </Route>
      <Route path="/">
        <div>{"Hello from home"}</div>
      </Route>
    </Switch>
  </Router>
);

export default hot(module)(App);
