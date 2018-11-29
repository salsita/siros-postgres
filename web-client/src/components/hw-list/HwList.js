import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import { actions } from '../../reducers/hw-list';
import { HwListItemSmallCollapsed } from './HwListItemSmallCollapsed';
import { HwListItemSmallExpanded } from './HwListItemSmallExpanded';
import { HwListItemBig } from './HwListItemBig';
import './HwList.css';

const HwListView = (props) => {
  const { error, items } = props.list;
  const { onClick } = props;
  if (!error && !items) { return null; }
  return (
    <article>
      {error && <Typography variant="h6" color="error">{error}!</Typography>}
      {items && items.map((item, idx) => {
        let cardClass = '';
        if (!item.active) {
          cardClass = 'card-inactive';
        } else if (item.available) {
          cardClass = 'card-marketplace';
        }
        return (
          <React.Fragment key={item.id}>
            <Hidden smUp>
              {item.collapsed
                ? <HwListItemSmallCollapsed hwItem={item} cardClass={cardClass} onClick={onClick(idx)} />
                : <HwListItemSmallExpanded hwItem={item} cardClass={cardClass} onClick={onClick(idx)} />}
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

const mapDispatchToProps = (dispatch) => ({
  onClick: (index) => () => { dispatch(actions.hwListItemChange(index)); },
});

export const HwList = connect(mapStateToProps, mapDispatchToProps)(HwListView);
