import { NotificationManager } from 'react-notifications';

export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAILURE = 'AUTHENTICATE_FAILURE';

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

export const LOGOUT = 'LOGOUT';

export const logout = () => ({
  type: LOGOUT,
});
