import { combineReducers } from 'redux'

import eventsReducer from './eventsReducer'
import usersReducer from './usersReducer'

const rootReducer = combineReducers({
  events: eventsReducer,
  users: usersReducer,
})

export default rootReducer