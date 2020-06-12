import * as actions from '../actions/userActions';

export const initialState = {
  users: [],
  loading: false,
  hasErrors: false,
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_USERS:
    case actions.INVITE_USER:
    case actions.CREATE_USER:
    case actions.UPDATE_USER_STATUS:
      return { ...state, loading: true };

    case actions.INVITE_USER_SUCCESS:
    case actions.CREATE_USER_SUCCESS:
    case actions.UPDATE_USER_STATUS_SUCCESS:
      return { ...state, loading: false, hasErrors: false };

    case actions.GET_USERS_SUCCESS:
      return { users: action.payload, loading: false, hasErrors: false };

    case actions.INVITE_USER_FAILURE:
    case actions.CREATE_USER_FAILURE:
    case actions.GET_USERS_FAILURE:
    case actions.UPDATE_USER_STATUS_FAILURE:
      return { ...state, loading: false, hasErrors: true };

    default:
      return state;
  }
}
