import { hot } from 'react-hot-loader';
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './App.css';
import Calendar from './pages/calendar';
import LoginPage from './pages/login/index';
import rootReducer from './redux/reducers';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));

const persistor = persistStore(store);

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Switch>
          <Route path="/calendar/:week?/:year?" component={Calendar} />
          <Route path="/login" component={LoginPage} />
          <Route path="/"  component={LoginPage} />
        </Switch>
        <NotificationContainer />
      </Router>
    </PersistGate>
  </Provider>
);

export default hot(module)(App);
