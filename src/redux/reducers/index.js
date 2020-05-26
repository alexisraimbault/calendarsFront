import { combineReducers } from 'redux'

import eventsReducer from './eventsReducer'
import usersReducer from './usersReducer'
import meReducer from './meReducer'

const rootReducer = combineReducers({
  events: eventsReducer,
  users: usersReducer,
  me: meReducer
})

export default rootReducer