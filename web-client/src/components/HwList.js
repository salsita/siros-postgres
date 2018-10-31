import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { actions } from '../reducers/hw-list';

export class HwListView extends PureComponent {
  render() {
    const { error, items } = this.props.list;
    if (!error && !items) { return null; }

    // For code reviewer: this layout is temporary and will change for sure :-)
    return (
      <article>
        {error && <div>{error}</div>}
        {items && (
          <table className="hw-list">
            <thead>
              <tr>
                <th>Purchase date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Purchase price</th>
                <th>Current price</th>
                <th>Active</th>
                <th>On marketplace</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.purchase_date}</td>
                    <td>{item.category}</td>
                    <td>{item.description}</td>
                    <td>{item.purchase_price}</td>
                    <td>{item.current_price}</td>
                    <td>{item.active ? 'yes' : 'no'}</td>
                    <td>{item.available ? 'yes' : 'no'}</td>
                    <td>{item.comment || ''}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
      </article>
    );
  }

  componentDidMount() {
    this.props.dispatch(actions.hwListRequest());
  }
}

const mapStateToProps = (state) => ({
  list: state.list,
});

export const HwList = connect(mapStateToProps)(HwListView);
