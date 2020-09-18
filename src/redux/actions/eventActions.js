// React Notification
import { NotificationManager } from 'react-notifications';
import { formatApostrophe } from '../../utils/formatVarUtils'

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

export const PUT_NOAUTH_EVENT = 'PUT_NOAUTH_EVENT';
export const PUT_NOAUTH_EVENT_SUCCESS = 'PUT_NOAUTH_EVENT_SUCCESS';
export const PUT_NOAUTH_EVENT_FAILURE = 'PUT_NOAUTH_EVENT_FAILURE';

export const UPDATE_EVENT = 'UPDATE_EVENT';
export const UPDATE_EVENT_SUCCESS = 'UPDATE_EVENT_SUCCESS';
export const UPDATE_EVENT_FAILURE = 'UPDATE_EVENT_FAILURE';

export const DELETE_EVENT = 'DELETE_EVENT';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILURE = 'DELETE_EVENT_FAILURE';

export const GET_NOAUTH_INFOS = 'GET_NOAUTH_INFOS';
export const GET_NOAUTH_INFOS_SUCCESS = 'GET_NOAUTH_INFOS_SUCCESS';
export const GET_NOAUTH_INFOS_FAILURE = 'GET_NOAUTH_INFOS_FAILURE';


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
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?date=${formatApostrophe(date)}&corp_id=${formatApostrophe(corp_id)}`,
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
      console.log("ALEXIS", data);

      dispatch(getOperationEventsSuccess({events: JSON.parse(data.body.events), name: data.body.name}, mergeData));
    } catch (error) {
      console.log("ALEXIS", error);
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

export function fetchAmoEvents(sessionToken, date, user_id, corp_id ) {
  return async (dispatch) => {
    dispatch(getAmoEvents());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/amoevents?date=${formatApostrophe(date)}&user_id=${formatApostrophe(user_id)}&corp_id=${formatApostrophe(corp_id)}`,
      { headers: { authorization: sessionToken } });
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

export function createEvent(name, description, date, time_from, time_to, users, sessionToken, corp_id, type, operation_id, hours, mail) {
  return async (dispatch) => {
    dispatch(putEvents());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?name=${formatApostrophe(name)}&description=${formatApostrophe(description)}&date=${formatApostrophe(date)}&time_from=${formatApostrophe(time_from)}&time_to=${formatApostrophe(time_to)}&users=${formatApostrophe(users)}&corp_id=${formatApostrophe(corp_id)}&type=${formatApostrophe(type)}&operation_id=${formatApostrophe(operation_id)}&hours=${formatApostrophe(hours)}&mail=${formatApostrophe(mail)}`, {
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

export const createNoAuthEvent = () => ({
  type: PUT_NOAUTH_EVENT,
});

export const createNoAuthEventSuccess = (events) => ({
  type: PUT_NOAUTH_EVENT_SUCCESS,
  payload: events,
});

export const createNoAuthEventFailure = () => ({
  type: PUT_NOAUTH_EVENT_FAILURE,
});

export function fetchCreateNoauthEvent(name, description, date, time_from, time_to, users, corp_id, type, operation_id, mail) {
  return async (dispatch) => {
    dispatch(createNoAuthEvent());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/noauth/event?name=${formatApostrophe(name)}&description=${formatApostrophe(description)}&date=${formatApostrophe(date)}&time_from=${formatApostrophe(time_from)}&time_to=${formatApostrophe(time_to)}&users=${formatApostrophe(users)}&corp_id=${formatApostrophe(corp_id)}&type=${formatApostrophe(type)}&operation_id=${formatApostrophe(operation_id)}&mail=${formatApostrophe(mail)}`, {
        headers: { },
        method: 'POST',
      });
      const data = await response.json();
      NotificationManager.success('Rendez-vous sauvegardé avec succès!', 'Successful!', 1500);

      dispatch(createNoAuthEventSuccess());
    } catch (error) {
      NotificationManager.error('Erreur lors de la sauvegarde du rendez-vous!', 'Error!');
      dispatch(createNoAuthEventFailure());
    }
  };
}



export const getNoAuthRdvInfos = () => ({
  type: GET_NOAUTH_INFOS,
});

export const getNoAuthRdvInfosSuccess = (events) => ({
  type: GET_NOAUTH_INFOS_SUCCESS,
  payload: events,
});

export const getNoAuthRdvInfosFailure = () => ({
  type: GET_NOAUTH_INFOS_FAILURE,
});

export function fetchGetNoAuthRdvInfos(id) {
  return async (dispatch) => {
    dispatch(getNoAuthRdvInfos());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/noauth/rdvpage?id=${formatApostrophe(id)}`, {
        headers: { },
        method: 'GET',
      });
      const data = await response.json();
      dispatch(getNoAuthRdvInfosSuccess(JSON.parse(data.body)));
    } catch (error) {
      dispatch(getNoAuthRdvInfosFailure());
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
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?event_id=${formatApostrophe(event_id)}&name=${formatApostrophe(name)}&description=${formatApostrophe(description)}&time_from=${formatApostrophe(time_from)}&time_to=${formatApostrophe(time_to)}&users=${formatApostrophe(users)}`, {
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
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?id=${formatApostrophe(id)}`, {
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
