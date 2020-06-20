import _ from 'lodash';
import * as actions from '../actions/operationActions';

export const initialState = {
  operations: [],
  loading: false,
  hasErrors: false,
};

export default function operationReducer(state = initialState, action) {
  let newEventsPostDelete = [];

  switch (action.type) {
    case actions.GET_OPERATIONS:
    case actions.PUT_OPERATION:
    case actions.UPDATE_OPERATION:
    case actions.DELETE_OPERATION:
        return { ...state, loading: true };

    case actions.GET_OPERATIONS_SUCCESS:
        return { operations: action.payload, loading: false, hasErrors: false };

    case actions.DELETE_OPERATION_SUCCESS:
        newEventsPostDelete = _.remove(state.operations, (item) => item.id !== action.payload);
        return { operations: newEventsPostDelete, loading: false, hasErrors: false };

    case actions.UPDATE_OPERATION_SUCCESS:
    case actions.PUT_OPERATION_SUCCESS:
        return { ...state, loading: false, hasErrors: false };

    case actions.GET_OPERATIONS_FAILURE:
    case actions.UPDATE_OPERATION_FAILURE:
    case actions.PUT_OPERATION_FAILURE:
    case actions.DELETE_OPERATION_FAILURE:
        return { ...state, loading: false, hasErrors: true };

    default:
        return state;
  }
}
