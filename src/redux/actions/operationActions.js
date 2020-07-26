// React Notification
import { NotificationManager } from 'react-notifications';

export const GET_OPERATIONS = 'GET_OPERATIONS';
export const GET_OPERATIONS_SUCCESS = 'GET_OPERATIONS_SUCCESS';
export const GET_OPERATIONS_FAILURE = 'GET_OPERATIONS_FAILURE';

export const PUT_OPERATION = 'PUT_OPERATION';
export const PUT_OPERATION_SUCCESS = 'PUT_OPERATION_SUCCESS';
export const PUT_OPERATION_FAILURE = 'PUT_OPERATION_FAILURE';

export const DELETE_OPERATION = 'DELETE_OPERATION';
export const DELETE_OPERATION_SUCCESS = 'DELETE_OPERATION_SUCCESS';
export const DELETE_OPERATION_FAILURE = 'DELETE_OPERATION_FAILURE';

export const UPDATE_OPERATION_TOTAL = 'UPDATE_OPERATION_TOTAL';
export const UPDATE_OPERATION_TOTAL_SUCCESS = 'UPDATE_OPERATION_TOTAL_SUCCESS';
export const UPDATE_OPERATION_TOTAL_FAILURE = 'UPDATE_OPERATION_TOTAL_FAILURE';


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
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation/totals?total_name=${total_name}&date=${date}&operation_id=${operation_id}&total_value=${total_value}`,{ 
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
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation?name=${name}&data=${infos}`, {
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
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation?id=${id}`, {
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
