import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import groupBy from 'lodash.groupby';

import { actions, marketplaceNoFilterText } from '../reducers/marketplace';
import { Filters } from './Filters';

const MarketplaceView = (props) => {
  const {
    error,
    items,
    filters,
    activeFilter,
    filterItems,
  } = props;
  if (!error && !items) { return null; }
  if (error) { return <div>{error}</div>; }

  // For code reviewer: this layout is temporary and will change for sure :-)
  return (
    <article>
      <Filters
        filters={filters}
        active={activeFilter}
        noFilterText={marketplaceNoFilterText}
        onChange={filterItems}
      />
      <table className="marketplace">
        <thead>
          <tr>
            <th>Category</th>
            <th>HW id</th>
            <th>Description</th>
            <th>Current price</th>
            <th>Condition</th>
            <th>Purchase date</th>
            <th>Purchase price</th>
            <th>Store</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>{item.current_price}</td>
                <td>{item.condition}</td>
                <td>{item.purchase_date}</td>
                <td>{item.purchase_price}</td>
                <td>{item.store}</td>
                <td>{item.comment}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </article>
  );
};

const getMarket = (state) => (state.market);

const getMarketItems = createSelector(getMarket, (market) => (market.items));
const getMarketItemsByCategory = createSelector(getMarketItems, (items) => (groupBy(items, 'category')));

const getMarketActiveFilter = createSelector(getMarket, (market) => (market.activeFilter));

const getMarketFilteredItems = createSelector(
  getMarketItems,
  getMarketItemsByCategory,
  getMarketActiveFilter,
  (items, itemsByCategory, activeFilter) => (activeFilter ? itemsByCategory[activeFilter] : items),
);

const mapStateToProps = (state) => ({
  filters: state.market.filters,
  activeFilter: state.market.activeFilter,
  items: getMarketFilteredItems(state),
  error: state.market.error,
});

const mapDispatchToProps = (dispatch) => ({
  filterItems: (event) => { dispatch(actions.marketplaceFilter(event.target.value)); },
});

export const Marketplace = connect(mapStateToProps, mapDispatchToProps)(MarketplaceView);
