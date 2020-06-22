import { NotificationManager } from 'react-notifications';

export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAILURE = 'AUTHENTICATE_FAILURE';

export const GET_OFFDAYS = 'GET_OFFDAYS';
export const GET_OFFDAYS_SUCCESS = 'GET_OFFDAYS_SUCCESS';
export const GET_OFFDAYS_FAILURE = 'GET_OFFDAYS_FAILURE';

export const GET_COMPANY_OFFDAYS = 'GET_COMPANY_OFFDAYS';
export const GET_COMPANY_OFFDAYS_SUCCESS = 'GET_COMPANY_OFFDAYS_SUCCESS';
export const GET_COMPANY_OFFDAYS_FAILURE = 'GET_COMPANY_OFFDAYS_FAILURE';

export const authenticate = () => ({
  type: AUTHENTICATE,
});

export const authenticateSuccess = (events) => ({
  type: AUTHENTICATE_SUCCESS,
  payload: events,
});

export const authenticateFailure = () => ({
  type: AUTHENTICATE_FAILURE,
});

export function requestAuthentication(mail, password) {
  return async (dispatch) => {
    dispatch(authenticate());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/authentication?mail=${mail}&password=${password}`);
      const data = await response.json();

      if (data.statusCode === 200) {
        dispatch(authenticateSuccess(data.body));
      } else {
        NotificationManager.error(`Authentication error: ${data.body}!`, 'Error!');
        dispatch(authenticateFailure());
      }
    } catch (error) {
      NotificationManager.error(`Authentication error!`, 'Error!');
      dispatch(authenticateFailure());
    }
  };
}

export const getOffDays = () => ({
  type: GET_OFFDAYS,
});

export const getOffDaysSuccess = (events) => ({
  type: GET_OFFDAYS_SUCCESS,
  payload: events,
});

export const getOffDaysFailure = () => ({
  type: GET_OFFDAYS_FAILURE,
});

export function requestGetOffDays(user_id, sessionToken) {
  return async (dispatch) => {
    dispatch(getOffDays());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/offdays?user_id=${user_id}`,
        { headers: { authorization: sessionToken } });

      const data = await response.json();

      if (data.statusCode === 200) {
        dispatch(getOffDaysSuccess(JSON.parse(data.body)));
      } else {
        NotificationManager.error(`Error when fetching off days`, 'Error!');
        dispatch(getOffDaysFailure());
      }
    } catch (error) {
      NotificationManager.error(`Error when fetching off days`, 'Error!');
      dispatch(getOffDaysFailure());
    }
  };
}

export const getCompanyOffDays = () => ({
  type: GET_COMPANY_OFFDAYS,
});

export const getCompanyOffDaysSuccess = (events) => ({
  type: GET_COMPANY_OFFDAYS_SUCCESS,
  payload: events,
});

export const getCompanyOffDaysFailure = () => ({
  type: GET_COMPANY_OFFDAYS_FAILURE,
});

export function requestGetCompanyOffDays(sessionToken) {
  return async (dispatch) => {
    dispatch(getCompanyOffDays());

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/companyoffdays`,
        { headers: { authorization: sessionToken } });

      const data = await response.json();

      if (data.statusCode === 200) {
        dispatch(getCompanyOffDaysSuccess(JSON.parse(data.body)));
      } else {
        NotificationManager.error(`Error when fetching off days`, 'Error!');
        dispatch(getCompanyOffDaysFailure());
      }
    } catch (error) {
      NotificationManager.error(`Error when fetching off days`, 'Error!');
      dispatch(getCompanyOffDaysFailure());
    }
  };
}

export function addOffDay(user_id, day, sessionToken) {
  return async (dispatch) => {

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/offdays?user_id=${user_id}&date=${day}`,
        { headers: { authorization: sessionToken },
        method: 'PUT', });
    } catch (error) {
      NotificationManager.error(`Error when adding off day`, 'Error!');
      dispatch(addOffDayFailure());
    }
  };
}

export function deleteOffDay(id, sessionToken) {
  return async (dispatch) => {

    try {
      const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/offdays?id=${id}`,
        { headers: { authorization: sessionToken } ,
        method: 'DELETE',});
    } catch (error) {
      NotificationManager.error(`Error when deleting off day`, 'Error!');
      dispatch(deleteOffDayFailure());
    }
  };
}

export const LOGOUT = 'LOGOUT';

export const logout = () => ({
  type: LOGOUT,
});
