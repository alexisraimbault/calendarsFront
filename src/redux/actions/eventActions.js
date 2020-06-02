export const GET_EVENTS = 'GET_EVENTS'
export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS'
export const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE'

export const PUT_EVENTS = 'PUT_EVENTS'
export const PUT_EVENTS_SUCCESS = 'PUT_EVENTS_SUCCESS'
export const PUT_EVENTS_FAILURE = 'PUT_EVENTS_FAILURE'

export const UPDATE_EVENT = 'UPDATE_EVENT'
export const UPDATE_EVENT_SUCCESS = 'UPDATE_EVENT_SUCCESS'
export const UPDATE_EVENT_FAILURE = 'UPDATE_EVENT_FAILURE'

export const getEvents = () => ({
    type: GET_EVENTS,
  })
  
export const getEventsSuccess = events => ({
  type: GET_EVENTS_SUCCESS,
  payload: events,
  })

export const getEventsFailure = () => ({
  type: GET_EVENTS_FAILURE,
  })

export function fetchEvents(date, sessionToken) {
  return async dispatch => {
    dispatch(getEvents())

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?date=${date}`,
      {headers: {authorization: sessionToken}});
      const data = await response.json();

      dispatch(getEventsSuccess(JSON. parse(data.body)));
    } catch (error) {
      dispatch(getEventsFailure());
    }
  }
}

export const putEvents = () => ({
  type: PUT_EVENTS,
})

export const putEventsSuccess = events => ({
  type: PUT_EVENTS_SUCCESS,
  payload: events,
})

export const putEventsFailure = () => ({
type: PUT_EVENTS_FAILURE,
})

export function createEvent(name, description, date, time_from, time_to, users, sessionToken) {
  return async dispatch => {
    dispatch(putEvents())

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?name=${name}&description=${description}&date=${date}&time_from=${time_from}&time_to=${time_to}&users=${users}`,{
        headers: {authorization: sessionToken},
        method: "PUT",
      });
      const data = await response.json();

      dispatch(putEventsSuccess());
    } catch (error) {
      dispatch(putEventsFailure());
    }
  }
}

export const updateEvent = () => ({
  type: UPDATE_EVENT,
})

export const updateEventSuccess = () => ({
  type: UPDATE_EVENT_SUCCESS,
})

export const updateEventFailure = () => ({
  type: UPDATE_EVENT_FAILURE,
})

export function postUpdateEvent(event_id, name, description, time_from, time_to, users, sessionToken) {
  return async dispatch => {
    dispatch(updateEvent())

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/events?event_id=${event_id}&name=${name}&description=${description}&time_from=${time_from}&time_to=${time_to}&users=${users}&`, {
        headers: {authorization: sessionToken},
        method: "POST",
      });

      dispatch(updateEventSuccess());
    } catch (error) {
      dispatch(updateEventFailure());
    }
  }
}