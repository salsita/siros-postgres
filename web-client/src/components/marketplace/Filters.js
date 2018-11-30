import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export const Filters = (props) => {
  const {
    filters,
    active,
    filterNullValue,
    onChange,
  } = props;
  if (!filters) { return null; }
  return (
    <form autoComplete="off">
      <FormControl>
        <InputLabel htmlFor="filter">category filter:</InputLabel>
        <Select
          className="select"
          value={active || filterNullValue}
          onChange={onChange}
          inputProps={{ id: 'filter' }}
        >
          {filters.map((item) => (
            <MenuItem className="select-item" key={item || filterNullValue} value={item || filterNullValue}>
              {item || <em>none</em>}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  );
};
