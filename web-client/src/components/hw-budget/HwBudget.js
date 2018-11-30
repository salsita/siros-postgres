import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import { actions } from '../../reducers/hw-budget';
import { HwBudgetItemSmall } from './HwBudgetItemSmall';
import { HwBudgetItemBig } from './HwBudgetItemBig';
import './HwBudget.css';

const HwBudgetView = (props) => {
  const { error, items, total } = props.budget;
  const { onClick } = props;
  if (!error && !items) { return null; }
  return (
    <article>
      {error && <Typography variant="h6" color="error">{error}!</Typography>}
      {items && (
        <React.Fragment>
          <Typography variant="h6">Your HW budget: {total}</Typography>
          {items.map((item, idx) => {
            let cardClass = 'card-zero';
            if (item.amount > 0) { cardClass = 'card-plus'; }
            if (item.amount < 0) { cardClass = 'card-minus'; }
            return (
              <React.Fragment key={idx}>
                <Hidden smUp>
                  <HwBudgetItemSmall budgetItem={item} cardClass={cardClass} onClick={onClick(idx)} />
                </Hidden>
                <Hidden xsDown>
                  <HwBudgetItemBig budgetItem={item} cardClass={cardClass} />
                </Hidden>
              </React.Fragment>
            );
          })}
        </React.Fragment>
      )}
    </article>
  );
};

const mapStateToProps = (state) => ({
  budget: state.budget,
});

const mapDispatchToProps = (dispatch) => ({
  onClick: (idx) => () => { dispatch(actions.hwBudgetItemChange(idx)); },
});

export const HwBudget = connect(mapStateToProps, mapDispatchToProps)(HwBudgetView);
