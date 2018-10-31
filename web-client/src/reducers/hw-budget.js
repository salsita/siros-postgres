import { createReducer, createActions } from 'reduxsauce';

const initialState = {
  total: null,
  items: null,
  error: null,
};

const { Types, Creators } = createActions({
  hwBudgetRequest: null, // handled in saga
  hwBudgetUpdate: ['response', 'error'], // handled here
  hwBudgetReset: null, // handled here
});

export const types = Types;
export const actions = Creators;

// handlers

const update = (state = initialState, action) => { // eslint-disable-line no-unused-vars
  const { response, error } = action;
  if (response) {
    return {
      total: response.total,
      items: response.items,
      error: null,
    };
  }
  return {
    total: null,
    items: null,
    error,
  };
};

const reset = (state = initialState, action) => ( // eslint-disable-line no-unused-vars
  {
    total: null,
    items: null,
    error: null,
  }
);

// reducer
export const reducer = createReducer(
  initialState,
  {
    [Types.HW_BUDGET_UPDATE]: update,
    [Types.HW_BUDGET_RESET]: reset,
  },
);
