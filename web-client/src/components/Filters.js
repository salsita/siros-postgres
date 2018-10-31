import React, { PureComponent } from 'react';

export class Filters extends PureComponent {
  render() {
    const { filters, active, onChange } = this.props;
    if (!filters || filters.length < 2) { return null; }
    return (
      <section>
        <div>Filters:</div>
        <select onChange={onChange} value={active || '-- all --'}>
          {
            filters.map((filter) => {
              const name = (filter !== null) ? filter : '-- all --';
              return <option key={filter} value={filter}>{name}</option>;
            })
          }
        </select>
      </section>
    );
  }
}
