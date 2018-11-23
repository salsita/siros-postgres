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
  hwListItemChange: ['index'], // handled here
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

const changeCollapsed = (state = initialState, action) => {
  if (!state.items || !state.items[action.index]) { return state; }
  const updated = [...(state.items)];
  const elem = updated[action.index];
  elem.collapsed = !elem.collapsed;
  return {
    ...state,
    items: updated,
  };
};

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
    [Types.HW_LIST_ITEM_CHANGE]: changeCollapsed,
    [userTypes.USER_LOGOUT_REQUEST]: reset,
  },
);
