import * as base64 from 'js-base64';
import * as actions from '../actions/meActions';


export const initialState = {
  sessionToken: null,
  loading: false,
  hasErrors: false,
  infos: {},
  offDays: [],
  allOffDays: [],
};
export default function meReducer(state = initialState, action) {
  switch (action.type) {
    case actions.AUTHENTICATE:
    case actions.GET_OFFDAYS:
    case actions.GET_COMPANY_OFFDAYS:
      return { ...state, loading: true };

    case actions.LOGOUT:
      return {
        ...state, sessionToken: null, loading: false, hasErrors: true,
      };

    case actions.AUTHENTICATE_SUCCESS:
      const sessionToken = action.payload;
      const jwtParts = sessionToken.split('.');
      const payloadInBase64UrlFormat = jwtParts[1];
      const decodedPayload = Base64.decode(payloadInBase64UrlFormat);
      return {
        sessionToken, infos: JSON.parse(decodedPayload), loading: false, hasErrors: false,
      };

    case actions.GET_OFFDAYS_SUCCESS:
      return {
        ...state, offDays: action.payload,
      };

    case actions.GET_COMPANY_OFFDAYS_SUCCESS:
      return {
        ...state, allOffDays: action.payload,
      };

    case actions.GET_COMPANY_OFFDAYS_FAILURE:
    case actions.GET_OFFDAYS_FAILURE:
      return {
        ...state, loading: false, hasErrors: true,
      };
    case actions.AUTHENTICATE_FAILURE:
      return {
        ...state, sessionToken: null, loading: false, hasErrors: true,
      };

    default:
      return state;
  }
}
