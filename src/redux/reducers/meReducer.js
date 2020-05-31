import * as actions from '../actions/meActions'

export const initialState = {
	sessionToken: null,
	loading: false,
	hasErrors: false,
}
export default function meReducer(state = initialState, action) {
	switch (action.type) {
		case actions.AUTHENTICATE:
			return { ...state, loading: true }

		case actions.LOGOUT:
			return { sessionToken: null, loading: false, hasErrors: true }

		case actions.AUTHENTICATE_SUCCESS:
			return { sessionToken: action.payload, loading: false, hasErrors: false }

		case actions.AUTHENTICATE_FAILURE:
			return { sessionToken: null, loading: false, hasErrors: true }

		default:
			return state
	}
}