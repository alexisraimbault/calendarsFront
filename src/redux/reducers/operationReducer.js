import _ from 'lodash';
import * as actions from '../actions/operationActions';

export const initialState = {
    operations: [],
    loading: false,
    hasErrors: false,
};

export default function operationReducer(state = initialState, action) {
    let newEventsPostDelete = [];
    const colors = [
        '#8fcfd1',
        '#df5e88',
        '#f6ab6c',
        '#f6efa6'
    ]

    switch (action.type) {
        case actions.GET_OPERATIONS:
        case actions.PUT_OPERATION:
        case actions.UPDATE_OPERATION:
        case actions.DELETE_OPERATION:
        case actions.UPDATE_OPERATION_TOTAL:
            return { ...state, loading: true };

        case actions.GET_OPERATIONS_SUCCESS:
            const operationList = action.payload;
            _.each(_.orderBy(operationList, 'id'), (operation, index) => {
                operation.color = colors[index % colors.length];
            })
            return { operations: action.payload, loading: false, hasErrors: false };

        case actions.DELETE_OPERATION_SUCCESS:
            newEventsPostDelete = _.remove(state.operations, (item) => item.id !== action.payload);
            return { operations: newEventsPostDelete, loading: false, hasErrors: false };

        case actions.UPDATE_OPERATION_TOTAL_SUCCESS:
        case actions.UPDATE_OPERATION_SUCCESS:
        case actions.PUT_OPERATION_SUCCESS:
            return { ...state, loading: false, hasErrors: false };

        case actions.GET_OPERATIONS_FAILURE:
        case actions.UPDATE_OPERATION_FAILURE:
        case actions.PUT_OPERATION_FAILURE:
        case actions.DELETE_OPERATION_FAILURE:
        case actions.UPDATE_OPERATION_TOTAL_FAILURE:
            return { ...state, loading: false, hasErrors: true };

        default:
            return state;
    }
}
