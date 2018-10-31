import { createReducer, createActions } from 'reduxsauce';
import { config } from '../config';

const initialState = {
  filters: null,
  activeFilter: null,
  items: null,
  error: null,
};

const storedFilter = localStorage.getItem('sirosActiveFilter');
initialState.activeFilter = (storedFilter && storedFilter !== '') ? storedFilter : null;

const { Types, Creators } = createActions({
  marketplaceRequest: null, // handled in saga
  marketplaceUpdate: ['response', 'error'], // handled here
  marketplaceFilter: ['category'], // handled here
  marketplaceReset: null, // handled here
});

export const types = Types;
export const actions = Creators;

// handlers

const { getAgedPrice } = config.hwItems;
const update = (state = initialState, action) => { // eslint-disable-line no-unused-vars
  const { response, error } = action;
  if (response) {
    const today = (new Date()).toISOString().substr(0, 10);
    const filters = {};
    response.forEach((item) => {
      filters[item.category] = true;
      item.current_price = getAgedPrice(item.purchase_price, item.purchase_date, today);
    });
    let filterArr = Object.keys(filters).sort();
    if (filterArr.length < 2) {
      filterArr = null;
    } else {
      filterArr.unshift(null); // null = no filter applied
    }
    const activeFilter = (filterArr && filterArr.includes(state.activeFilter)) ? state.activeFilter : null;
    return {
      filters: filterArr,
      activeFilter,
      items: response,
      error: null,
    };
  }
  return {
    ...state,
    filters: null,
    items: null,
    error,
  };
};

const filter = (state = initialState, action) => {
  const active = (action.category !== '-- all --') ? action.category : null;
  localStorage.setItem('sirosActiveFilter', active || '');
  return {
    ...state,
    activeFilter: active,
  };
};

const reset = (state = initialState, action) => ( // eslint-disable-line no-unused-vars
  {
    ...state,
    filters: null,
    items: null,
    error: null,
  }
);

// reducer
export const reducer = createReducer(
  initialState,
  {
    [Types.MARKETPLACE_UPDATE]: update,
    [Types.MARKETPLACE_FILTER]: filter,
    [Types.MARKETPLACE_RESET]: reset,
  },
);
