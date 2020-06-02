import * as actions from '../actions/eventActions'

export const initialState = {
	events: [],
	loading: false,
	hasErrors: false,
}

export default function eventsReducer(state = initialState, action) {
	switch (action.type) {
		case actions.GET_EVENTS:
		case actions.PUT_EVENTS:
		case actions.UPDATE_EVENT:
			return { ...state, loading: true }

		case actions.GET_EVENTS_SUCCESS:
			//TODO MERGE DATA instead of replacing for the case of a week on 2 months
			return { events: action.payload, loading: false, hasErrors: false }
		
		case actions.UPDATE_EVENT_SUCCESS:
		case actions.PUT_EVENTS_SUCCESS:
			return { ...state, loading: false, hasErrors: false }

		case actions.GET_EVENTS_FAILURE:
		case actions.GET_EVENTS_FAILURE:
		case actions.UPDATE_EVENT_FAILURE:
			return { ...state, loading: false, hasErrors: true }

		default:
			return state
	}
}