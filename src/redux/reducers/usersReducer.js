import * as actions from '../actions/userActions'

export const initialState = {
	users: [],
	loading: false,
	hasErrors: false,
}

export default function usersReducer(state = initialState, action) {
	switch (action.type) {
		case actions.GET_USERS:
			return { ...state, loading: true }

		case actions.GET_USERS_SUCCESS:
			return { users: action.payload, loading: false, hasErrors: false }

		case actions.GET_USERS_FAILURE:
			return { ...state, loading: false, hasErrors: true }

		default:
			return state
	}
}