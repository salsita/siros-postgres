import { createReducer, createActions } from 'reduxsauce';
import { config } from '../config';

const initialState = {
  items: null,
  error: null,
};

const { Types, Creators } = createActions({
  hwListRequest: null, // handled in saga
  hwListUpdate: ['items', 'error'], // handled here
  hwListReset: null, // handled here
});

export const types = Types;
export const actions = Creators;

// handlers

const { getAgedPrice } = config.hwItems;
const update = (state = initialState, action) => { // eslint-disable-line no-unused-vars
  if (action.items) {
    const today = (new Date()).toISOString().substr(0, 10);
    const arr = action.items.map((elem) => {
      let price = getAgedPrice(elem.purchase_price, elem.purchase_date, today);
      if (elem.max_price !== null) { price = Math.min(elem.max_price, price); }
      return {
        ...elem,
        current_price: price,
      };
    });
    return {
      items: arr,
      error: null,
    };
  }
  return {
    items: null,
    error: action.error,
  };
};

const reset = (state = initialState, action) => ( // eslint-disable-line no-unused-vars
  {
    items: null,
    error: null,
  }
);

// reducer
export const reducer = createReducer(
  initialState,
  {
    [Types.HW_LIST_UPDATE]: update,
    [Types.HW_LIST_RESET]: reset,
  },
);
