import { createReducer, createActions } from 'reduxsauce';
import uniq from 'lodash.uniq';
import { types as userTypes } from './user';

const initialState = {
  filters: null,
  activeFilter: null,
  items: null,
  error: null,
};

const { Types, Creators } = createActions({
  marketplaceRequest: null, // handled in saga
  marketplaceUpdateData: ['response'], // handled here
  marketplaceUpdateError: ['error'], // handled here
  marketplaceFilter: ['category'], // handled here and in the saga
});

export const types = Types;
export const actions = Creators;

// handlers

const updateData = (state = initialState, action) => {
  // collect categories based on which we can filter the list items
  let filters = uniq(action.response.items.map((elem) => (elem.category))).sort();
  if (filters.length < 2) {
    // if there is just one category, there is no reason to offer that for filtering
    filters = null;
  } else {
    // if we have some categories to filter on, we need to be able to turn the filtering off
    filters.unshift(null); // null = no filter applied
  }
  // verify that our current active filter can still be used (otherwise reset to "no filter")
  const activeFilter = (filters && filters.includes(state.activeFilter)) ? state.activeFilter : null;
  return {
    ...state,
    filters,
    activeFilter,
    items: action.response.items,
    error: null,
  };
};

const updateError = (state = initialState, action) => ({
  ...state,
  filters: null,
  items: null,
  error: action.error,
});

export const marketplaceNullFilterValue = '__all__';

const filter = (state = initialState, action) => ({
  ...state,
  activeFilter: action.category === marketplaceNullFilterValue ? null : action.category,
});

const reset = (state = initialState, action) => ({ // eslint-disable-line no-unused-vars
  ...state,
  filters: null,
  items: null,
  error: null,
});

// reducer
export const reducer = createReducer(
  initialState,
  {
    [Types.MARKETPLACE_UPDATE_DATA]: updateData,
    [Types.MARKETPLACE_UPDATE_ERROR]: updateError,
    [Types.MARKETPLACE_FILTER]: filter,
    [userTypes.USER_LOGOUT_REQUEST]: reset,
  },
);
