import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { actions } from '../reducers/marketplace';
import { Filters } from './index';

export class MarketplaceView extends PureComponent {
  render() {
    const {
      error,
      items,
      filters,
      activeFilter,
      filterItems,
    } = this.props;
    if (!error && !items) { return null; }
    if (error) { return <div>{error}</div>; }

    // For code reviewer: this layout is temporary and will change for sure :-)
    return (
      <article>
        <Filters filters={filters} active={activeFilter} onChange={filterItems} />
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
  }

  componentDidMount() {
    this.props.getMarketplaceData();
  }
}

// 'reselect' library doesn't work for me, it is not memoizing the results
// TODO: ask Brano how to use 'reselect' properly

const cache = {
  items: null,
  memory: {
  },
};

const getFilteredItems = (state) => {
  const filter = state.market.activeFilter;
  const { items } = state.market;
  if (!filter || !items) { return items; }
  if ((items === cache.items) && cache.memory[filter]) { return cache.memory[filter]; }
  if (items !== cache.items) {
    cache.memory = {};
    cache.items = items;
  }
  cache.memory[filter] = items.filter((item) => (item.category === filter));
  return cache.memory[filter];
};

const mapStateToProps = (state) => ({
  filters: state.market.filters,
  activeFilter: state.market.activeFilter,
  items: getFilteredItems(state),
  error: state.market.error,
});

const mapDispatchToProps = (dispatch) => ({
  filterItems: (event) => { dispatch(actions.marketplaceFilter(event.target.value)); },
  getMarketplaceData: () => { dispatch(actions.marketplaceRequest()); },
});

export const Marketplace = connect(mapStateToProps, mapDispatchToProps)(MarketplaceView);
