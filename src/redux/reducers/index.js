import { combineReducers } from 'redux';

import eventsReducer from './eventsReducer';
import usersReducer from './usersReducer';
import meReducer from './meReducer';
import operationReducer from './operationReducer';

const rootReducer = combineReducers({
  events: eventsReducer,
  users: usersReducer,
  me: meReducer,
  operations: operationReducer,
});

export default rootReducer;
