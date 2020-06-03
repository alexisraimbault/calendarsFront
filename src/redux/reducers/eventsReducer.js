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
		case actions.DELETE_EVENT:
			return { ...state, loading: true }

		case actions.GET_EVENTS_SUCCESS:
			const newEvents = _.reduceRight(action.payload, (flattened, other) => {
				_.remove(flattened, item => item.id === other.id);
				return flattened.concat(other);
			}, state.events);
			return { events: newEvents, loading: false, hasErrors: false }

		case actions.DELETE_EVENT_SUCCESS:
			const newEventsPostDelete = _.remove(state.events, item => item.id === action.payload);
			return { events: newEventsPostDelete, loading: false, hasErrors: false }
		
		case actions.UPDATE_EVENT_SUCCESS:
		case actions.PUT_EVENTS_SUCCESS:
			return { ...state, loading: false, hasErrors: false }

		case actions.GET_EVENTS_FAILURE:
		case actions.UPDATE_EVENT_FAILURE:
		case actions.PUT_EVENTS_FAILURE:
		case actions.DELETE_EVENT_FAILURE:
			return { ...state, loading: false, hasErrors: true }

		default:
			return state
	}
}