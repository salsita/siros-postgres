import { createReducer, createActions } from 'reduxsauce';

const initialState = {
  name: null,
  email: null,
};

const { Types, Creators } = createActions({
  //
  userLoginRequest: null, // handled in user saga
  userLogoutRequest: null, // handled in user saga
  //
  userVerifyRequest: null, // handled in user saga
  userVerifySuccess: ['name', 'email'], // handled here, error case handled in saga
});

export const types = Types;
export const actions = Creators;

// handlers

const reset = (state = initialState, action) => ({ // eslint-disable-line no-unused-vars
  ...state,
  name: null,
  email: null,
});

const verifySuccess = (state = initialState, action) => ({
  ...state,
  name: action.name,
  email: action.email,
});

// reducer
export const reducer = createReducer(
  initialState,
  {
    [Types.USER_LOGOUT_REQUEST]: reset,
    [Types.USER_VERIFY_SUCCESS]: verifySuccess,
  },
);
