// React Notification
import { NotificationManager } from 'react-notifications';
import { formatApostrophe } from '../../utils/formatVarUtils'

export const GET_OPERATIONS = 'GET_OPERATIONS';
export const GET_OPERATIONS_SUCCESS = 'GET_OPERATIONS_SUCCESS';
export const GET_OPERATIONS_FAILURE = 'GET_OPERATIONS_FAILURE';

export const PUT_OPERATION = 'PUT_OPERATION';
export const PUT_OPERATION_SUCCESS = 'PUT_OPERATION_SUCCESS';
export const PUT_OPERATION_FAILURE = 'PUT_OPERATION_FAILURE';

export const UPDATE_OPERATION = 'UPDATE_OPERATION';
export const UPDATE_OPERATION_SUCCESS = 'UPDATE_OPERATION_SUCCESS';
export const UPDATE_OPERATION_FAILURE = 'UPDATE_OPERATION_FAILURE';

export const DELETE_OPERATION = 'DELETE_OPERATION';
export const DELETE_OPERATION_SUCCESS = 'DELETE_OPERATION_SUCCESS';
export const DELETE_OPERATION_FAILURE = 'DELETE_OPERATION_FAILURE';

export const UPDATE_OPERATION_TOTAL = 'UPDATE_OPERATION_TOTAL';
export const UPDATE_OPERATION_TOTAL_SUCCESS = 'UPDATE_OPERATION_TOTAL_SUCCESS';
export const UPDATE_OPERATION_TOTAL_FAILURE = 'UPDATE_OPERATION_TOTAL_FAILURE';

export const UPDATE_OPERATION_SETTINGS = 'UPDATE_OPERATION_SETTINGS';
export const UPDATE_OPERATION_SETTINGS_SUCCESS = 'UPDATE_OPERATION_SETTINGS_SUCCESS';
export const UPDATE_OPERATION_SETTINGS_FAILURE = 'UPDATE_OPERATION_SETTINGS_FAILURE';

export const GET_OPERATION_SETTINGS = 'GET_OPERATION_SETTINGS';
export const GET_OPERATION_SETTINGS_SUCCESS = 'GET_OPERATION_SETTINGS_SUCCESS';
export const GET_OPERATION_SETTINGS_FAILURE = 'GET_OPERATION_SETTINGS_FAILURE';


export const getOperations = () => ({
  type: GET_OPERATIONS,
});

export const getOperationsSuccess =  (events) => ({
    type: GET_OPERATIONS_SUCCESS,
    payload: events,
  });

export const getOperationsFailure = () => ({
  type: GET_OPERATIONS_FAILURE,
});

export function fetchOperations(sessionToken) {
  return async (dispatch) => {
    dispatch(getOperations());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation`,
        { headers: { authorization: sessionToken } });
      const data = await response.json();

      dispatch(getOperationsSuccess(JSON.parse(data.body)));
    } catch (error) {
      dispatch(getOperationsFailure());
    }
  };
}

export const getOperationSettings = () => ({
  type: GET_OPERATION_SETTINGS,
});

export const getOperationSettingsSuccess =  (events) => ({
    type: GET_OPERATION_SETTINGS_SUCCESS,
    payload: events,
  });

export const getOperationSettingsFailure = () => ({
  type: GET_OPERATION_SETTINGS_FAILURE,
});

export function fetchOperationSettings(sessionToken, id) {
  return async (dispatch) => {
    dispatch(getOperationSettings());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation/rdvsettings?id=${formatApostrophe(id)}`,
        { headers: { authorization: sessionToken } });
      const data = await response.json();

      dispatch(getOperationSettingsSuccess(JSON.parse(data.body)));
    } catch (error) {
      dispatch(getOperationSettingsFailure());
    }
  };
}

export const updateOperationSettings = () => ({
  type: UPDATE_OPERATION_SETTINGS,
});

export const updateOperationSettingsSuccess =  (events) => ({
    type: UPDATE_OPERATION_SETTINGS_SUCCESS,
    payload: events,
  });

export const updateOperationSettingsFailure = () => ({
  type: UPDATE_OPERATION_SETTINGS_FAILURE,
});

export function fetchUpdateOperationSettings(sessionToken, id, settings) {
  return async (dispatch) => {
    dispatch(updateOperationSettings());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation/rdvsettings?id=${formatApostrophe(id)}`,
        { headers: {authorization: sessionToken,
        'Content-Type': 'application/json'},
        method: 'POST',
        body: formatApostrophe(settings) });
      const data = await response.json();

      dispatch(updateOperationSettingsSuccess(JSON.parse(data.body)));
    } catch (error) {
      dispatch(updateOperationSettingsFailure());
    }
  };
}

export const updateOperationTotal = () => ({
  type: UPDATE_OPERATION_TOTAL,
});

export const updateOperationTotalSuccess =  () => ({
    type: UPDATE_OPERATION_TOTAL_SUCCESS,
  });

export const updateOperationTotalFailure = () => ({
  type: UPDATE_OPERATION_TOTAL_FAILURE,
});

export function fetchUpdateOperationTotal(sessionToken, total_name, date, operation_id, total_value) {
  return async (dispatch) => {
    dispatch(updateOperationTotal());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation/totals?total_name=${formatApostrophe(total_name)}&date=${formatApostrophe(date)}&operation_id=${formatApostrophe(operation_id)}&total_value=${formatApostrophe(total_value)}`,{ 
        headers: { authorization: sessionToken },
        method: 'POST',
      });

      NotificationManager.success('Total successfully updated!', 'Successful!', 1500);

      dispatch(updateOperationTotalSuccess(id));
    } catch (error) {
      console.log(error)
    }
  };
}

export const putOperations = () => ({
  type: PUT_OPERATION,
});

export const putOperationsSuccess = (events) => ({
  type: PUT_OPERATION_SUCCESS,
  payload: events,
});

export const putOperationsFailure = () => ({
  type: PUT_OPERATION_FAILURE,
});

export function createOperation(name, infos, sessionToken) {
  return async (dispatch) => {
    dispatch(putOperations());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation?name=${formatApostrophe(name)}&data=${formatApostrophe(infos)}`, {
        headers: { authorization: sessionToken },
        method: 'PUT',
      });
      const data = await response.json();
      NotificationManager.success('You have added an Operation!', 'Successful!', 1500);

      dispatch(putOperationsSuccess());
    } catch (error) {
      NotificationManager.error('Error while Creating Operation!', 'Error!');
      dispatch(putOperationsFailure());
    }
  };
}

export const updateOperation = () => ({
  type: UPDATE_OPERATION,
});

export const updateOperationSuccess = (events) => ({
  type: UPDATE_OPERATION_SUCCESS,
  payload: events,
});

export const updateOperationFailure = () => ({
  type: UPDATE_OPERATION_FAILURE,
});

export function callUpdateOperation(id, data, sessionToken) {
  return async (dispatch) => {
    dispatch(updateOperation());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation?id=${formatApostrophe(id)}&data=${formatApostrophe(data)}`, {
        headers: { authorization: sessionToken },
        method: 'POST',
      });
      NotificationManager.success('You have edited an Operation!', 'Successful!', 1500);

      dispatch(updateOperationSuccess());
    } catch (error) {
      NotificationManager.error('Error while editing Operation!', 'Error!');
      dispatch(updateOperationFailure());
    }
  };
}

export const deleteOperation = () => ({
  type: DELETE_OPERATION,
});

export const deleteOperationSuccess = (id) => ({
  type: DELETE_OPERATION_SUCCESS,
  payload: id,
});

export const deleteOperationFailure = () => ({
  type: DELETE_OPERATION_FAILURE,
});

export function postDeleteOperation(id, sessionToken) {
  return async (dispatch) => {
    dispatch(deleteOperation());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation?id=${formatApostrophe(id)}`, {
        headers: { authorization: sessionToken },
        method: 'DELETE',
      });
      NotificationManager.success('Event successfully deleted!', 'Successful!', 1500);

      dispatch(deleteOperationSuccess(id));
    } catch (error) {
      NotificationManager.error('Error while deleting Event!', 'Error!');
      dispatch(deleteOperationFailure());
    }
  };
}


// {
// 	"settings": {
// 		"defaultamo": "1",
// 		"formats": [{"name": "duplex", "duration": "1"}],
// 		"from": "2020-08-31T10:34:42.641Z",
// 		"hours": [{"from": "08:00", "to": "18:00"}],
// 		"spans": [
// 			{"from": "08:00", "to": "18:00", "date": "2020-08-31T10:34:42.641Z", "count": "1"},
// 			{"from": "08:00", "to": "18:00", "date": "2020-09-01T10:34:42.641Z", "count": "1"},
// 			{"from": "08:00", "to": "18:00", "date": "2020-09-02T10:34:42.641Z", "count": "1"},
// 			{"from": "08:00", "to": "18:00", "date": "2020-09-03T10:34:42.641Z", "count": "1"},
// 			{"from": "08:00", "to": "18:00", "date": "2020-09-04T10:34:42.641Z", "count": "1"},
// 			{"from": "08:00", "to": "18:00", "date": "2020-09-05T10:34:42.641Z", "count": "0"},
// 			{"from": "08:00", "to": "18:00", "date": "2020-09-06T10:34:42.641Z", "count": "0"},
// 			{"from": "08:00", "to": "18:00", "date": "2020-09-07T10:34:42.641Z", "count": "1"}
// 		],
// 		"to": "2020-09-07T10:34:42.642Z"
// 	}
// }