export const GET_USERS = 'GET_USERS'
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS'
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE'

export const getUsers = () => ({
    type: GET_USERS,
})

export const getUsersSuccess = events => ({
    type: GET_USERS_SUCCESS,
    payload: events,
})

export const getUsersFailure = () => ({
    type: GET_USERS_FAILURE,
})

export function fetchUsers(corpId, sessionToken) {
    return async dispatch => {
        dispatch(getUsers())

        try {
            const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/users?corpId=${corpId}`,
            {headers: {authorization: sessionToken}});
            const data = await response.json();

            dispatch(getUsersSuccess(JSON. parse(data.body)));
        } catch (error) {
            dispatch(getUsersFailure());
        }
    }
}