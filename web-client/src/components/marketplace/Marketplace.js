import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import groupBy from 'lodash.groupby';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import { actions, marketplaceNullFilterValue } from '../../reducers/marketplace';
import { MarketplaceItemSmallCollapsed } from './MarketplaceItemSmallCollapsed';
import { MarketplaceItemSmallExpanded } from './MarketplaceItemSmallExpanded';
import { Filters } from './Filters';
import './Marketplace.css';

const MarketplaceView = (props) => {
  const { error, items } = props;
  const { filters, activeFilter } = props;
  const { filterItems, onClick } = props;
  if (!error && !items) { return null; }
  if (error) { return <Typography variant="h6" color="error">{error}!</Typography>; }
  return (
    <article>
      <Filters
        filters={filters}
        active={activeFilter}
        filterNullValue={marketplaceNullFilterValue}
        onChange={filterItems}
      />
      {items && items.map((item) => (
        <React.Fragment key={item.id}>
          <Hidden smUp>
            {item.collapsed
              ? <MarketplaceItemSmallCollapsed hwItem={item} onClick={onClick(item.idx)} />
              : <MarketplaceItemSmallExpanded hwItem={item} onClick={onClick(item.idx)} />}
          </Hidden>
          <Hidden xsDown>
            { null /* <HwListItemBig hwItem={item} cardClass={cardClass} /> */ }
          </Hidden>
        </React.Fragment>
      ))}
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
  onClick: (index) => () => { dispatch(actions.marketplaceItemChange(index)); },
});

export const Marketplace = connect(mapStateToProps, mapDispatchToProps)(MarketplaceView);
