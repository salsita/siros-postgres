import React from 'react';

export const Filters = (props) => {
  const {
    filters,
    active,
    noFilterText,
    onChange,
  } = props;
  if (!filters) { return null; }
  return (
    <section>
      <div>Filters:</div>
      <select onChange={onChange} value={active || noFilterText}>
        {
          filters.map((filter) => {
            const name = filter || noFilterText;
            return <option key={filter} value={filter}>{name}</option>;
          })
        }
      </select>
    </section>
  );
};
