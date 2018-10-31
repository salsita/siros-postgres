import { createReducer, createActions } from 'reduxsauce';
import { config } from '../config';

const initialState = {
  name: null,
  email: null,
};

const { Types, Creators } = createActions({
  //
  userLoginRequest: null, // handled here
  //
  userLogoutRequest: null, // handled in user saga
  userReset: null, // handled here and in user saga
  //
  userVerifyRequest: null, // handled in user saga
  userVerifySuccess: ['name', 'email'], // handled here, error case handled in saga
});

export const types = Types;
export const actions = Creators;

// handlers

const login = (state = initialState, action) => { // eslint-disable-line no-unused-vars
  const { protocol, host } = window.location;
  const redirectUrl = `${protocol}//${process.env.NODE_ENV === 'development' ? config.devRedirect : host}/auth/google`;
  window.location.href = redirectUrl;
  return state;
};

const reset = (state = initialState, action) => ( // eslint-disable-line no-unused-vars
  {
    name: null,
    email: null,
  }
);

const verifySuccess = (state = initialState, action) => ( // eslint-disable-line no-unused-vars
  {
    name: action.name,
    email: action.email,
  }
);

// reducer
export const reducer = createReducer(
  initialState,
  {
    [Types.USER_LOGIN_REQUEST]: login,
    [Types.USER_RESET]: reset,
    [Types.USER_VERIFY_SUCCESS]: verifySuccess,
  },
);
