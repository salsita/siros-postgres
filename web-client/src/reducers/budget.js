import { createReducer, createActions } from 'reduxsauce';
import { types as userTypes } from './user';

const initialState = {
  total: null,
  items: null,
  error: null,
};

const { Types, Creators } = createActions({
  budgetRequest: null, // handled in saga
  budgetUpdateData: ['response'], // handled here
  budgetUpdateError: ['error'], // handled here
});

export const types = Types;
export const actions = Creators;

// handlers

const updateData = (state = initialState, action) => ({
  ...state,
  total: action.response.total,
  items: action.response.items,
  error: null,
});

const updateError = (state = initialState, action) => ({
  ...state,
  total: null,
  items: null,
  error: action.error,
});

const reset = (state = initialState, action) => ({ // eslint-disable-line no-unused-vars
  ...state,
  total: null,
  items: null,
  error: null,
});

// reducer
export const reducer = createReducer(
  initialState,
  {
    [Types.BUDGET_UPDATE_DATA]: updateData,
    [Types.BUDGET_UPDATE_ERROR]: updateError,
    [userTypes.USER_LOGOUT_REQUEST]: reset,
  },
);
