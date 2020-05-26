export const GET_USERS = 'GET_USERS'
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS'
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE'

export const INVITE_USER = 'INVITE_USER'
export const INVITE_USER_SUCCESS = 'INVITE_USER_SUCCESS'
export const INVITE_USER_FAILURE = 'INVITE_USER_FAILURE'

export const CREATE_USER = 'CREATE_USER'
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS'
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE'

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

export const inviteUser = () => ({
    type: INVITE_USER,
})

export const inviteUserSuccess = () => ({
    type: INVITE_USER_SUCCESS,
})

export const inviteUserFailure = () => ({
    type: INVITE_USER_FAILURE,
})

export function requestInviteUser(mail, sessionToken) {
    return async dispatch => {
        dispatch(inviteUser())

        try {
            const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/users/invite?mail=${mail}`,{
                headers: {authorization: sessionToken},
                method: "PUT",
            });
            const data = await response.json();

            dispatch(inviteUserSuccess());
        } catch (error) {
            dispatch(inviteUserFailure());
        }
    }
}

export const createUser = () => ({
    type: INVITE_USER,
})

export const createUserSuccess = () => ({
    type: INVITE_USER_SUCCESS,
})

export const createUserFailure = () => ({
    type: INVITE_USER_FAILURE,
})

export function requestcreateUser(name, mail, password, status, corp_id ) {
    return async dispatch => {
        dispatch(createUser())

        try {
            const response = await fetch(`https://i8jk577b46.execute-api.eu-west-3.amazonaws.com/alpha/users?mail=${name}&name=${mail}&password=${password}&status=${status}&corp_id=${corp_id}`,{
                method: "PUT",
            })
            const data = await response.json();

            dispatch(createUserSuccess());
        } catch (error) {
            dispatch(createUserFailure());
        }
    }
}