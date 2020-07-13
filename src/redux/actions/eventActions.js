// React Notification
import { NotificationManager } from 'react-notifications';

export const GET_EVENTS = 'GET_EVENTS';
export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
export const GET_EVENTS_SUCCESS_MERGE = 'GET_EVENTS_SUCCESS_MERGE';
export const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE';

export const GET_OPERATION_EVENTS = 'GET_OPERATION_EVENTS';
export const GET_OPERATION_EVENTS_SUCCESS = 'GET_OPERATION_EVENTS_SUCCESS';
export const GET_OPERATION_EVENTS_SUCCESS_MERGE = 'GET_OPERATION_EVENTS_SUCCESS_MERGE';
export const GET_OPERATION_EVENTS_FAILURE = 'GET_OPERATION_EVENTS_FAILURE';

export const GET_AMO_EVENTS = 'GET_AMO_EVENTS';
export const GET_AMO_EVENTS_SUCCESS = 'GET_AMO_EVENTS_SUCCESS';
export const GET_AMO_EVENTS_FAILURE = 'GET_AMO_EVENTS_FAILURE';

export const PUT_EVENTS = 'PUT_EVENTS';
export const PUT_EVENTS_SUCCESS = 'PUT_EVENTS_SUCCESS';
export const PUT_EVENTS_FAILURE = 'PUT_EVENTS_FAILURE';

export const UPDATE_EVENT = 'UPDATE_EVENT';
export const UPDATE_EVENT_SUCCESS = 'UPDATE_EVENT_SUCCESS';
export const UPDATE_EVENT_FAILURE = 'UPDATE_EVENT_FAILURE';

export const DELETE_EVENT = 'DELETE_EVENT';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILURE = 'DELETE_EVENT_FAILURE';


export const getEvents = () => ({
  type: GET_EVENTS,
});

export const getEventsSuccess = (events, mergeData) => ({
  type: mergeData ? GET_EVENTS_SUCCESS_MERGE : GET_EVENTS_SUCCESS,
  payload: events,
});

export const getEventsFailure = () => ({
  type: GET_EVENTS_FAILURE,
});

export function fetchEvents(date, sessionToken, corp_id, mergeData = false) {
  return async (dispatch) => {
    dispatch(getEvents());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?date=${date}&corp_id=${corp_id}`,
        { headers: { authorization: sessionToken } });
      const data = await response.json();

      dispatch(getEventsSuccess(JSON.parse(data.body), mergeData));
    } catch (error) {
      dispatch(getEventsFailure());
    }
  };
}

export const getOperationEvents = () => ({
  type: GET_OPERATION_EVENTS,
});

export const getOperationEventsSuccess = (events, mergeData) => ({
  type:mergeData ? GET_OPERATION_EVENTS_SUCCESS_MERGE : GET_OPERATION_EVENTS_SUCCESS,
  payload: events,
});

export const getOperationEventsFailure = () => ({
  type: GET_OPERATION_EVENTS_FAILURE,
});

export function fetchOperationEvents(date, operation_id, mergeData = false) {
  return async (dispatch) => {
    dispatch(getOperationEvents());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation/events?date=${date}&operation_id=${operation_id}`);
      const data = await response.json();

      dispatch(getOperationEventsSuccess(JSON.parse(data.body), mergeData));
    } catch (error) {
      dispatch(getOperationEventsFailure());
    }
  };
}

export const getAmoEvents = () => ({
  type: GET_AMO_EVENTS,
});

export const getAmoEventsSuccess = (events) => ({
  type: GET_AMO_EVENTS_SUCCESS,
  payload: events,
});

export const getAmoEventsFailure = () => ({
  type: GET_AMO_EVENTS_FAILURE,
});

export function fetchAmoEvents(date, user_id, corp_id ) {
  return async (dispatch) => {
    dispatch(getAmoEvents());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/operation/events?date=${date}&user_id=${user_id}&corp_id=${corp_id}`);
      const data = await response.json();

      dispatch(getAmoEventsSuccess(JSON.parse(data.body)));
    } catch (error) {
      dispatch(getAmoEventsFailure());
    }
  };
}

export const putEvents = () => ({
  type: PUT_EVENTS,
});

export const putEventsSuccess = (events) => ({
  type: PUT_EVENTS_SUCCESS,
  payload: events,
});

export const putEventsFailure = () => ({
  type: PUT_EVENTS_FAILURE,
});

export function createEvent(name, description, date, time_from, time_to, users, sessionToken, corp_id, type, operation_id) {
  return async (dispatch) => {
    dispatch(putEvents());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?name=${name}&description=${description}&date=${date}&time_from=${time_from}&time_to=${time_to}&users=${users}&corp_id=${corp_id}&type=${type}&operation_id=${operation_id}`, {
        headers: { authorization: sessionToken },
        method: 'PUT',
      });
      const data = await response.json();
      NotificationManager.success('You have added a new Event!', 'Successful!', 1500);

      dispatch(putEventsSuccess());
    } catch (error) {
      NotificationManager.error('Error while Creating Event!', 'Error!');
      dispatch(putEventsFailure());
    }
  };
}

export const updateEvent = () => ({
  type: UPDATE_EVENT,
});

export const updateEventSuccess = () => ({
  type: UPDATE_EVENT_SUCCESS,
});

export const updateEventFailure = () => ({
  type: UPDATE_EVENT_FAILURE,
});

export function postUpdateEvent(event_id, name, description, time_from, time_to, users, sessionToken) {
  return async (dispatch) => {
    dispatch(updateEvent());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?event_id=${event_id}&name=${name}&description=${description}&time_from=${time_from}&time_to=${time_to}&users=${users}`, {
        headers: { authorization: sessionToken },
        method: 'POST',
      });
      NotificationManager.success('Event successfully updated!', 'Successful!', 1500);

      dispatch(updateEventSuccess());
    } catch (error) {
      NotificationManager.error('Error while updating Event!', 'Error!');
      dispatch(updateEventFailure());
    }
  };
}

export const deleteEvent = () => ({
  type: DELETE_EVENT,
});

export const deleteEventSuccess = (id) => ({
  type: DELETE_EVENT_SUCCESS,
  payload: id,
});

export const deleteEventFailure = () => ({
  type: DELETE_EVENT_FAILURE,
});

export function postDeleteEvent(id, sessionToken) {
  return async (dispatch) => {
    dispatch(deleteEvent());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?id=${id}`, {
        headers: { authorization: sessionToken },
        method: 'DELETE',
      });
      NotificationManager.success('Event successfully deleted!', 'Successful!', 1500);

      dispatch(deleteEventSuccess(id));
    } catch (error) {
      NotificationManager.error('Error while deleting Event!', 'Error!');
      dispatch(deleteEventFailure());
    }
  };
}
