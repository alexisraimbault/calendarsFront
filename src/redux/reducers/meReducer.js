import * as actions from '../actions/meActions'

import * as base64  from 'js-base64';

export const initialState = {
	sessionToken: null,
	loading: false,
	hasErrors: false,
	infos: {},
}
export default function meReducer(state = initialState, action) {
	switch (action.type) {
		case actions.AUTHENTICATE:
			return { ...state, loading: true }

		case actions.LOGOUT:
			return { ...state, sessionToken: null, loading: false, hasErrors: true }

		case actions.AUTHENTICATE_SUCCESS:
			const sessionToken = action.payload;
			const jwtParts = sessionToken.split('.');
			const payloadInBase64UrlFormat = jwtParts[1];
			const decodedPayload = Base64.decode(payloadInBase64UrlFormat);
			return { sessionToken: sessionToken, infos: JSON.parse(decodedPayload), loading: false, hasErrors: false }

		case actions.AUTHENTICATE_FAILURE:
			return { ...state, sessionToken: null, loading: false, hasErrors: true }

		default:
			return state
	}
}