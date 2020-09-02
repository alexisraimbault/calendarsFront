import _ from 'lodash';
import * as actions from '../actions/operationActions';

export const initialState = {
    operations: [],
    loading: false,
    hasErrors: false,
    settings: {},
};

export default function operationReducer(state = initialState, action) {
    let newEventsPostDelete = [];
    const colors = [
        '#8fcfd1',
        '#df5e88',
        '#f6ab6c',
        '#f6efa6',
        "#91d18b",
        "#f09ae9"
    ]

    switch (action.type) {
        case actions.GET_OPERATIONS:
        case actions.UPDATE_OPERATION_SETTINGS:
        case actions.PUT_OPERATION:
        case actions.UPDATE_OPERATION:
        case actions.DELETE_OPERATION:
        case actions.UPDATE_OPERATION_TOTAL:
            return { ...state, loading: true };

            
        case actions.GET_OPERATION_SETTINGS:
            return { ...state, loading: true, settings: {} };

        case actions.GET_OPERATIONS_SUCCESS:
            const operationList = action.payload;
            _.each(_.orderBy(operationList, 'id'), (operation, index) => {
                operation.color = colors[index % colors.length];
            })
            return { ...state, operations: action.payload, loading: false, hasErrors: false };
        
        case actions.GET_OPERATION_SETTINGS_SUCCESS:
            return { ...state, settings: JSON.parse(action.payload.rdvs_settings), loading: false, hasErrors: false };

        case actions.DELETE_OPERATION_SUCCESS:
            newEventsPostDelete = _.remove(state.operations, (item) => item.id !== action.payload);
            return { ...state, operations: newEventsPostDelete, loading: false, hasErrors: false };

        case actions.UPDATE_OPERATION_SETTINGS_SUCCESS:
        case actions.UPDATE_OPERATION_TOTAL_SUCCESS:
        case actions.UPDATE_OPERATION_SUCCESS:
        case actions.PUT_OPERATION_SUCCESS:
            return { ...state, loading: false, hasErrors: false };

        case actions.GET_OPERATIONS_FAILURE:
        case actions.UPDATE_OPERATION_SETTINGS_FAILURE:
        case actions.GET_OPERATION_SETTINGS_FAILURE:
        case actions.UPDATE_OPERATION_FAILURE:
        case actions.PUT_OPERATION_FAILURE:
        case actions.DELETE_OPERATION_FAILURE:
        case actions.UPDATE_OPERATION_TOTAL_FAILURE:
            return { ...state, loading: false, hasErrors: true };

        default:
            return state;
    }
}
