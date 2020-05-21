import { hot } from 'react-hot-loader';
import React from 'react';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
//import store from './redux/store'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Calendar from './pages/calendar'
import rootReducer from './redux/reducers'

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

const App = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/calendar/:week?/:year?" component={Calendar}>
        </Route>
        <Route path="/">
          <div>{"Hello from home"}</div>
        </Route>
      </Switch>
    </Router>
  </Provider>
);

export default hot(module)(App);
