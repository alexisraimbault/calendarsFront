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
import './App.scss';
import Calendar from './pages/calendar';
import CalendarMobile from './pages/mobile/calendarMobile';
import MonthlyCalendar from './pages/monthlyCalendar';
import RdvAcquereursConfig from './pages/RdvAcquereursConfig';
import RdvAcquereurs from './pages/RdvAcquereurs';
import OffDays from './pages/OffDays';
import OffDaysBoard from './pages/OffDaysBoard';
import CalendarCompanyExport from './pages/CalendarCompanyExport';
import DailyCalendar from './pages/dailyCalendar';
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
          <Route path="/mcalendar/:day?/:year?" component={CalendarMobile} />
          <Route path="/calendarmonth/:month?/:year?" component={MonthlyCalendar} />
          <Route path="/calendarday/:day?/:year?" component={DailyCalendar} />
          <Route path="/calendaroffdays/:month?/:year?" component={OffDays} />
          <Route path="/calendaroffdaysBoard/:month?/:year?" component={OffDaysBoard} />
          <Route path="/calendarexport/:operation_id" component={CalendarCompanyExport} />
          <Route path="/rdvconfig/:operation_id" component={RdvAcquereursConfig} />
          <Route path="/rdv/:operation_id" component={RdvAcquereurs} />
          <Route path="/login" component={LoginPage} />
          <Route path="/"  component={LoginPage} />
        </Switch>
        <NotificationContainer />
      </Router>
    </PersistGate>
  </Provider>
);

export default hot(module)(App);
