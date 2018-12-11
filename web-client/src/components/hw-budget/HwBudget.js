import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import cx from 'classnames';

import { HwBudgetItemSmall } from './HwBudgetItemSmall';
import { HwBudgetItemBig } from './HwBudgetItemBig';
import './HwBudget.css';

const HwBudgetView = (props) => {
  const { error, items, total } = props.budget;
  if (!error && !items) { return null; }
  return (
    <React.Fragment>
      {items && (
        <div className="before-article">
          <Typography variant="h6">Your HW budget: {total}</Typography>
        </div>
      )}
      <article>
        {error && <Typography variant="h6" color="error">{error}!</Typography>}
        {items && items.map((item, idx) => {
          const { amount } = item;
          const cardClass = cx({
            'card-zero': amount === 0,
            'card-plus': amount > 0,
            'card-minus': amount < 0,
          });
          return (
            <React.Fragment key={idx}>
              <Hidden smUp>
                <HwBudgetItemSmall budgetItem={item} cardClass={cardClass} />
              </Hidden>
              <Hidden xsDown>
                <HwBudgetItemBig budgetItem={item} cardClass={cardClass} />
              </Hidden>
            </React.Fragment>
          );
        })}
      </article>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  budget: state.budget,
});

export const HwBudget = connect(mapStateToProps)(HwBudgetView);
