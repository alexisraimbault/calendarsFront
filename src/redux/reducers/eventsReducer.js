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
			return { ...state, loading: true }

		case actions.GET_EVENTS_SUCCESS:
			return { events: action.payload, loading: false, hasErrors: false }
		
		case actions.PUT_EVENTS_SUCCESS:
			return { ...state, loading: false, hasErrors: false }

		case actions.GET_EVENTS_FAILURE:
		case actions.PUT_EVENTS_FAILURE:
			return { ...state, loading: false, hasErrors: true }

		default:
			return state
	}
}