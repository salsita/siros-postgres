import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import groupBy from 'lodash.groupby';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import { actions, marketplaceNullFilterValue } from '../../reducers/marketplace';
import { MarketplaceItemSmall } from './MarketplaceItemSmall';
import { MarketplaceItemBig } from './MarketplaceItemBig';
import { Filters } from './Filters';
import './Marketplace.css';

const MarketplaceView = (props) => {
  const { error, items } = props;
  const { filters, activeFilter } = props;
  const { filterItems } = props;
  if (!error && !items) { return null; }
  return (
    <>
      {items && (
        <Filters
          filters={filters}
          active={activeFilter}
          filterNullValue={marketplaceNullFilterValue}
          className="before-article"
          onChange={(event) => filterItems(event.target.value)}
        />
      )}
      <article>
        {error && <Typography variant="h6" color="error">{error}!</Typography>}
        {items && items.map((item) => (
          <React.Fragment key={item.id}>
            <Hidden smUp>
              <MarketplaceItemSmall hwItem={item} />
            </Hidden>
            <Hidden xsDown>
              <MarketplaceItemBig hwItem={item} />
            </Hidden>
          </React.Fragment>
        ))}
      </article>
    </>
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

const mapDispatchToProps = {
  filterItems: actions.marketplaceFilter,
};

export const Marketplace = connect(mapStateToProps, mapDispatchToProps)(MarketplaceView);
