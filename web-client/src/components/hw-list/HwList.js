import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import cx from 'classnames';

import { HwListItemSmall } from './HwListItemSmall';
import { HwListItemBig } from './HwListItemBig';
import './HwList.css';

const HwListView = (props) => {
  const { error, items } = props.list;
  if (!error && !items) { return null; }
  return (
    <article>
      {error && <Typography variant="h6" color="error">{error}!</Typography>}
      {items && items.map((item) => {
        const cardClass = cx({
          'card-inactive': !item.active,
          'card-marketplace': item.active && item.available,
        });
        return (
          <React.Fragment key={item.id}>
            <Hidden smUp>
              <HwListItemSmall hwItem={item} cardClass={cardClass} />
            </Hidden>
            <Hidden xsDown>
              <HwListItemBig hwItem={item} cardClass={cardClass} />
            </Hidden>
          </React.Fragment>
        );
      })}
    </article>
  );
};

const mapStateToProps = (state) => ({
  list: state.list,
});

export const HwList = connect(mapStateToProps)(HwListView);
