import { createReducer, createActions } from 'reduxsauce';
import { types as userTypes } from './user';

const initialState = {
  items: null,
  error: null,
};

const { Types, Creators } = createActions({
  hwListRequest: null, // handled in saga
  hwListUpdateData: ['response'], // handled here
  hwListUpdateError: ['error'], // handled here
});

export const types = Types;
export const actions = Creators;

// handlers

const updateData = (state = initialState, action) => ({
  ...state,
  items: action.response.items,
  error: null,
});

const updateError = (state = initialState, action) => ({
  ...state,
  items: null,
  error: action.error,
});

const reset = (state = initialState, action) => ({ // eslint-disable-line no-unused-vars
  ...state,
  items: null,
  error: null,
});

// reducer
export const reducer = createReducer(
  initialState,
  {
    [Types.HW_LIST_UPDATE_DATA]: updateData,
    [Types.HW_LIST_UPDATE_ERROR]: updateError,
    [userTypes.USER_LOGOUT_REQUEST]: reset,
  },
);
